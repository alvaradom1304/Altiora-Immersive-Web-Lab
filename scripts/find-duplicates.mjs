import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

const skills = [
  'bigquery-graph-query',
  'building-data-apps',
  'cloud-databases-onboarding',
  'gcp-managed-airflow-dag-authoring',
  'gcp-managed-airflow-migrations',
  'gcp-spark',
  'gcp-spark-troubleshooting',
  'schema-mapping'
];

for (const name of skills) {
  const path = resolve(skillsDir, name, 'SKILL.md');
  const text = (await readFile(path, 'utf8')).replace(/\r\n/g, '\n');
  const body = text.replace(/^---[\s\S]*?---\n/, '');
  const paragraphs = body.replace(/^#{1,6}\s.*$/gm, '').split(/\n\s*\n/).map(p => p.trim())
    .filter(p => p.length > 40 && !p.startsWith('|') && !p.startsWith('```'));
  const counts = {};
  for (const p of paragraphs) {
    counts[p] = (counts[p] || 0) + 1;
  }
  const duplicates = Object.entries(counts).filter(([p, c]) => c > 1);
  console.log(`\n=== ${name} (${duplicates.length} dups) ===`);
  for (const [p, c] of duplicates) {
    console.log(`[Count ${c}]: ${p.slice(0, 100)}...`);
  }
}
