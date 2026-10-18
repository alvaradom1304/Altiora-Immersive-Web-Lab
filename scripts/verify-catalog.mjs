import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogs = await Promise.all(['references/repositories.json', 'references/business-repositories.json', 'references/agent-skills-repositories.json', 'references/ai-provider-repositories.json']
  .map(async path => JSON.parse(await readFile(resolve(root, path), 'utf8'))));
for (const catalog of catalogs) {
  assert.equal(catalog.schema_version, 1);
  assert.match(catalog.reviewed_on, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(catalog.timezone, 'America/Costa_Rica');
  assert.ok(catalog.repositories.length > 0);
}
const repositories = catalogs.flatMap(catalog => catalog.repositories);
const ids = new Set();
const decisions = new Set(['adopt', 'evaluate', 'hold', 'reference_only']);
for (const repo of repositories) {
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
assert.equal(repositories.find(r => r.id === '14islands/r3f-scroll-rig')?.decision, 'hold');
const business = catalogs[1].repositories;
assert.equal(business.length, 12);
for (const repo of business) {
  assert.ok(['now', 'pilot', 'later'].includes(repo.priority));
  assert.ok(['project-code', 'build-tool', 'development-tool', 'self-hosted-service'].includes(repo.deployment));
  assert.equal(repo.savings_status, 'unmeasured');
  assert.equal(repo.integration_status, 'catalogued');
  assert.ok(repo.cost_driver?.length && repo.recurring_costs?.length);
}
assert.equal(business.filter(repo => repo.priority === 'now').length, 5);
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
console.log('OK: ' + ids.size + ' repositorios y ' + documentCount + ' documentos; estructura, revisiones y enlaces locales válidos.');
console.log('Esta comprobación no ejecuta demos ni certifica compatibilidad de runtime.');
