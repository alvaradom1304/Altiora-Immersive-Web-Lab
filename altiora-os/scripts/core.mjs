import assert from 'node:assert/strict';
import { readFile, lstat } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = fileURLToPath(new URL('../', import.meta.url));
export const hosts = ['claude', 'antigravity'];
export const statuses = ['planned', 'running', 'needs_review', 'blocked', 'failed', 'accepted'];
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
export function inside(root, path) {
  assert.ok(nonempty(path) && !isAbsolute(path), 'Expected relative path');
  const target = resolve(root, path);
  const rel = relative(resolve(root), target);
  assert.ok(rel && rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel), 'Path escapes root');
  return target;
}
export async function rejectLinks(path) {
  let cursor = resolve(path);
  while (true) {
    try { assert.ok(!(await lstat(cursor)).isSymbolicLink(), 'Symbolic link/junction rejected: ' + cursor); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
    const parent = resolve(cursor, '..');
    if (parent === cursor) break;
    cursor = parent;
  }
}
export async function readManifest(root = packageRoot) {
  return JSON.parse(await readFile(resolve(root, 'manifest.yaml'), 'utf8'));
}
export function orderStages(stages) {
  const byId = new Map(stages.map(s => [s.id, s]));
  assert.equal(byId.size, stages.length, 'Duplicate stage');
  const visiting = new Set(), visited = new Set(), output = [];
  function visit(id) {
    assert.ok(byId.has(id), 'Missing stage: ' + id);
    assert.ok(!visiting.has(id), 'Cycle: ' + id);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id).depends_on) visit(dependency);
    visiting.delete(id); visited.add(id); output.push(byId.get(id));
  }
  for (const s of stages) visit(s.id);
  return output;
}
export async function validatePackage(root = packageRoot) {
  const m = await readManifest(root);
  assert.equal(m.schema_version, 1);
  assert.equal(m.name, 'altiora-os');
  assert.equal(m.execution, 'host-assisted');
  assert.ok(m.agents.length > 0);
  const names = new Set();
  for (const a of m.agents) {
    assert.match(a.id, /^altiora-os-[a-z0-9-]+$/);
    assert.ok(!names.has(a.id), 'Duplicate agent'); names.add(a.id);
    for (const field of ['instruction', 'skill']) {
      const file = inside(root, a[field]);
      await rejectLinks(file);
      const body = await readFile(file, 'utf8');
      assert.ok(body.startsWith('---\n') || body.startsWith('---\r\n'), 'Missing frontmatter');
      assert.ok(body.includes('name: ' + a.id), 'Mismatched name: ' + file);
      assert.match(body, /description: .+/);
      assert.ok(body.length > 500, 'Incomplete instruction: ' + file);
    }
  }
  for (const stages of Object.values(m.workflows)) {
    assert.ok(stages.length > 0);
    orderStages(stages);
    for (const s of stages) {
      assert.ok(names.has(s.agent), 'Unknown agent');
      assert.ok(nonempty(s.deliverable), 'Missing deliverable');
    }
  }
  const sources = JSON.parse(await readFile(resolve(root, 'sources.yaml'), 'utf8'));
  for (const s of sources.repositories) {
    assert.match(s.revision, /^[a-f0-9]{40}$/);
    assert.ok(s.license && s.decision && s.security_limit);
    assert.ok(s.sources.every(url => new URL(url).protocol === 'https:'));
  }
  return m;
}
export function plan(m, task, host) {
  assert.ok(hosts.includes(host), 'Unknown host');
  for (const key of ['task_id', 'objective', 'project', 'workflow']) assert.ok(nonempty(task[key]), 'Missing ' + key);
  for (const key of ['allowed_paths', 'acceptance']) assert.ok(Array.isArray(task[key]) && task[key].length && task[key].every(nonempty), 'Missing ' + key);
  for (const path of task.allowed_paths) inside(process.cwd(), path);
  assert.ok(Object.hasOwn(m.workflows, task.workflow), 'Unknown workflow');
  return {
    schema_version: 1, task_id: task.task_id, host, execution: 'plan-only',
    objective: task.objective, project: task.project, allowed_paths: task.allowed_paths,
    acceptance: task.acceptance, coordinator: 'altiora-os-coordinate',
    stages: orderStages(m.workflows[task.workflow]).map(stage => ({...stage, status: 'planned',
      instruction: 'altiora-os/' + m.agents.find(a => a.id === stage.agent).instruction,
      skill: `${host === 'claude' ? '.claude' : '.agents'}/skills/${stage.agent}/SKILL.md`})),
    limits: ['Host enforces permissions; this plan executes no tools.', 'Use one writer per file; verify handoffs before dependent stages.']
  };
}
export function validateResult(m, result) {
  for (const key of ['task_id', 'agent', 'status', 'summary']) assert.ok(nonempty(result[key]), 'Missing ' + key);
  assert.ok(m.agents.some(a => a.id === result.agent), 'Unknown agent');
  assert.ok(statuses.includes(result.status), 'Invalid status');
  for (const key of ['artifacts', 'evidence', 'checks', 'limitations', 'next_actions']) assert.ok(Array.isArray(result[key]), 'Missing array: ' + key);
  for (const key of ['artifacts', 'limitations', 'next_actions']) assert.ok(result[key].every(nonempty), 'Invalid ' + key);
  const ids = new Set();
  for (const e of result.evidence) {
    for (const key of ['id', 'kind', 'location', 'observed_at', 'claim']) assert.ok(nonempty(e[key]), 'Missing evidence ' + key);
    assert.ok(!ids.has(e.id), 'Duplicate evidence'); ids.add(e.id);
    assert.ok(['source', 'test', 'artifact', 'observation'].includes(e.kind), 'Invalid evidence kind');
    assert.ok(!Number.isNaN(Date.parse(e.observed_at)), 'Invalid evidence date');
  }
  for (const c of result.checks) {
    assert.ok(nonempty(c.name));
    assert.ok(['PASS', 'FAIL', 'NOT_RUN'].includes(c.status), 'Invalid check status');
    assert.ok(Array.isArray(c.evidence_ids) && c.evidence_ids.every(id => ids.has(id)), 'Unknown evidence');
    if (c.status !== 'NOT_RUN') assert.ok(c.evidence_ids.length, 'Executed check requires evidence');
  }
  if (result.status === 'accepted') {
    assert.ok(result.artifacts.length && result.evidence.length && result.checks.length, 'Acceptance requires evidence and checks');
    assert.ok(result.checks.every(c => c.status === 'PASS'), 'Cannot accept failed or unrun checks');
  }
  if (['blocked', 'failed'].includes(result.status)) assert.ok(result.limitations.length && result.next_actions.length, 'Explain failure/blocker and recovery');
  return result;
}
