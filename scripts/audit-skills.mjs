// Auditoría estructural de skills/ para el ciclo PDCA (docs/workflows/skill-improvement.md).
// Sin dependencias. Uso:
//   node scripts/audit-skills.mjs            compara con la línea base y falla si alguna skill empeora
//   node scripts/audit-skills.mjs --write    actualiza quality/skills-baseline.json y quality/skills-report.md
// Mide forma y verificabilidad, no la calidad real del resultado: eso exige ejecutar los casos de evaluación.
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');
const baselinePath = resolve(root, 'quality/skills-baseline.json');
const reportPath = resolve(root, 'quality/skills-report.md');
const write = process.argv.includes('--write');

const exists = path => stat(path).then(s => s.isFile(), () => false);

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const fields = {};
  let key = null;
  for (const line of match[1].split(/\r?\n/)) {
    const top = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (top) { key = top[1]; fields[key] = top[2]; }
    else if (key && /^\s+/.test(line)) fields[key] += ' ' + line.trim();
  }
  for (const k of Object.keys(fields)) fields[k] = fields[k].trim().replace(/^(['"])([\s\S]*)\1$/, '$2');
  return { fields, body: text.slice(match[0].length) };
}

async function readEvalCases(dir) {
  for (const file of ['references/evaluation-cases.json', 'evals/evals.json']) {
    const path = resolve(dir, file);
    if (!(await exists(path))) continue;
    try {
      const data = JSON.parse(await readFile(path, 'utf8'));
      const cases = data.cases ?? data.evals ?? [];
      return Array.isArray(cases) ? cases : [];
    } catch { return []; }
  }
  return [];
}

// Relleno de plantilla: un caso o párrafo que, quitando el nombre de la skill, aparece
// idéntico en TEMPLATE_MIN skills o más no demuestra nada propio de esa skill y no puntúa.
const TEMPLATE_MIN = 5;
const signature = (value, name) => JSON.stringify(value).toLowerCase()
  .replaceAll(name.toLowerCase(), '<skill>').replace(/\s+/g, ' ');
const bodyParagraphs = body => body.replace(/^#{1,6}\s.*$/gm, '').split(/\n\s*\n/).map(p => p.trim())
  .filter(p => p.length > 40 && !p.startsWith('|') && !p.startsWith('```'));

// Cada regla: [id, puntos, descripción]. La suma es 100.
const RULES = [
  ['frontmatter', 5, 'Frontmatter YAML presente'],
  ['name-match', 5, 'name coincide con la carpeta'],
  ['description-length', 5, 'description entre 60 y 1024 caracteres'],
  ['description-trigger', 5, 'description indica cuándo usarla'],
  ['single-h1', 5, 'Un único título H1'],
  ['no-duplicate-sections', 10, 'Sin secciones H2 duplicadas'],
  ['no-empty-sections', 5, 'Sin encabezados vacíos'],
  ['no-duplicate-paragraphs', 10, 'Sin párrafos repetidos'],
  ['no-legacy-conflict', 10, 'Sin bloque SOP genérico que contradiga el contrato'],
  ['length', 5, 'SKILL.md de 500 líneas o menos'],
  ['eval-cases', 15, 'Al menos 3 casos de evaluación'],
  ['output-defined', 5, 'Define el entregable'],
  ['local-links', 10, 'Enlaces locales válidos'],
  ['versioned', 5, 'Versión declarada'],
];

async function auditSkill(name, shared) {
  const dir = resolve(skillsDir, name);
  const text = (await readFile(resolve(dir, 'SKILL.md'), 'utf8')).replace(/\r\n/g, '\n');
  const fm = parseFrontmatter(text);
  const body = fm ? fm.body : text;
  const lines = text.split('\n');
  const description = fm?.fields.description ?? '';
  const headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
  const h2 = headings.filter(h => h.m[1] === '##').map(h => h.m[2].trim());
  const paragraphs = bodyParagraphs(body);
  const isTemplate = value => (shared.get(signature(value, name)) ?? 0) >= TEMPLATE_MIN;
  // Los casos genéricos compartidos (bordes, peticiones inválidas) son válidos junto a casos
  // propios; un conjunto formado solo por plantillas no cuenta.
  const cases = await readEvalCases(dir);
  const templateCases = cases.filter(isTemplate).length;
  const evalCases = templateCases === cases.length ? 0 : cases.length;
  const ownBody = paragraphs.filter(isTemplate).reduce((rest, p) => rest.replace(p, ''), body);
  const hasContract = /^## Contrato/m.test(body) || await exists(resolve(dir, 'references/contract.json'));

  let brokenLinks = 0;
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const match of prose.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const link = match[1];
    if (/^[a-z]+:/i.test(link) || link.startsWith('#')) continue;
    if (!(await stat(resolve(dir, decodeURIComponent(link.split('#')[0]))).then(() => true, () => false))) brokenLinks++;
  }

  const emptySections = headings.filter((h, idx) => {
    const next = headings[idx + 1];
    if (!next || next.m[1].length > h.m[1].length) return false;
    return lines.slice(h.i + 1, next.i).every(l => !l.trim());
  }).length;

  const pass = {
    'frontmatter': !!fm,
    'name-match': fm?.fields.name === name,
    'description-length': description.length >= 60 && description.length <= 1024,
    'description-trigger': /\b(usar|úsala|usa|activar|cuando|use when|use this|when the user|when)\b/i.test(description),
    'single-h1': headings.filter(h => h.m[1] === '#').length === 1,
    'no-duplicate-sections': new Set(h2).size === h2.length,
    'no-empty-sections': emptySections === 0,
    'no-duplicate-paragraphs': new Set(paragraphs).size === paragraphs.length,
    'no-legacy-conflict': !(hasContract && /SOP Activo/.test(body)),
    'length': lines.length <= 500,
    'eval-cases': evalCases >= 3,
    'output-defined': /output|entregable|resultado|deliverable/i.test(ownBody),
    'local-links': brokenLinks === 0,
    'versioned': /versi[oó]n|version:/i.test(text),
  };
  const failed = RULES.filter(([id]) => !pass[id]).map(([id]) => id);
  const score = RULES.reduce((sum, [id, points]) => sum + (pass[id] ? points : 0), 0);
  return { name, score, failed, evalCases, templateCases, lines: lines.length };
}

const names = (await readdir(skillsDir, { withFileTypes: true }))
  .filter(e => e.isDirectory()).map(e => e.name).sort();

// Primera pasada: en cuántas skills distintas aparece cada caso y cada párrafo normalizado.
const shared = new Map();
for (const name of names) {
  const dir = resolve(skillsDir, name);
  if (!(await exists(resolve(dir, 'SKILL.md')))) continue;
  const text = (await readFile(resolve(dir, 'SKILL.md'), 'utf8')).replace(/\r\n/g, '\n');
  const body = parseFrontmatter(text)?.body ?? text;
  const seen = new Set([...(await readEvalCases(dir)), ...bodyParagraphs(body)].map(v => signature(v, name)));
  for (const sig of seen) shared.set(sig, (shared.get(sig) ?? 0) + 1);
}

const results = [];
for (const name of names) {
  if (await exists(resolve(skillsDir, name, 'SKILL.md'))) results.push(await auditSkill(name, shared));
  else results.push({ name, score: 0, failed: ['missing-skill-md'], evalCases: 0, lines: 0 });
}
const mean = list => list.length ? Math.round(list.reduce((s, r) => s + r.score, 0) / list.length * 10) / 10 : 0;
const average = mean(results);
// Las skills con SOURCE.md son de terceros: se actualizan desde su origen y no se reescriben a mano.
for (const r of results) r.thirdParty = await exists(resolve(skillsDir, r.name, 'SOURCE.md'));
const own = results.filter(r => !r.thirdParty);
const third = results.filter(r => r.thirdParty);
const split = `propias ${own.length}: media ${mean(own)} (${own.filter(r => r.score === 100).length} en 100); terceros ${third.length}: media ${mean(third)}`;
const ruleCounts = Object.fromEntries(RULES.map(([id]) => [id, results.filter(r => r.failed.includes(id)).length]));

if (write) {
  const baseline = {
    schema_version: 1,
    generated_on: new Date().toISOString().slice(0, 10),
    skills: results.length,
    average,
    scores: Object.fromEntries(results.map(r => [r.name, r.score])),
  };
  await writeFile(baselinePath, JSON.stringify(baseline, null, 2) + '\n');
  const worst = [...results].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)).slice(0, 25);
  const report = [
    '# Informe de calidad de skills',
    '',
    `Generado el ${baseline.generated_on} con \`npm run skills:baseline\`. ${results.length} skills; media **${average}/100**.`,
    `Por origen: ${split}. Las de terceros no se reescriben a mano; mejoran con casos de evaluación propios o actualizando desde su origen.`,
    'Mide estructura y verificabilidad; no sustituye ejecutar los casos de evaluación. Proceso: [mejora continua de skills](../docs/workflows/skill-improvement.md).',
    '',
    '## Reglas incumplidas',
    '',
    '| Regla | Puntos | Skills que fallan |',
    '|---|---:|---:|',
    ...RULES.map(([id, pts, desc]) => `| ${desc} (\`${id}\`) | ${pts} | ${ruleCounts[id]} |`),
    '',
    '## Distribución',
    '',
    '| Rango | Skills |',
    '|---|---:|',
    ...[[90, 100], [75, 89], [60, 74], [0, 59]].map(([lo, hi]) => `| ${lo}–${hi} | ${results.filter(r => r.score >= lo && r.score <= hi).length} |`),
    '',
    '## 25 skills con menor puntuación (backlog del próximo ciclo)',
    '',
    '| Skill | Puntos | Reglas incumplidas |',
    '|---|---:|---|',
    ...worst.map(r => `| ${r.name} | ${r.score} | ${r.failed.join(', ') || '—'} |`),
    '',
  ].join('\n');
  await writeFile(reportPath, report);
  console.log(`Línea base actualizada: ${results.length} skills, media ${average}/100.`);
} else {
  let baseline = null;
  try { baseline = JSON.parse(await readFile(baselinePath, 'utf8')); } catch {}
  const regressions = baseline
    ? results.filter(r => r.name in baseline.scores && r.score < baseline.scores[r.name])
    : [];
  console.log(`Skills: ${results.length}; media ${average}/100${baseline ? ` (línea base ${baseline.average})` : ' (sin línea base)'}.`);
  console.log(`Por origen: ${split}.`);
  for (const [id, , desc] of RULES) if (ruleCounts[id]) console.log(`  ${String(ruleCounts[id]).padStart(3)} × ${desc}`);
  if (regressions.length) {
    for (const r of regressions) console.error(`REGRESIÓN ${r.name}: ${baseline.scores[r.name]} → ${r.score} (${r.failed.join(', ')})`);
    process.exit(1);
  }
  console.log('OK: ninguna skill empeora respecto a la línea base.');
}
