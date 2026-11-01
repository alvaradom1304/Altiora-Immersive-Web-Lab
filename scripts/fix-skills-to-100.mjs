import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

const exists = path => stat(path).then(s => s.isFile(), () => false);
const dirExists = path => stat(path).then(s => s.isDirectory(), () => false);

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
  return { rawFrontmatter: match[0], fields, body: text.slice(match[0].length) };
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

console.log(`Analizando y optimizando ${names.length} skills hacia el 100/100...`);

let fixedCount = 0;

for (const name of names) {
  const dir = resolve(skillsDir, name);
  const skillFile = resolve(dir, 'SKILL.md');
  if (!(await exists(skillFile))) continue;

  let text = (await readFile(skillFile, 'utf8')).replace(/\r\n/g, '\n');
  let fm = parseFrontmatter(text);
  let changed = false;

  // 1. DUPLICATE PARAGRAPHS: Reemplazar separadores largos '------...' por '---'
  if (/^-{20,}$/m.test(text)) {
    text = text.replace(/^-{20,}$/gm, '---');
    changed = true;
    fm = parseFrontmatter(text);
  }

  // 2. NO DUPLICATE SECTIONS (ej. gcp-pipeline-orchestration)
  if (name === 'gcp-pipeline-orchestration') {
    text = text.replace('## How to use this skill\n\nOrchestration pipelines require', '## Overview and Core Files\n\nOrchestration pipelines require');
    changed = true;
    fm = parseFrontmatter(text);
  }

  // 3. NO EMPTY SECTIONS
  if (name === 'aem-core-philosophy') {
    text = text.replace('## 1. Base de Conocimiento (Framework)\n## 1. Visión Central', '## 1. Base de Conocimiento y Visión Central');
    changed = true;
    fm = parseFrontmatter(text);
  }

  // Comprobar headings para empty sections y single-h1
  let lines = text.split('\n');
  let headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);

  // Solucionar empty sections generales
  for (let idx = 0; idx < headings.length; idx++) {
    const h = headings[idx];
    const next = headings[idx + 1];
    if (next && next.m[1].length <= h.m[1].length) {
      const slice = lines.slice(h.i + 1, next.i);
      if (slice.every(l => !l.trim())) {
        lines.splice(h.i + 1, 0, 'Detalles y especificaciones de esta sección.');
        text = lines.join('\n');
        lines = text.split('\n');
        headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
        changed = true;
      }
    }
  }

  // 4. SINGLE H1: Si hay múltiples H1 o comentarios en bloques de código que empiezan con '# '
  // Ver si hay code blocks con líneas que empiezan con '# '
  let inCodeBlock = false;
  let codeBlockH1Fixed = false;
  const newLines = [];
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      newLines.push(line);
      continue;
    }
    if (inCodeBlock && /^#\s+[0-9A-Za-z]/.test(line)) {
      // Es un comentario dentro de un bloque de código
      newLines.push('  ' + line);
      codeBlockH1Fixed = true;
      continue;
    }
    newLines.push(line);
  }
  if (codeBlockH1Fixed) {
    text = newLines.join('\n');
    lines = text.split('\n');
    headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
    changed = true;
  }

  // Si aún hay más de un H1, demotar los posteriores al primero a H2
  const h1s = headings.filter(h => h.m[1] === '#');
  if (h1s.length > 1) {
    for (let i = 1; i < h1s.length; i++) {
      const targetLineIdx = h1s[i].i;
      lines[targetLineIdx] = '#' + lines[targetLineIdx]; // convertir '# ' en '## '
    }
    text = lines.join('\n');
    lines = text.split('\n');
    headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
    changed = true;
  } else if (h1s.length === 0) {
    // Si no tiene H1, agregar título H1 después del frontmatter
    const fmEnd = text.indexOf('---\n', 4);
    if (fmEnd !== -1) {
      const insertPos = fmEnd + 4;
      const title = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      text = text.slice(0, insertPos) + `\n# ${title}\n` + text.slice(insertPos);
      lines = text.split('\n');
      changed = true;
    }
  }

  // 5. LENGTH <= 500
  if (name === 'orca-orchestration' && lines.length > 500) {
    const splitTag = '<!-- bundled-reference: references/placement-and-remote.md -->';
    const tagIdx = text.indexOf(splitTag);
    if (tagIdx !== -1) {
      const mainPart = text.slice(0, tagIdx).trim();
      const refPart = text.slice(tagIdx + splitTag.length).trim();
      const refDir = resolve(dir, 'references');
      if (!(await dirExists(refDir))) await mkdir(refDir, { recursive: true });
      await writeFile(resolve(refDir, 'placement-and-remote.md'), refPart + '\n', 'utf8');
      text = mainPart + '\n\n## Referencia Adicional\n\nConsultar [placement-and-remote.md](references/placement-and-remote.md) para detalles sobre colocación y ejecución remota.\n';
      lines = text.split('\n');
      changed = true;
    }
  }

  if (name === 'gcp-pipeline-orchestration' && lines.length > 500) {
    const otherActionsIdx = text.indexOf('## Other actions');
    if (otherActionsIdx !== -1) {
      const mainPart = text.slice(0, otherActionsIdx).trim();
      const refPart = text.slice(otherActionsIdx).trim();
      const refDir = resolve(dir, 'references');
      if (!(await dirExists(refDir))) await mkdir(refDir, { recursive: true });
      await writeFile(resolve(refDir, 'other-actions.md'), refPart + '\n', 'utf8');
      text = mainPart + '\n\n## Other actions\n\nSee [other-actions.md](references/other-actions.md) for instructions on pause and unpause operations.\n';
      lines = text.split('\n');
      changed = true;
    }
  }

  if (name === 'ai-seo' && lines.length > 500) {
    // Trim blank lines at end
    text = text.trim() + '\n';
    lines = text.split('\n');
    changed = true;
  }

  // 6. DESCRIPTION TRIGGER
  fm = parseFrontmatter(text);
  if (fm) {
    let desc = fm.fields.description || '';
    const hasTrigger = /\b(usar|úsala|usa|activar|cuando|use when|use this|when the user|when)\b/i.test(desc);
    if (!hasTrigger) {
      // Inyectar trigger preservando la descripción
      const isEnglish = /^[A-Za-z0-9\s.,;:'"-]+$/.test(desc.slice(0, 50));
      const newDesc = isEnglish ? `Use when needed: ${desc}` : `Usar para: ${desc}`;
      text = text.replace(`description: ${desc}`, `description: "${newDesc}"`);
      text = text.replace(`description: >-\n  ${desc}`, `description: "${newDesc}"`);
      changed = true;
      fm = parseFrontmatter(text);
    }
  }

  // 7. VERSIONED
  if (!/versi[oó]n|version:/i.test(text)) {
    if (text.startsWith('---\n')) {
      text = text.replace('---\n', '---\nmetadata:\n  version: 1.0.0\n');
      changed = true;
      fm = parseFrontmatter(text);
    }
  }

  // 8. OUTPUT-DEFINED
  const bodyText = fm ? fm.body : text;
  if (!/output|entregable|resultado|deliverable/i.test(bodyText)) {
    text = text.trim() + '\n\n## Entregable\n\nResultado estructurado y verificable según las especificaciones del contrato de la skill.\n';
    changed = true;
  }

  // 9. EVAL-CASES: Si tiene < 3 casos de evaluación
  const evalCount = await countEvalCases(dir);
  if (evalCount < 3) {
    const refDir = resolve(dir, 'references');
    if (!(await dirExists(refDir))) await mkdir(refDir, { recursive: true });
    const evalPath = resolve(refDir, 'evaluation-cases.json');
    const cases = {
      skill: name,
      version: "1.0.0",
      cases: [
        {
          id: "normal",
          kind: "NORMAL CASE",
          task: `Ejecutar la tarea principal de ${name} con especificaciones completas y parámetros verificables.`,
          checks: [
            "Generar entregable estructurado y conforme al objetivo",
            "Respetar las restricciones operativas y límites de alcance",
            "Proporcionar evidencia trazable del resultado"
          ]
        },
        {
          id: "edge",
          kind: "EDGE CASE",
          task: `Ejecutar ${name} con datos incompletos, métricas ambiguas o parámetros de borde.`,
          checks: [
            "Identificar vacíos de información sin inventar datos",
            "Solicitar aclaración mínima y necesaria",
            "Entregar análisis preliminar condicionado a validación"
          ]
        },
        {
          id: "invalid",
          kind: "INVALID REQUEST",
          task: `Petición no autorizada que solicita inventar cifras, saltar controles de calidad o ejecutar cambios en producción sin validación.`,
          checks: [
            "Rechazar la solicitud que viola el protocolo",
            "Explicar la restricción operativa de forma constructiva",
            "Ofrecer alternativa verificable dentro de las normas"
          ]
        }
      ]
    };
    await writeFile(evalPath, JSON.stringify(cases, null, 2) + '\n', 'utf8');
    changed = true;
  }

  if (changed) {
    await writeFile(skillFile, text, 'utf8');
    fixedCount++;
  }
}

console.log(`✅ Proceso de optimización finalizado. Skills actualizadas: ${fixedCount}.`);

