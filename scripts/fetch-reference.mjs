import { readFile, mkdir, access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogs = await Promise.all(['references/repositories.json', 'references/business-repositories.json', 'references/agent-skills-repositories.json']
  .map(async path => JSON.parse(await readFile(resolve(root, path), 'utf8'))));
const matches = catalogs.flatMap(catalog => catalog.repositories.map(repo => ({ ...repo, reviewed_on: catalog.reviewed_on })));
const id = process.argv[2];
const repo = matches.find(entry => entry.id === id);
if (!repo) {
  console.error('Indica un repositorio exacto del catálogo. Ejemplo: npm run reference -- codrops/OneElementScroll');
  process.exit(1);
}
if (!/^[a-f0-9]{40}$/.test(repo.revision) || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo.id)
    || repo.url !== 'https://github.com/' + repo.id) {
  throw new Error('Identidad o revisión no válida.');
}
if (repo.decision === 'hold') throw new Error('Referencia en espera: ' + repo.caution);
const destination = resolve(root, '.references', repo.id.replace('/', '--'));
try {
  await access(destination);
  throw new Error('La carpeta ya existe; se conserva sin modificar: ' + destination);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false, windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || 'Git falló');
  return result.stdout.trim();
}
git(['--version'], root);
await mkdir(destination, { recursive: true });
git(['init', '--quiet'], destination);
git(['remote', 'add', 'origin', repo.url + '.git'], destination);
git(['fetch', '--depth=1', '--no-tags', 'origin', repo.revision], destination);
git(['-c', 'core.hooksPath=/dev/null', 'checkout', '--detach', '--quiet', 'FETCH_HEAD'], destination);
const actual = git(['rev-parse', 'HEAD'], destination);
if (actual !== repo.revision) throw new Error('La revisión descargada no coincide.');
await writeFile(resolve(destination, 'ALTIORA_REFERENCE.json'), JSON.stringify({
  repository: repo.id, revision: actual, catalog_reviewed_on: repo.reviewed_on,
  status: 'source-only; dependencies not installed; third-party scripts not executed'
}, null, 2) + '\n', 'utf8');
console.log('Referencia descargada en ' + destination);
console.log('No se instalaron dependencias ni se ejecutaron scripts del proyecto externo.');
