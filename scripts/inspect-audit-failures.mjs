import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

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

async function countEvalCases(dir) {
  for (const file of ['references/evaluation-cases.json', 'evals/evals.json']) {
    const path = resolve(dir, file);
    if (!(await exists(path))) continue;
    try {
      const data = JSON.parse(await readFile(path, 'utf8'));
      return (data.cases ?? data.evals ?? []).length;
    } catch { return 0; }
  }
  return 0;
}

const names = (await readdir(skillsDir, { withFileTypes: true }))
  .filter(e => e.isDirectory()).map(e => e.name).sort();

const failures = {};

for (const name of names) {
  const dir = resolve(skillsDir, name);
  const skillFile = resolve(dir, 'SKILL.md');
  if (!(await exists(skillFile))) continue;
  const text = (await readFile(skillFile, 'utf8')).replace(/\r\n/g, '\n');
  const fm = parseFrontmatter(text);
  const body = fm ? fm.body : text;
  const lines = text.split('\n');
  const description = fm?.fields.description ?? '';
  const headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
  const h2 = headings.filter(h => h.m[1] === '##').map(h => h.m[2].trim());
  const paragraphs = body.replace(/^#{1,6}\s.*$/gm, '').split(/\n\s*\n/).map(p => p.trim())
    .filter(p => p.length > 40 && !p.startsWith('|') && !p.startsWith('```'));
  const evalCases = await countEvalCases(dir);

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
    'length': lines.length <= 500,
    'eval-cases': evalCases >= 3,
    'output-defined': /output|entregable|resultado|deliverable/i.test(body),
    'versioned': /versi[oó]n|version:/i.test(text),
  };

  for (const [rule, ok] of Object.entries(pass)) {
    if (!ok) {
      if (!failures[rule]) failures[rule] = [];
      failures[rule].push(name);
    }
  }
}

for (const [rule, list] of Object.entries(failures)) {
  console.log(`=== ${rule} (${list.length}) ===`);
  console.log(list.slice(0, 10).join(', ') + (list.length > 10 ? ` ... (+${list.length - 10} more)` : ''));
}

