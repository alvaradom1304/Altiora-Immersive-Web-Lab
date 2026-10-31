import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(resolve(root, 'references/repositories.json'), 'utf8'));
assert.equal(catalog.schema_version, 1);
assert.match(catalog.reviewed_on, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(catalog.timezone, 'America/Costa_Rica');
assert.ok(catalog.repositories.length > 0);
const ids = new Set();
const decisions = new Set(['adopt', 'evaluate', 'hold', 'reference_only']);
for (const repo of catalog.repositories) {
  assert.match(repo.id, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  assert.ok(!ids.has(repo.id), 'Duplicado: ' + repo.id);
  ids.add(repo.id);
  assert.equal(repo.url, 'https://github.com/' + repo.id);
  assert.match(repo.revision, /^[a-f0-9]{40}$/);
  assert.ok(!Number.isNaN(Date.parse(repo.head_commit_at)));
  assert.ok(Number.isInteger(repo.stars) && repo.stars >= 0);
  assert.ok(decisions.has(repo.decision), 'Decisión no válida: ' + repo.id);
  for (const key of ['purpose', 'caution', 'tier', 'observed_license']) assert.ok(repo[key]?.length);
  assert.ok(repo.sources.some(url => url.includes('/blob/' + repo.revision + '/')));
  for (const source of repo.sources) assert.equal(new URL(source).protocol, 'https:');
  assert.ok(!repo.archived || repo.decision !== 'adopt', 'No adoptar un repositorio archivado sin revisar');
}
assert.equal(catalog.repositories.find(r => r.id === '14islands/r3f-scroll-rig')?.decision, 'hold');
// Catálogo suplementario de librerías visuales (referencias, no instalaciones).
const visual = JSON.parse(await readFile(resolve(root, 'references/visual-libraries-2026.json'), 'utf8'));
assert.equal(visual.schema_version, 1);
assert.match(visual.updated_on, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(visual.operational_status, 'catalogued_not_installed');
assert.ok(visual.repos.length >= 70);
const visualIds = new Set();
for (const entry of visual.repos) {
  assert.match(entry.id, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  assert.ok(!visualIds.has(entry.id), 'Duplicado visual: ' + entry.id);
  visualIds.add(entry.id);
  assert.equal(entry.url, 'https://github.com/' + entry.id);
  assert.ok(['evaluate', 'reference_only', 'tool_reference', 'hold'].includes(entry.decision));
  assert.ok(['P0', 'P1', 'P2'].includes(entry.priority));
  for (const key of ['category', 'use', 'license_note', 'risk']) assert.ok(entry[key]?.length);
  assert.equal(entry.integrated, false, 'Referencia no puede declararse instalada: ' + entry.id);
  if (entry.license_review) {
    assert.ok(entry.license_review.status.length > 8);
    assert.match(entry.license_review.reviewed_on, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new URL(entry.license_review.source_url).host, 'github.com');
  }
  if (entry.verified_on !== undefined) {
    assert.match(entry.verified_on, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(entry.verified_scope?.includes('metadata'), 'Falta alcance de verificación: ' + entry.id);
    assert.notEqual(entry.decision, 'tool_reference', 'Nuevos proyectos se registran solo como candidatos: ' + entry.id);
  }
}

const lygia = visual.repos.find(x => x.id === 'patriciogonzalezvivo/lygia');
assert.equal(lygia?.decision, 'hold', 'Lygia comercial debe permanecer en HOLD hasta obtener autorización legal verificable');
assert.match(lygia.license_note, /Prosperity Public License/);
const usd = visual.repos.find(x => x.id === 'PixarAnimationStudios/OpenUSD');
assert.match(usd.license_note, /Tomorrow Open Source Technology License/);

const skillSources = JSON.parse(await readFile(resolve(root, 'references/skill-sources.json'), 'utf8'));
let externalSkills = 0;
for (const source of skillSources.sources) {
  assert.match(source.revision, /^[a-f0-9]{40}$/, 'Revisión no válida: ' + source.repo);
  for (const skill of [...source.skills, ...(source.previously_imported ?? [])]) {
    for (const file of ['SKILL.md', 'LICENSE.txt', 'SOURCE.md']) {
      assert.ok((await stat(resolve(root, 'skills', skill, file))).isFile(), `Falta skills/${skill}/${file}`);
    }
    externalSkills++;
  }
}
let documentCount = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.references', 'node_modules'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.md')) {
      documentCount++;
      const body = await readFile(path, 'utf8');
      for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const link = match[1];
        if (/^[a-z]+:/i.test(link) || link.startsWith('#')) continue;
        const target = resolve(dirname(path), decodeURIComponent(link.split('#')[0]));
        const rel = relative(root, target);
        assert.ok(!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + '/') && !rel.startsWith('..' + '\\'), 'Enlace fuera del laboratorio: ' + link);
        assert.ok((await stat(target)).isFile(), 'Enlace local roto: ' + link);
      }
    }
  }
}
await walk(root);
console.log('OK: ' + ids.size + ' repositorios base, ' + visualIds.size + ' repositorios visuales, ' + externalSkills + ' skills externas con licencia y ' + documentCount + ' documentos; estructura, revisiones y enlaces locales válidos.');
console.log('Esta comprobación no ejecuta demos ni certifica compatibilidad de runtime.');
