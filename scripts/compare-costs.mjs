import { readFile } from 'node:fs/promises';
import { compareCosts } from './lib/cost-model.mjs';

try {
  const path = process.argv[2];
  if (!path) throw new Error('Uso: node scripts/compare-costs.mjs archivo.json');
  const input = JSON.parse(await readFile(path, 'utf8'));
  console.log(JSON.stringify(compareCosts(input), null, 2));
} catch (error) {
  console.error('No se calculó ahorro: ' + error.message);
  process.exitCode = 1;
}
