import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// The shipped headers intentionally use a JSON-valued subset of YAML.
// This parser validates that subset, not arbitrary third-party YAML.
function parseHeader(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, 'Falta frontmatter');
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s+(.+)$/);
    assert.ok(field, 'Usar campos YAML con valor JSON: ' + line);
    assert.ok(!Object.hasOwn(values, field[1]), 'Campo duplicado');
    values[field[1]] = JSON.parse(field[2]);
  }
  assert.equal(typeof values.name, 'string');
  assert.match(values.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(values.name.length <= 64);
  assert.equal(typeof values.description, 'string');
  assert.ok(values.description.length > 0 && values.description.length <= 1024);
  return values;
}
const skillRoot = resolve(root, '.agents/skills');
const skills = (await readdir(skillRoot, { withFileTypes: true })).filter(x => x.isDirectory());
const names = new Set();
for (const entry of skills) {
  const path = resolve(skillRoot, entry.name, 'SKILL.md');
  const text = await readFile(path, 'utf8');
  const meta = parseHeader(text);
  assert.equal(meta.name, entry.name);
  assert.ok(!names.has(meta.name), 'Skill duplicada');
  names.add(meta.name);
  assert.ok(Object.keys(meta).every(key => ['name', 'description', 'license', 'metadata'].includes(key)));
}
const supportedTools = new Set(['view_file', 'grep_search', 'replace_file_content', 'run_command']);
const agentRoot = resolve(root, '.agents/agents');
const agents = (await readdir(agentRoot)).filter(x => x.endsWith('.md'));
for (const file of agents) {
  const meta = parseHeader(await readFile(resolve(agentRoot, file), 'utf8'));
  assert.equal(meta.name + '.md', file);
  assert.equal(meta.subagent, true);
  assert.equal(meta.mainAgent, false);
  assert.ok(Array.isArray(meta.tools) && meta.tools.length > 0);
  assert.ok(meta.tools.every(tool => supportedTools.has(tool)), 'Herramienta no documentada');
  assert.ok(Array.isArray(meta.skills));
  for (const path of meta.skills) {
    assert.ok(path.startsWith('.agents/skills/') && !path.includes('..'));
    assert.ok((await stat(resolve(root, path, 'SKILL.md'))).isFile(), 'Skill de agente ausente');
  }
}
assert.ok(skills.length && agents.length);
console.log('OK: ' + skills.length + ' skills y ' + agents.length + ' agentes; frontmatter y referencias locales válidos.');
console.log('El cliente debe comprobar disponibilidad real de herramientas y delegación.');
