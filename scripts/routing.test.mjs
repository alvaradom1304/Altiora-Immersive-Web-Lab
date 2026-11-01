// Coherencia del enrutamiento común: team/ROUTING.md, el despachador de Orca y las instrucciones de cada IA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAgents } from './skill-catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFile(resolve(root, p), 'utf8').then(t => t.replace(/\r\n/g, '\n'));
const exists = p => access(resolve(root, p)).then(() => true, () => false);

// Lee DOMAIN_RULES y FALLBACK_CHAIN del despachador sin ejecutarlo.
async function dispatcher() {
  const py = await read('scripts/orca-dispatch.py');
  const domains = [...py.matchAll(/"domain": "([a-z0-9-]+)",\s*\n\s*"title": "[^"]*",\s*\n\s*"agent": "([a-z]+)"/g)]
    .map(([, domain, agent]) => ({ domain, agent }));
  const chain = py.match(/FALLBACK_CHAIN = \{([\s\S]*?)\n\}/)[1];
  const fallback = Object.fromEntries([...chain.matchAll(/"([a-z]+)": \[([^\]]*)\]/g)]
    .map(([, ai, list]) => [ai, [...list.matchAll(/"([a-z]+)"/g)].map(m => m[1])]));
  return { domains, fallback };
}

function matrixRows(md) {
  const section = md.split('## 3. Matriz de dominios')[1].split('\n## ')[0];
  return section.split('\n').filter(l => /^\| `[a-z0-9-]+`/.test(l)).map(l => {
    const cells = l.split('|').slice(1, -1).map(c => c.trim());
    return {
      domain: cells[0].match(/`([a-z0-9-]+)`/)[1],
      ai: cells[1],
      fallback: cells[2].split('→').map(s => s.trim()),
      roles: cells[3].split(/,|→/).map(s => s.trim()).filter(Boolean),
      skills: cells[4].split(',').map(s => s.trim()).filter(Boolean),
    };
  });
}

test('la matriz de ROUTING.md coincide con el despachador de Orca', async () => {
  const { domains, fallback } = await dispatcher();
  const rows = matrixRows(await read('team/ROUTING.md'));
  assert.ok(domains.length >= 4, 'no se pudieron leer los dominios del despachador');
  assert.deepEqual(rows.map(r => r.domain).sort(), domains.map(d => d.domain).sort());
  for (const { domain, agent } of domains) {
    const row = rows.find(r => r.domain === domain);
    assert.equal(row.ai, agent, `IA preferida de ${domain}`);
    assert.deepEqual(row.fallback, fallback[agent], `respaldo de ${domain}`);
  }
});

test('roles y skills citados en la matriz existen', async () => {
  const rows = matrixRows(await read('team/ROUTING.md'));
  const agents = new Set((await loadAgents(root)).map(a => a.id));
  for (const row of rows) {
    for (const role of row.roles) assert.ok(agents.has(role), `rol inexistente: ${role}`);
    for (const skill of row.skills) assert.ok(await exists(`skills/${skill}/SKILL.md`), `skill inexistente: ${skill}`);
  }
});

test('las tres IAs llegan a ROUTING.md', async () => {
  assert.match(await read('AGENTS.md'), /team\/ROUTING\.md/);
  assert.match(await read('CLAUDE.md'), /^@AGENTS\.md/m);
  const gemini = await read('GEMINI.md');
  assert.match(gemini, /AGENTS\.md/);
  assert.match(gemini, /team\/ROUTING\.md/);
});

test('los archivos enlazados desde ROUTING.md existen', async () => {
  const md = await read('team/ROUTING.md');
  for (const [, link] of md.matchAll(/\]\((\.\.\/[^)#]+)\)/g)) {
    assert.ok(await exists(resolve(root, 'team', link)), `enlace roto: ${link}`);
  }
});
