import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { loadAgents, frontmatterField } from './skill-catalog.mjs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(resolve(root, p), 'utf8').then(t => t.replace(/\r\n/g, '\n'));

test('core skills are model-discoverable, reserve skills stay invocable, all resolve to a source', async () => {
  const coreList = JSON.parse(await read('references/skill-core.json'));
  const core = new Set([...coreList.used, ...coreList.method, ...(coreList.sales ?? [])]);
  for (const folder of await readdir(resolve(root, 'skills'))) {
    const source = await read(`skills/${folder}/SKILL.md`);
    const bridge = await read(`.claude/skills/${folder}/SKILL.md`);
    const manual = /^disable-model-invocation: true$/m.test(bridge);
    const explicit = frontmatterField(source, 'disable-model-invocation') === 'true';
    assert.equal(manual, explicit || !core.has(folder), folder);
    assert.ok(bridge.includes(`../../../skills/${folder}/SKILL.md`), folder);
    assert.ok(source.length > 0);
  }
});

test('Antigravity receives full descriptions from source, independently of INDEX line endings', async () => {
  const builder = await read('scripts/build-antigravity.mjs');
  assert.ok(!builder.includes("index.split("), 'must not parse a presentation table');
  for (const folder of await readdir(resolve(root, 'skills'))) {
    const claude = await read(`.claude/skills/${folder}/SKILL.md`);
    const anti = await read(`.agents/skills/${folder}/SKILL.md`);
    assert.equal(anti.match(/^description: (.*)$/m)?.[1], claude.match(/^description: (.*)$/m)?.[1], folder);
  }
});

test('registered subagents and fork commands resolve without duplicate identities', async () => {
  const agents = await loadAgents(root);
  assert.equal(new Set(agents.map(a => a.id)).size, agents.length);
  for (const a of agents) {
    assert.match(await read(`.claude/agents/${a.id}.md`), new RegExp(`^name: ${a.id}$`, 'm'));
    assert.match(await read(`.claude/skills/chat-${a.id}/SKILL.md`), new RegExp(`^agent: ${a.id}$`, 'm'));
    await read(`.agents/agents/${a.id}.md`);
    for (const s of a.skills) await read(`skills/${s}/SKILL.md`);
  }
});

test('imported originals match their recorded hashes', async () => {
  const manifest = JSON.parse(await read('team/local-sources/manifest.json'));
  for (const f of manifest.files) {
    const bytes = await readFile(resolve(root, f.snapshot));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, f.snapshot);
  }
});

test('project listing budget covers canonical names and descriptions', async () => {
  const settings = JSON.parse(await read('.claude/settings.json'));
  const manifest = JSON.parse(await read('references/discovery-manifest.json'));
  let required = 0;
  for (const s of manifest.skills) {
    const bridge = await read(`.claude/skills/${s.name}/SKILL.md`);
    required += s.name.length + frontmatterField(bridge, 'description').length;
  }
  assert.ok(Number(settings.env.SLASH_COMMAND_TOOL_CHAR_BUDGET) > required);
  assert.equal(Number(settings.env.SLASH_COMMAND_TOOL_CHAR_BUDGET), manifest.listing_budget_characters);
});

test('source metadata works with LF, CRLF and explicit invocation restrictions', () => {
  for (const nl of ['\n', '\r\n']) {
    const md = ['---', 'name: example', 'description: >-', '  First line', '  second line', 'disable-model-invocation: true', '---', 'Body'].join(nl);
    assert.equal(frontmatterField(md, 'description'), 'First line second line');
    assert.equal(frontmatterField(md, 'disable-model-invocation'), 'true');
  }
  const quoted = `---\nname: example\ndescription: ${JSON.stringify('Say "hello"')}\n---\n`;
  assert.equal(frontmatterField(quoted, 'description'), 'Say "hello"');
});

test('Antigravity builds without INDEX and checks a CRLF checkout', async () => {
  const fixture = await mkdtemp(resolve(tmpdir(), 'altiora-discovery-'));
  for (const dir of ['scripts', 'team', 'skills/example']) await mkdir(resolve(fixture, dir), { recursive: true });
  for (const f of ['build-antigravity.mjs', 'skill-catalog.mjs']) await copyFile(resolve(root, 'scripts', f), resolve(fixture, 'scripts', f));
  await writeFile(resolve(fixture, 'team/agents.json'), JSON.stringify({agents: [{id: 'example', when: 'Test'}]}));
  await writeFile(resolve(fixture, 'skills/example/SKILL.md'), '---\r\nname: example\r\ndescription: "An entire description, not an index excerpt"\r\n---\r\n');
  const builder = resolve(fixture, 'scripts/build-antigravity.mjs');
  execFileSync(process.execPath, [builder]);
  for (const f of ['.agents/skills/example/SKILL.md', '.agents/agents/example.md', '.agents/rules/altiora-sync.md', '.agents/rules/altiora-marketing.md']) {
    const p = resolve(fixture, f);
    await writeFile(p, (await readFile(p, 'utf8')).replace(/\r?\n/g, '\r\n'));
  }
  execFileSync(process.execPath, [builder, '--check']);
});
