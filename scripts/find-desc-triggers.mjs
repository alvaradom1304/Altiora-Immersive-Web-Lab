import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

const list = [
  'bigquery-bigframes', 'data-autocleaning', 'emotional-branding',
  'gcp-data-pipelines', 'gcp-pipeline-orchestration', 'gcs-security-assessment',
  'orca-orchestration', 'resolving-mcp-region-configs'
];

for (const name of list) {
  const path = resolve(skillsDir, name, 'SKILL.md');
  const text = (await readFile(path, 'utf8')).replace(/\r\n/g, '\n');
  const m = text.match(/^description:\s*(.*)$/m);
  console.log(`\n=== ${name} ===`);
  console.log(m ? m[1] : 'NO MATCH FOR description:');
}

