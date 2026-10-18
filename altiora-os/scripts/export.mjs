import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { packageRoot, validatePackage, inside, rejectLinks, hosts } from './core.mjs';

export async function exportPackage({ target, host, apply = false, root = packageRoot }) {
  const selected = host === 'all' ? hosts : [host];
  if (!selected.every(h => hosts.includes(h))) throw new Error('Unknown host');
  target = resolve(target);
  await rejectLinks(target);
  if (!(await stat(target)).isDirectory()) throw new Error('Target must exist');
  const m = await validatePackage(root);
  const entries = [{source: 'docs/protocol.md', destination: 'altiora-os/docs/protocol.md'},
    ...m.agents.map(a => ({source: a.instruction, destination: `altiora-os/${a.instruction}`}))];
  for (const h of selected) for (const a of m.agents) {
    const prefix = h === 'claude' ? '.claude' : '.agents';
    entries.push({source: a.skill, destination: `${prefix}/skills/${a.id}/SKILL.md`});
    if (h === 'claude') entries.push({source: a.instruction, destination: `.claude/agents/${a.id}.md`});
  }
  // Preflight the entire set before making any changes. No force/overwrite mode.
  for (const e of entries) {
    e.path = inside(target, e.destination);
    await rejectLinks(e.path);
    e.content = await readFile(inside(root, e.source), 'utf8');
    try {
      const existing = await readFile(e.path, 'utf8');
      if (existing !== e.content) throw new Error('Conflict, preserved: ' + e.destination);
      e.action = 'unchanged';
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      e.action = 'create';
    }
  }
  if (apply) for (const e of entries.filter(e => e.action === 'create')) {
    await rejectLinks(e.path);
    await mkdir(dirname(e.path), {recursive: true});
    await writeFile(e.path, e.content, {flag: 'wx'});
  }
  return {apply, host, target, entries: entries.map(({source, destination, action}) => ({source, destination, action}))};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const allowed = new Set(['--host', '--target', '--apply']);
    const opts = {};
    for (let i = 0; i < args.length; i++) {
      if (!allowed.has(args[i])) throw new Error('Unknown argument: ' + args[i]);
      if (args[i] === '--apply') opts.apply = true;
      else { const key = args[i].slice(2), value = args[++i]; if (!value || value.startsWith('--')) throw new Error('Missing ' + key); opts[key] = value; }
    }
    if (!opts.host || !opts.target) throw new Error('Usage: export.mjs --host <all|claude|antigravity> --target <existing-directory> [--apply]');
    console.log(JSON.stringify(await exportPackage(opts), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
