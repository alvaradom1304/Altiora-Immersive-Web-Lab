import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export function frontmatterField(text, key) {
  const block = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const lines = block.split('\n');
  const i = lines.findIndex(l => l.startsWith(key + ':'));
  if (i < 0) return '';
  let value = lines[i].slice(key.length + 1).trim();
  for (let j = i + 1; j < lines.length && /^\s+/.test(lines[j]); j++) value += ' ' + lines[j].trim();
  if (value.startsWith('"')) { try { return JSON.parse(value); } catch {} }
  return value.replace(/^[>|]-?\s*/, '').replace(/^(['"])([\s\S]*)\1$/, '$2').replace(/''/g, "'").trim();
}

export async function loadSkills(root) {
  const dirs = (await readdir(resolve(root, 'skills'), { withFileTypes: true }))
    .filter(e => e.isDirectory()).map(e => e.name).sort();
  const rows = [];
  const seen = new Set();
  for (const folder of dirs) {
    const text = await readFile(resolve(root, 'skills', folder, 'SKILL.md'), 'utf8');
    const name = frontmatterField(text, 'name');
    const description = frontmatterField(text, 'description');
    if (!/^[a-z0-9-]{1,64}$/.test(name) || name !== folder || seen.has(name)) throw Error('Nombre inválido/duplicado: ' + folder);
    if (!description || description.length > 1024) throw Error('Descripción inválida: ' + folder);
    seen.add(name);
    rows.push({ name, folder, description, manual: frontmatterField(text, 'disable-model-invocation') === 'true' });
  }
  return rows;
}

export async function loadAgents(root) {
  const read = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
  const { agents } = await read('team/agents.json');
  const local = await read('team/local-agents.json').catch(e => { if (e.code === 'ENOENT') return {agents: []}; throw e; });
  const all = [...agents, ...local.agents];
  if (new Set(all.map(a => a.id)).size !== all.length) throw Error('Agente duplicado');
  return all;
}
