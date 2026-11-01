import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

// 1. analytics
{
  const p = resolve(skillsDir, 'analytics', 'SKILL.md');
  let text = (await readFile(p, 'utf8')).replace(/\r\n/g, '\n');
  text = text.replace(
    '### [Site/Product] Tracking Plan\n\n## Overview',
    '### [Site/Product] Tracking Plan\nPlan de seguimiento analítico y telemetría.\n\n## Overview'
  );
  await writeFile(p, text, 'utf8');
  console.log('Fixed analytics');
}

// 2. skill-creator
{
  const p = resolve(skillsDir, 'skill-creator', 'SKILL.md');
  let text = (await readFile(p, 'utf8')).replace(/\r\n/g, '\n');
  const oldTemplate = `\`\`\`markdown
## Report structure
ALWAYS use this exact template:
### [Title]
## Executive summary

## Key findings

## Recommendations
\`\`\``;

  const newTemplate = `\`\`\`markdown
# Report Title
Contexto y alcance del reporte.

## Executive summary
Resumen ejecutivo con hallazgos clave.

## Key findings
Puntos críticos observados.

## Recommendations
Acciones sugeridas y hoja de ruta.
\`\`\``;

  text = text.replace(oldTemplate, newTemplate);
  // Also check if any duplicate paragraphs exist
  const body = text.replace(/^---[\s\S]*?---\n/, '');
  await writeFile(p, text, 'utf8');
  console.log('Fixed skill-creator');
}

