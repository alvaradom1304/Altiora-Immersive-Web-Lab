import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, mkdir, writeFile, rm, readdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validatePackage, plan, validateResult, orderStages, inside, packageRoot } from '../scripts/core.mjs';
import { exportPackage } from '../scripts/export.mjs';

const manifest = await validatePackage();
const task = JSON.parse(await readFile(join(packageRoot, 'examples/task.json'), 'utf8'));
function accepted() {
  return {task_id: 'test', agent: 'altiora-os-qa', status: 'accepted', summary: 'Synthetic test',
    artifacts: ['fixture.txt'], evidence: [{id: 'e1', kind: 'test', location: 'fixture.txt', observed_at: '2026-10-18', claim: 'Synthetic observation'}],
    checks: [{name: 'Fixture', status: 'PASS', evidence_ids: ['e1']}], limitations: ['Synthetic'], next_actions: []};
}
async function temporary(fn) {
  const target = await mkdtemp(join(tmpdir(), 'altiora-os-test-'));
  try { await fn(target); } finally { await rm(target, {recursive: true, force: true}); }
}
test('both host plans resolve every stage and dependency', () => {
  for (const host of ['claude', 'antigravity']) {
    const p = plan(manifest, task, host), seen = new Set();
    assert.equal(p.execution, 'plan-only');
    assert.equal(p.stages.length, 7);
    for (const s of p.stages) { assert.ok(s.depends_on.every(id => seen.has(id))); seen.add(s.id); }
  }
});
test('rejects missing acceptance, unknown workflow and host', () => {
  assert.throws(() => plan(manifest, {...task, acceptance: []}, 'claude'));
  assert.throws(() => plan(manifest, {...task, workflow: 'invented'}, 'claude'));
  assert.throws(() => plan(manifest, task, 'invented'));
});
test('rejects cycles and missing dependency', () => {
  assert.throws(() => orderStages([{id: 'a', depends_on: ['b']}, {id: 'b', depends_on: ['a']}]), /Cycle/);
  assert.throws(() => orderStages([{id: 'a', depends_on: ['missing']}]), /Missing/);
});
test('rejects traversal and absolute ownership paths', () => {
  assert.throws(() => inside(packageRoot, '../outside'));
  assert.throws(() => inside(packageRoot, packageRoot));
  assert.throws(() => plan(manifest, {...task, allowed_paths: ['../outside']}, 'claude'));
});
test('accepted result must have executed checks and evidence', () => {
  validateResult(manifest, accepted());
  for (const status of ['FAIL', 'NOT_RUN']) {
    const r = accepted(); r.checks[0].status = status;
    assert.throws(() => validateResult(manifest, r));
  }
  assert.throws(() => validateResult(manifest, {...accepted(), artifacts: []}));
  assert.throws(() => validateResult(manifest, {...accepted(), evidence: []}));
});
test('rejects orphan evidence ids, duplicate evidence and unknown agents', () => {
  const r = accepted(); r.checks[0].evidence_ids = ['missing'];
  assert.throws(() => validateResult(manifest, r));
  const d = accepted(); d.evidence.push(d.evidence[0]);
  assert.throws(() => validateResult(manifest, d));
  assert.throws(() => validateResult(manifest, {...accepted(), agent: 'invented'}));
});
test('blocked result explains recovery; pending fixture is not accepted', async () => {
  assert.throws(() => validateResult(manifest, {...accepted(), status: 'blocked', limitations: []}));
  const fixture = JSON.parse(await readFile(join(packageRoot, 'examples/result.json'), 'utf8'));
  validateResult(manifest, fixture); assert.equal(fixture.status, 'needs_review');
});
test('dry run makes no changes', () => temporary(async target => {
  const p = await exportPackage({target, host: 'all'});
  assert.equal(p.entries.length, 33); assert.deepEqual(await readdir(target), []);
}));
test('export creates host files, is repeatable and preserves originals', () => temporary(async target => {
  await writeFile(join(target, 'CLAUDE.md'), 'existing');
  await exportPackage({target, host: 'all', apply: true});
  const again = await exportPackage({target, host: 'all', apply: true});
  assert.ok(again.entries.every(e => e.action === 'unchanged'));
  assert.equal(await readFile(join(target, 'CLAUDE.md'), 'utf8'), 'existing');
  assert.equal(await readFile(join(target, 'altiora-os/docs/protocol.md'), 'utf8'), await readFile(join(packageRoot, 'docs/protocol.md'), 'utf8'));
  assert.ok((await readFile(join(target, 'altiora-os/agents/altiora-os-qa.md'), 'utf8')).includes('altiora-os/docs/protocol.md'));
  assert.equal(await readFile(join(target, '.claude/skills/altiora-os-qa/SKILL.md'), 'utf8'), await readFile(join(packageRoot, 'skills/altiora-os-qa/SKILL.md'), 'utf8'));
}));
test('conflict aborts before any new file is created', () => temporary(async target => {
  const conflict = join(target, '.claude/skills/altiora-os-qa');
  await mkdir(conflict, {recursive: true}); await writeFile(join(conflict, 'SKILL.md'), 'user change');
  await assert.rejects(exportPackage({target, host: 'all', apply: true}), /Conflict/);
  assert.equal(await readFile(join(conflict, 'SKILL.md'), 'utf8'), 'user change');
  await assert.rejects(readFile(join(target, '.claude/skills/altiora-os-coordinate/SKILL.md')), {code: 'ENOENT'});
}));
test('export rejects symlink/junction paths', () => temporary(async target => {
  const outside = join(target, 'outside'); await mkdir(outside);
  await symlink(outside, join(target, '.claude'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(exportPackage({target, host: 'all', apply: true}), /Symbolic link/);
  assert.deepEqual(await readdir(outside), []);
}));
