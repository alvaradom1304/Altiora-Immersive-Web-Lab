import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, symlink, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {diagnose, inspectClients, summarizeMCP} from './capability-doctor.mjs';

test('configuration presence never establishes live access or leaks credentials', () => {
  const result = summarizeMCP(JSON.stringify({mcpServers: {'altiora-after-effects': {command: 'node', args: ['script'], env: {TOKEN: 'private-value'}, trust: false}}}), 'json');
  assert.equal(result.status, 'ENTRY_SHAPE_PRESENT');
  assert.equal(result.trusted, false);
  assert.ok(!JSON.stringify(result).includes('private-value'));
  assert.equal(summarizeMCP('{"mcpServers":{"altiora-after-effects":{"command":42}}}', 'json').status, 'INVALID_ENTRY');
  assert.throws(() => summarizeMCP('bad json', 'json'));
});
test('Codex disabled flag is limited to its own section, no TOML validity claim', () => {
  const result = summarizeMCP('[mcp_servers.altiora-after-effects]\ncommand="node"\nenabled = false\n[other]\nenabled=true\n', 'toml');
  assert.equal(result.enabled, false);
  assert.equal(result.status, 'ENTRY_TEXT_PRESENT_NOT_TOML_VALIDATED');
  assert.equal(summarizeMCP('[other]\nenabled=true', 'toml').status, 'ENTRY_NOT_FOUND');
});
test('missing and malformed project configuration remain unverified', async () => {
  const root = await mkdtemp(join(tmpdir(), 'altiora-doctor-'));
  try {
    await writeFile(join(root, '.mcp.json'), 'malformed secret-value');
    const clients = await inspectClients(root);
    assert.equal(clients.length, 5);
    assert.ok(clients.every(c => c.connection === 'NOT_VERIFIED' && c.execution_test === 'NOT_PERFORMED'));
    assert.equal(clients[0].mcp_config.status, 'INVALID_UNREADABLE_OR_UNSAFE');
    assert.equal(clients[1].mcp_config.status, 'MISSING');
    assert.ok(!JSON.stringify(clients).includes('secret-value'));
  } finally {await rm(root, {recursive: true, force: true});}
});
test('directory links to external configuration are rejected', async () => {
  const root = await mkdtemp(join(tmpdir(), 'altiora-doctor-'));
  const external = await mkdtemp(join(tmpdir(), 'altiora-external-'));
  try {
    await writeFile(join(external, 'settings.json'), '{"mcpServers":{}}');
    await symlink(external, join(root, '.gemini'), process.platform === 'win32' ? 'junction' : 'dir');
    const row = (await inspectClients(root)).find(c => c.client === 'gemini-cli');
    assert.equal(row.mcp_config.status, 'INVALID_UNREADABLE_OR_UNSAFE');
  } finally {await rm(root, {recursive: true, force: true}); await rm(external, {recursive: true, force: true});}
});
test('bounded files and detected executables cannot become render or client certification', async () => {
  const root = await mkdtemp(join(tmpdir(), 'altiora-doctor-'));
  try {
    await mkdir(join(root, '.codex'));
    await writeFile(join(root, '.codex/config.toml'), 'x'.repeat(262145));
    const result = await diagnose({root,
      visualProbe: async () => ({execution_context: 'TEST_MACHINE', tools: [{name: 'Python 3', status: 'NOT_FOUND'}]}),
      aeProbe: () => ({available: true, executable: 'private/path'}),
      executableProbe: (name) => ({name, status: 'AVAILABLE', version: 'fixture'})});
    assert.equal(result.tools.find(t => t.name === 'After Effects aerender').status, 'DETECTED_NOT_RENDER_TESTED');
    assert.equal(result.clients[1].mcp_config.status, 'INVALID_UNREADABLE_OR_UNSAFE');
    assert.ok(!JSON.stringify(result).includes('private/path'));
  } finally {await rm(root, {recursive: true, force: true});}
});
