import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

const p = resolve(skillsDir, 'gcp-pipeline-orchestration', 'SKILL.md');
let text = (await readFile(p, 'utf8')).replace(/\r\n/g, '\n');

// Extraer Step 6 y Step 7 a references/deploy-and-trigger.md
const step6Tag = '### Step 6: Deploy the Orchestration Pipeline (Optional)';
const dodTag = '## Definition of done';
const step6Idx = text.indexOf(step6Tag);
const dodIdx = text.indexOf(dodTag);

if (step6Idx !== -1 && dodIdx !== -1) {
  const deployContent = text.slice(step6Idx, dodIdx).trim();
  const refPath = resolve(skillsDir, 'gcp-pipeline-orchestration', 'references', 'deploy-and-trigger.md');
  await writeFile(refPath, deployContent + '\n', 'utf8');
  text = text.slice(0, step6Idx) + '### Step 6 & 7: Deploy and Trigger (Optional)\n\nSee [deploy-and-trigger.md](references/deploy-and-trigger.md) for full commands on deploying and triggering the pipeline.\n\n' + text.slice(dodIdx);
}

text = text.replace(/\n{3,}/g, '\n\n').trim() + '\n';
await writeFile(p, text, 'utf8');
console.log(`gcp-pipeline-orchestration final lines: ${text.split('\n').length}`);
