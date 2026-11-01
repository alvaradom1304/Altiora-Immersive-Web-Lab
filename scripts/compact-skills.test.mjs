import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, symlink, link, rm, readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compactSkillText, planCompaction, applyCompactionPlan} from './compact-skills.mjs';

const header = '---\nname: owned\ndescription: Local test\n---\n\n# Owned\n\n';
const sop = '## 2. Procedimiento Operativo Estándar (SOP Activo)\nNo gastar ni conectar sin autorización.\nLeer [contrato](references/contract.json).\n';
const output = '## 3. Entregable Esperado (Output)\nEntregar evidencia y límites.\n';
const duplicated = header + sop + '\n' + output + '\n' + sop + '\n' + output;

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'altiora-compact-'));
  await mkdir(join(root, 'references'));
  await mkdir(join(root, 'skills/owned'), {recursive: true});
  await mkdir(join(root, 'skills/foreign'), {recursive: true});
  await writeFile(join(root, 'references/skill-sources.json'), JSON.stringify({sources: [{skills: ['foreign']}]}));
  await writeFile(join(root, 'skills/owned/SKILL.md'), duplicated);
  await writeFile(join(root, 'skills/foreign/SKILL.md'), duplicated);
  return root;
}

test('only complete repeated supported sections are removed; frontmatter and first instruction remain', () => {
  const result = compactSkillText(duplicated);
  assert.equal(result.removed.length, 2);
  assert.ok(result.text.startsWith(header));
  assert.equal(result.text.split('No gastar ni conectar sin autorización.').length, 2);
  assert.equal(result.text.split('[contrato](references/contract.json)').length, 2);
  assert.ok(result.text.indexOf(sop) < result.text.indexOf(output));
  assert.deepEqual(compactSkillText(result.text).removed, []);
});

test('different permission, link or content means no compaction of near-duplicate sections', () => {
  for (const variant of [sop.replace('No gastar', 'No gastar nunca'), sop.replace('contract.json', 'other.json'), sop.replace('autorización.', 'autorización. ')]) {
    const source = header + sop + '\n' + variant;
    assert.equal(compactSkillText(source).text, source);
  }
});

test('identical arbitrary sections and examples are not deduplicated', () => {
  const body = '## Ejemplo\nconst duplicate = true;\n';
  const source = header + body + '\n' + body;
  assert.equal(compactSkillText(source).text, source);
});

test('fenced headings are data; repeated fenced blocks stay intact', () => {
  for (const fence of ['```markdown', '~~~~md']) {
    const close = fence.startsWith('`') ? '```' : '~~~~';
    const code = fence + '\n' + sop + '\n' + close + '\n';
    const source = header + code + '\n' + code;
    assert.equal(compactSkillText(source).text, source);
  }
  const incomplete = header + sop + '\n' + sop + '\n```\nUnclosed example';
  assert.equal(compactSkillText(incomplete).text, incomplete);
});

test('HTML comments cannot make the real visible permission section look like a duplicate', () => {
  const source = '# Example\n<!--\n' + sop + '## Hidden separator\n-->\n' + sop + '## Next\nKeep.\n';
  const result = compactSkillText(source);
  assert.equal(result.text, source);
  assert.deepEqual(result.removed, []);
  assert.ok(result.text.includes('-->\n' + sop));
});

test('raw or malformed HTML makes the entire file ineligible for automated compaction', () => {
  for (const fragment of ['<!-- unfinished', '<!-- malformed --', '<div>\nraw\n</div>', '<div', '</broken', '<!DOCTYPE html>', '<![CDATA[ unfinished', '< span', '<https://example.com>', 'value < limit']) {
    const source = duplicated + '\n' + fragment;
    assert.equal(compactSkillText(source).text, source, fragment);
    assert.deepEqual(compactSkillText(source).removed, [], fragment);
  }
});

test('headings inside frontmatter or another H1 context cannot cause deletion', () => {
  const source = header + sop + '\n# Another case\n' + sop;
  assert.equal(compactSkillText(source).text, source);
  const yaml = '---\ndescription: |\n## 2. Procedimiento Operativo Estándar (SOP Activo)\ntext\n---\n';
  assert.equal(compactSkillText(yaml + sop).text, yaml + sop);
});

test('CRLF and non-ASCII bytes are preserved outside the removed duplicate', () => {
  const source = duplicated.replaceAll('\n', '\r\n');
  const result = compactSkillText(source);
  assert.equal(result.removed.length, 2);
  assert.ok(!/(?<!\r)\n/.test(result.text));
  assert.ok(result.text.includes('autorización'));
});

test('default planning is read-only, bounded to known owned immediate folders', async () => {
  const root = await fixture();
  try {
    await mkdir(join(root, 'skills/unknown'));
    await writeFile(join(root, 'skills/unknown/SKILL.md'), duplicated);
    await mkdir(join(root, 'skills/owned/nested'));
    await writeFile(join(root, 'skills/owned/nested/SKILL.md'), duplicated);
    const before = await readFile(join(root, 'skills/owned/SKILL.md'));
    const plan = await planCompaction({canonicalRoot: root, skillsRoot: join(root, 'skills')});
    // A name present in canonical skills is eligible; a nested SKILL.md is never visited.
    assert.equal(plan.changes.length, 2);
    assert.ok(plan.changes.every(x => ['owned', 'unknown'].includes(x.skill)));
    assert.ok(plan.skipped.some(x => x.skill === 'foreign'));
    assert.ok((await readFile(join(root, 'skills/owned/SKILL.md'))).equals(before));
    assert.equal(plan.token_savings, 'NOT_MEASURED');
    assert.ok(plan.bytes_removed > 0);
    assert.deepEqual((await readdir(root)).sort(), ['references', 'skills']);
  } finally {await rm(root, {recursive: true, force: true});}
});

test('an explicit target root never makes unknown names or provenance markers eligible', async () => {
  const root = await fixture();
  try {
    const target = join(root, 'installed');
    for (const name of ['owned', 'foreign', 'unknown']) {
      await mkdir(join(target, name), {recursive: true});
      await writeFile(join(target, name, 'SKILL.md'), duplicated);
    }
    let plan = await planCompaction({canonicalRoot: root, skillsRoot: target});
    assert.deepEqual(plan.changes.map(x => x.skill), ['owned']);
    await writeFile(join(target, 'owned/SOURCE.md'), 'Independent authored variant');
    plan = await planCompaction({canonicalRoot: root, skillsRoot: target});
    assert.deepEqual(plan.changes, []);
    assert.ok(plan.skipped.some(x => x.reason === 'PROVENANCE_MARKER'));
  } finally {await rm(root, {recursive: true, force: true});}
});

test('apply keeps an exact original backup and is idempotent only after replanning', async () => {
  const root = await fixture();
  try {
    const plan = await planCompaction({canonicalRoot: root, skillsRoot: join(root, 'skills')});
    const result = await applyCompactionPlan(plan, {canonicalRoot: root, backupBase: join(root, 'private-backups')});
    assert.deepEqual(result.applied, ['owned']);
    assert.equal(await readFile(join(result.backup, 'owned.SKILL.md'), 'utf8'), duplicated);
    assert.equal(JSON.parse(await readFile(join(result.backup, 'manifest.json'), 'utf8')).status, 'APPLIED');
    assert.equal((await readFile(join(root, 'skills/foreign/SKILL.md'), 'utf8')), duplicated);
    await assert.rejects(applyCompactionPlan(plan, {canonicalRoot: root, backupBase: join(root, 'private-backups')}), /changed since plan/);
    const next = await planCompaction({canonicalRoot: root, skillsRoot: join(root, 'skills')});
    assert.equal((await applyCompactionPlan(next, {canonicalRoot: root})).status, 'NO_CHANGES');
  } finally {await rm(root, {recursive: true, force: true});}
});

test('stale source, changed ownership and tampered plan fail before replacements', async () => {
  const root = await fixture();
  try {
    const plan = await planCompaction({canonicalRoot: root, skillsRoot: join(root, 'skills')});
    const tampered = structuredClone(plan);
    tampered.changes[0].skill = '../outside';
    await assert.rejects(applyCompactionPlan(tampered, {canonicalRoot: root}));
    await writeFile(join(root, 'skills/owned/SKILL.md'), duplicated + '\nOwner edit');
    await assert.rejects(applyCompactionPlan(plan, {canonicalRoot: root}), /changed since plan/);
    await writeFile(join(root, 'skills/owned/SKILL.md'), duplicated);
    await writeFile(join(root, 'skills/owned/LICENSE.txt'), 'Custom owner provenance');
    await assert.rejects(applyCompactionPlan(plan, {canonicalRoot: root}), /ownership changed/);
    assert.equal(await readFile(join(root, 'skills/owned/SKILL.md'), 'utf8'), duplicated);
  } finally {await rm(root, {recursive: true, force: true});}
});

test('linked folders, hard-linked files and linked root are never followed', async t => {
  const root = await fixture();
  const other = await mkdtemp(join(tmpdir(), 'altiora-compact-external-'));
  try {
    await mkdir(join(other, 'owned'));
    await writeFile(join(other, 'owned/SKILL.md'), duplicated);
    const target = join(root, 'installed');
    await mkdir(target);
    try {await symlink(join(other, 'owned'), join(target, 'owned'), process.platform === 'win32' ? 'junction' : 'dir');}
    catch (error) {if (['EPERM', 'EACCES'].includes(error.code)) {t.skip('Link creation unavailable in this environment'); return;} throw error;}
    let plan = await planCompaction({canonicalRoot: root, skillsRoot: target});
    assert.equal(plan.changes.length, 0);
    assert.ok(plan.skipped.some(x => x.reason === 'MISSING_UNSAFE_OR_INVALID'));
    await assert.rejects(planCompaction({canonicalRoot: root, skillsRoot: join(target, 'owned')}));
    await rm(join(target, 'owned'));
    await mkdir(join(target, 'owned'));
    await link(join(other, 'owned/SKILL.md'), join(target, 'owned/SKILL.md'));
    plan = await planCompaction({canonicalRoot: root, skillsRoot: target});
    assert.equal(plan.changes.length, 0);
    assert.equal(await readFile(join(other, 'owned/SKILL.md'), 'utf8'), duplicated);
  } finally {await rm(root, {recursive: true, force: true}); await rm(other, {recursive: true, force: true});}
});
