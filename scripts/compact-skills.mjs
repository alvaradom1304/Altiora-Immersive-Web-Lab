#!/usr/bin/env node
// Remove only repeated generated SOP/output sections. A plan never writes files.
import assert from 'node:assert/strict';
import {createHash, randomUUID} from 'node:crypto';
import {lstat, mkdir, readFile, readdir, rename, unlink, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {safeLocalPath} from './local-path-safety.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MAX_BYTES = 512 * 1024;
const NAMES = new Set(['2. Procedimiento Operativo Estándar (SOP Activo)', '3. Entregable Esperado (Output)']);
const digest = value => createHash('sha256').update(value).digest('hex');
const skillName = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);

export function compactSkillText(text) {
  // This is not an HTML parser. Skip even malformed markup, autolinks and
  // literal '<' examples rather than confuse hidden headings with instructions.
  if (text.includes('<')) return {text, removed: []};
  const lines = text.match(/[^\n]*\n|[^\n]+$/g) || [];
  const headings = [];
  let fence = null, frontmatter = /^\uFEFF?---\r?\n/.test(text), h1 = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r?\n$/, '');
    if (frontmatter) {
      if (i > 0 && line === '---') frontmatter = false;
      continue;
    }
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    if (marker) {fence = {char: marker[1][0], length: marker[1].length}; continue;}
    const heading = line.match(/^(#{1,2}) (.+?)\s*$/);
    if (heading) {
      if (heading[1].length === 1) h1++;
      headings.push({line: i, level: heading[1].length, title: heading[2], h1});
    }
  }
  // Unclosed fences/frontmatter are ambiguous; leave the complete file intact.
  if (fence || frontmatter) return {text, removed: []};
  const seen = new Set(), remove = new Set(), removed = [];
  for (let i = 0; i < headings.length; i++) {
    const section = headings[i];
    if (section.level !== 2 || !NAMES.has(section.title)) continue;
    let end = headings[i + 1]?.line ?? lines.length;
    while (end > section.line && /^\s*$/.test(lines[end - 1])) end--;
    const content = lines.slice(section.line, end).join('').replace(/\r?\n$/, '');
    const key = section.h1 + '\0' + content;
    if (!seen.has(key)) {seen.add(key); continue;}
    for (let n = section.line; n < end; n++) remove.add(n);
    removed.push({heading: section.title, line: section.line + 1});
  }
  return {text: lines.filter((_, i) => !remove.has(i)).join(''), removed};
}

async function directory(path) {
  const info = await lstat(path);
  assert.ok(info.isDirectory() && !info.isSymbolicLink(), 'Linked or invalid skills root');
  return resolve(path);
}

async function boundedFile(root, path) {
  await safeLocalPath(root, path);
  const info = await lstat(path);
  assert.ok(info.isFile() && info.size <= MAX_BYTES, 'Invalid or oversized file');
  const bytes = await readFile(path);
  assert.ok(bytes.length <= MAX_BYTES, 'Oversized file');
  const text = bytes.toString('utf8');
  assert.ok(Buffer.from(text, 'utf8').equals(bytes), 'Invalid UTF-8 file');
  return {bytes, text, info};
}

async function eligibility(canonicalRoot) {
  canonicalRoot = await directory(canonicalRoot);
  const manifest = await boundedFile(canonicalRoot, join(canonicalRoot, 'references/skill-sources.json'));
  const data = JSON.parse(manifest.text);
  assert.ok(Array.isArray(data.sources), 'Invalid provenance manifest');
  const foreign = new Set();
  for (const source of data.sources) {
    assert.ok(Array.isArray(source.skills), 'Invalid provenance skill list');
    assert.ok(source.previously_imported === undefined || Array.isArray(source.previously_imported), 'Invalid provenance history');
    for (const name of [...source.skills, ...(source.previously_imported || [])]) {
      assert.ok(skillName(name), 'Invalid provenance name');
      foreign.add(name);
    }
  }
  const skillsRoot = await directory(join(canonicalRoot, 'skills'));
  const eligible = [];
  for (const item of await readdir(skillsRoot, {withFileTypes: true})) {
    if (item.isDirectory() && !item.isSymbolicLink() && skillName(item.name) && !foreign.has(item.name)) eligible.push(item.name);
  }
  eligible.sort();
  return {eligible: new Set(eligible), fingerprint: digest(JSON.stringify({eligible, foreign: [...foreign].sort(), manifest: digest(manifest.bytes)}))};
}

async function foreignMarker(folder) {
  return (await readdir(folder)).some(name => name === 'SOURCE.md' || /^LICEN[CS]E(?:[.-]|$)/i.test(name));
}

export async function planCompaction({skillsRoot = join(ROOT, 'skills'), canonicalRoot = ROOT} = {}) {
  skillsRoot = await directory(skillsRoot);
  const policy = await eligibility(canonicalRoot);
  const changes = [], skipped = [];
  let inspected = 0;
  for (const item of (await readdir(skillsRoot, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!item.isDirectory() && !item.isSymbolicLink()) continue;
    if (!skillName(item.name) || !policy.eligible.has(item.name)) {skipped.push({skill: item.name, reason: 'NOT_CANONICAL_ALTIORA_OWNED'}); continue;}
    const folder = join(skillsRoot, item.name), target = join(folder, 'SKILL.md');
    try {
      await safeLocalPath(skillsRoot, folder);
      if (await foreignMarker(folder)) {skipped.push({skill: item.name, reason: 'PROVENANCE_MARKER'}); continue;}
      const source = await boundedFile(skillsRoot, target);
      inspected++;
      const result = compactSkillText(source.text);
      if (!result.removed.length) continue;
      changes.push({skill: item.name, before_sha256: digest(source.bytes), after_sha256: digest(result.text),
        before_bytes: source.bytes.length, after_bytes: Buffer.byteLength(result.text),
        before_characters: [...source.text].length, after_characters: [...result.text].length,
        removed_sections: result.removed});
    } catch {skipped.push({skill: item.name, reason: 'MISSING_UNSAFE_OR_INVALID'});}
  }
  return {schema_version: 1, status: 'PLAN', skills_root: skillsRoot, canonical_policy_sha256: policy.fingerprint,
    inspected, changes, skipped, bytes_removed: changes.reduce((sum, c) => sum + c.before_bytes - c.after_bytes, 0),
    characters_removed: changes.reduce((sum, c) => sum + c.before_characters - c.after_characters, 0),
    token_savings: 'NOT_MEASURED'};
}

export async function applyCompactionPlan(plan, {canonicalRoot = ROOT, backupBase = join(ROOT, '.altiora-private/skill-compaction')} = {}) {
  assert.ok(plan?.schema_version === 1 && plan.status === 'PLAN' && Array.isArray(plan.changes), 'Invalid compaction plan');
  const skillsRoot = await directory(plan.skills_root);
  const policy = await eligibility(canonicalRoot);
  assert.equal(plan.canonical_policy_sha256, policy.fingerprint, 'Canonical ownership policy changed');
  const pending = [], seen = new Set();
  for (const change of plan.changes) {
    assert.ok(skillName(change.skill) && policy.eligible.has(change.skill) && !seen.has(change.skill), 'Invalid, foreign or duplicate plan entry');
    seen.add(change.skill);
    const folder = join(skillsRoot, change.skill), target = join(folder, 'SKILL.md');
    await safeLocalPath(skillsRoot, folder);
    assert.ok(!(await foreignMarker(folder)), 'Target ownership changed');
    const source = await boundedFile(skillsRoot, target);
    assert.equal(digest(source.bytes), change.before_sha256, 'Skill changed since plan');
    const compacted = compactSkillText(source.text);
    assert.ok(compacted.removed.length > 0, 'No supported duplication remains');
    assert.equal(digest(compacted.text), change.after_sha256, 'Compaction result changed');
    pending.push({change, target, source, text: compacted.text});
  }
  if (!pending.length) return {status: 'NO_CHANGES', applied: [], backup: null, token_savings: 'NOT_MEASURED'};
  const backup = resolve(backupBase, randomUUID());
  await safeLocalPath(canonicalRoot, backup);
  await mkdir(backup, {recursive: true});
  const applied = [];
  const manifest = {schema_version: 1, status: 'PREPARED', skills_root: skillsRoot, changes: plan.changes, applied};
  const manifestPath = join(backup, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', {flag: 'wx'});
  for (const entry of pending) await writeFile(join(backup, entry.change.skill + '.SKILL.md'), entry.source.bytes, {flag: 'wx'});
  try {
    for (const entry of pending) {
      const current = await boundedFile(skillsRoot, entry.target);
      assert.equal(digest(current.bytes), entry.change.before_sha256, 'Skill changed before replacement');
      const temporary = entry.target + '.compact-' + randomUUID();
      await safeLocalPath(skillsRoot, temporary);
      try {
        await writeFile(temporary, entry.text, {flag: 'wx', mode: current.info.mode});
        const recheck = await boundedFile(skillsRoot, entry.target);
        assert.equal(digest(recheck.bytes), entry.change.before_sha256, 'Skill changed during replacement');
        await rename(temporary, entry.target);
      } finally {await unlink(temporary).catch(e => {if (e.code !== 'ENOENT') throw e;});}
      applied.push(entry.change.skill);
      manifest.status = 'APPLYING';
      await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    }
    manifest.status = 'APPLIED';
  } catch (error) {
    manifest.status = 'FAILED_PARTIAL_APPLY';
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    throw error;
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  return {status: 'APPLIED', applied, backup,
    bytes_removed: pending.reduce((sum, item) => sum + item.source.bytes.length - Buffer.byteLength(item.text), 0),
    characters_removed: pending.reduce((sum, item) => sum + [...item.source.text].length - [...item.text].length, 0), token_savings: 'NOT_MEASURED'};
}

async function main() {
  const args = process.argv.slice(2);
  let skillsRoot = join(ROOT, 'skills'), explicitRoot = false, planFile = null, apply = false, json = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--skills-root') {assert.ok(args[i + 1], 'Missing skills root'); skillsRoot = resolve(args[++i]); explicitRoot = true;}
    else if (args[i] === '--plan-file') {assert.ok(args[i + 1], 'Missing plan file'); planFile = resolve(args[++i]);}
    else if (args[i] === '--apply') apply = true;
    else if (args[i] === '--json') json = true;
    else throw Error('Use [--skills-root <path>] [--json] or --apply --plan-file <reviewed-plan.json>');
  }
  assert.ok(!apply || planFile, '--apply requires a previously reviewed --plan-file');
  let result;
  if (apply) {
    const plan = JSON.parse((await boundedFile(ROOT, planFile)).text);
    if (explicitRoot) assert.equal(resolve(plan.skills_root), skillsRoot, 'Explicit skills root differs from reviewed plan');
    result = await applyCompactionPlan(plan);
  } else result = await planCompaction({skillsRoot});
  if (json) console.log(JSON.stringify(result, null, 2));
  else console.log(JSON.stringify({status: result.status, inspected: result.inspected, affected_skills: result.changes?.length ?? result.applied.length,
    bytes_removed: result.bytes_removed ?? 0, characters_removed: result.characters_removed ?? 0, backup: result.backup, token_savings: 'NOT_MEASURED'}, null, 2));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {console.error('SKILL_COMPACTION_FAILED: ' + error.message); process.exitCode = 1;});
}
