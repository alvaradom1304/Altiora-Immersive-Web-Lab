// Genera los agentes del equipo a partir de team/agents.json y team/roles/<id>.md:
//   .claude/agents/<id>.md   subagentes de Claude Code
//   team/agents/<id>.md      prompt portable para Codex, Gemini, ChatGPT u otra IA
//   .claude/skills/          puente a cada skill de skills/, /chat-<rol>, /equipo y /repos
//   INDEX.md                 índice de agentes, skills y repositorios
// Uso: node scripts/build-agents.mjs [--check]   (--check falla si los archivos generados no están al día)
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
const { agents } = JSON.parse(await readFile(resolve(root, 'team/agents.json'), 'utf8'));
const read = path => readFile(path, 'utf8').then(t => t.replace(/\r\n/g, '\n'), () => null);

function sections(markdown) {
  const title = markdown.match(/^# (.+)$/m)?.[1].trim();
  const out = { title };
  for (const [, name, body] of markdown.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |(?![\s\S]))/gm)) out[name.trim()] = body.trim();
  return out;
}

function body(agent, role) {
  const skills = agent.skills.map(s => `- [${s}](../../skills/${s}/SKILL.md)`).join('\n');
  return `# ${role.title}

Rol del equipo Altiora (ver [registro](../../team/registry.md) y [producción por milestones](../../workflow/production.md)).

## Misión
${role['Misión']}

## Entradas
${role['Entradas']}

## Entrega obligatoria
${role['Entrega obligatoria']}

## Revisión
${role['Revisión'].replace(/\.$/, '')}. Milestones: ${agent.milestones.join(', ')}.

## Skills
Leer solo las pertinentes a la tarea antes de producir:
${skills}

## Coordinación con otras IAs
El trabajo se reparte en el [chat del equipo](../../team/chat/README.md). Identificarse como \`<ia>/${agent.id}\` (por ejemplo \`claude/${agent.id}\`).
1. Al empezar: \`npm run chat -- inbox ${agent.id}\` y \`npm run chat -- board\`.
2. Reclamar una tarea antes de tocar archivos: \`npm run chat -- claim <tarea> --as <ia>/${agent.id}\`. Si ya la tiene otra IA, no trabajar en ella.
3. Editar solo los archivos de la tarea reclamada. Lo que corresponda a otro rol se pide con \`npm run chat -- post --as <ia>/${agent.id} --to <rol> "mensaje"\`.
4. Al terminar: \`npm run chat -- done <tarea> --as <ia>/${agent.id} --note "resultado y evidencia"\` y avisar al revisor.
5. Si algo bloquea: \`npm run chat -- block <tarea> --as <ia>/${agent.id} --note "motivo y qué se necesita"\`.

## Reglas
- Leer AGENTS.md y los documentos aprobados del proyecto antes de producir.
- No inventar hechos, métricas, testimonios ni resultados de herramientas no ejecutadas.
- Separar evidencia, supuestos, decisiones pendientes y criterio de aceptación.
- Explicar cómo el resultado ayuda al usuario y al negocio.
- Indicar qué está diseñado, implementado, probado o pendiente.
`;
}

const outputs = [];
for (const agent of agents) {
  const markdown = await read(resolve(root, 'team/roles', agent.id + '.md'));
  if (!markdown) throw new Error('Falta team/roles/' + agent.id + '.md');
  const role = sections(markdown);
  for (const key of ['Misión', 'Entradas', 'Entrega obligatoria', 'Revisión']) {
    if (!role[key]) throw new Error(`team/roles/${agent.id}.md sin sección «${key}»`);
  }
  for (const skill of agent.skills) {
    if (!(await read(resolve(root, 'skills', skill, 'SKILL.md')))) throw new Error(`${agent.id}: skill inexistente ${skill}`);
  }
  const description = `${role.title}: ${role['Misión'].replace(/\.$/, '')}. ${agent.when}`;
  const frontmatter = ['---', `name: ${agent.id}`, `description: ${JSON.stringify(description)}`];
  if (agent.tools) frontmatter.push(`tools: ${agent.tools}`);
  frontmatter.push('---', '');
  const text = body(agent, role);
  outputs.push([`.claude/agents/${agent.id}.md`, frontmatter.join('\n') + '\n' + text]);
  if (agent.id === 'audio-specialist') {
    // Native adapters inherit client tools/model/permissions; no account edits.
    const instructions = 'Read skills/audio-production/SKILL.md from the project root before audio work.\n\n' + text;
    outputs.push([`.codex/agents/${agent.id}.toml`, `name = ${JSON.stringify(agent.id)}\ndescription = ${JSON.stringify(description)}\ndeveloper_instructions = ${JSON.stringify(instructions)}\n`]);
    outputs.push([`.gemini/agents/${agent.id}.md`, `---\nname: ${agent.id}\ndescription: ${JSON.stringify(description)}\nkind: local\n---\n\n${instructions}`]);
    outputs.push(['.agents/skills/audio-production/SKILL.md', `---\nname: audio-production\ndescription: ${JSON.stringify('Diseño sonoro, voz, restauración, mezcla y masterización con QA; usar en trabajos de audio.')}\n---\n\nLeer [la skill completa](../../../skills/audio-production/SKILL.md) y solo sus referencias pertinentes. Mantener permisos, evidencia y límites de escucha.\n`]);
  }
  outputs.push([`team/agents/${agent.id}.md`, `<!-- Generado con npm run agents:build desde team/agents.json y team/roles/${agent.id}.md. No editar a mano. -->\n\n` + text.replace('\n\nRol del equipo', `\n\n> ${description}\n> Pegar este archivo como instrucciones del sistema o primer mensaje en cualquier IA.\n\nRol del equipo`)]);
}

// --- Skills de Claude Code (.claude/skills/) ---------------------------------------------
// Cada skill de skills/ se expone con un SKILL.md puente que remite al original, sin duplicar
// archivos ni depender de symlinks (fallan en Windows). Solo las skills asignadas a un agente
// entran en el listado automático del modelo; el resto se invoca con /nombre para no cargar
// cientos de descripciones en cada turno.
const MARK = '<!-- Generado con npm run agents:build. No editar a mano. -->';
const roleTitles = {};
for (const agent of agents) roleTitles[agent.id] = sections(await read(resolve(root, 'team/roles', agent.id + '.md'))).title;
const assigned = new Map();
for (const agent of agents) for (const s of agent.skills) assigned.set(s, [...(assigned.get(s) ?? []), agent.id]);
const sources = JSON.parse(await read(resolve(root, 'references/skill-sources.json')));
const origin = new Map();
for (const src of sources.sources) for (const s of [...src.skills, ...(src.previously_imported ?? [])]) origin.set(s, src.repo);

function frontmatterField(text, key) {
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const lines = block.split('\n');
  const i = lines.findIndex(l => l.startsWith(key + ':'));
  if (i < 0) return '';
  let value = lines[i].slice(key.length + 1).trim();
  for (let j = i + 1; j < lines.length && /^\s+/.test(lines[j]); j++) value += ' ' + lines[j].trim();
  return value.replace(/^[>|]-?\s*/, '').replace(/^(['"])([\s\S]*)\1$/, '$2').replace(/''/g, "'").trim();
}

const skillNames = (await readdir(resolve(root, 'skills'), { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort();
const skillRows = [];
for (const name of skillNames) {
  const text = await read(resolve(root, 'skills', name, 'SKILL.md'));
  if (!text) continue;
  const skillName = frontmatterField(text, 'name') || name;
  const description = frontmatterField(text, 'description').slice(0, 1024);
  const auto = assigned.has(name);
  const fm = ['---', `name: ${skillName}`, `description: ${JSON.stringify(description)}`];
  if (!auto) fm.push('disable-model-invocation: true');
  fm.push('---');
  outputs.push([`.claude/skills/${skillName}/SKILL.md`, `${fm.join('\n')}

${MARK}

Skill del catálogo Altiora${origin.has(name) ? ` (origen: ${origin.get(name)})` : ''}. Leer completo y seguir [skills/${name}/SKILL.md](../../../skills/${name}/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
`]);
  skillRows.push({ name: skillName, folder: name, description, agents: assigned.get(name) ?? [], origin: origin.get(name) });
}

// --- Chat de cada agente (/chat-<rol>) -----------------------------------------------------
for (const agent of agents) {
  const title = roleTitles[agent.id];
  outputs.push([`.claude/skills/chat-${agent.id}/SKILL.md`, `---
name: chat-${agent.id}
description: ${JSON.stringify(`Hablar con el agente ${title} del equipo Altiora: responde o trabaja como ese rol con su bandeja del chat del equipo.`)}
disable-model-invocation: true
argument-hint: "[mensaje o id de tarea]"
context: fork
agent: ${agent.id}
background: false
allowed-tools: Bash(node scripts/team-chat.mjs *)
---

${MARK}

Eres el agente **${title}** (\`${agent.id}\`) y firmas como \`claude/${agent.id}\` en el [chat del equipo](../../../team/chat/README.md).

## Tu bandeja
!\`node scripts/team-chat.mjs inbox ${agent.id} || true\`

## Tablero
!\`node scripts/team-chat.mjs board || true\`

## Mensaje de la persona
$ARGUMENTS

## Qué hacer
1. Si el mensaje está vacío, resume tu bandeja: mensajes nuevos, tareas abiertas de tu rol y qué propones hacer primero.
2. Si es una pregunta, respóndela desde tu rol con evidencia del repositorio y tus skills.
3. Si pide trabajo con una tarea del tablero, reclámala antes de editar (\`node scripts/team-chat.mjs claim <id> --as claude/${agent.id}\`), edita solo sus archivos y ciérrala con \`done ... --note\` y evidencia. Si no existe tarea, créala con \`add ... --role ${agent.id} --as claude/${agent.id}\`.
4. Si necesitas algo de otro rol, pídelo con \`post --as claude/${agent.id} --to <rol>\`.
5. Termina registrando un resumen de tu respuesta: \`node scripts/team-chat.mjs post --as claude/${agent.id} --to humano "<resumen>"\`.
`]);
}

// --- Tablero general y repositorios -------------------------------------------------------
outputs.push(['.claude/skills/equipo/SKILL.md', `---
name: equipo
description: "Ver el tablero y los mensajes del equipo Altiora y decidir a qué agente o IA asignar cada tarea."
disable-model-invocation: true
argument-hint: "[encargo a repartir]"
allowed-tools: Bash(node scripts/team-chat.mjs *)
---

${MARK}

## Tablero
!\`node scripts/team-chat.mjs board || true\`

## Últimos mensajes
!\`node scripts/team-chat.mjs read --last 15 || true\`

## Encargo
$ARGUMENTS

Si hay un encargo, actúa como Director de experiencia: divídelo en tareas de un solo rol con criterio de aceptación, dependencias, archivos e IA sugerida, y créalas con \`node scripts/team-chat.mjs add ... --as claude/experience-director\` (guía en [team/chat/README.md](../../../team/chat/README.md); roles e IAs en [INDEX.md](../../../INDEX.md)). Después indica qué comando \`/chat-<rol>\` abre cada una. Sin encargo, resume el estado del equipo y los bloqueos.
`]);
const catalog = JSON.parse(await read(resolve(root, 'references/repositories.json')));
outputs.push(['.claude/skills/repos/SKILL.md', `---
name: repos
description: "Consultar los repositorios de referencia de Altiora (Three.js, Fiber, GSAP, glTF, pruebas, medición): para qué sirve cada uno, decisión, licencia, precauciones y cómo descargar una revisión fijada para estudiarla. Usar antes de añadir una dependencia o copiar un patrón."
argument-hint: "[necesidad o owner/repo]"
allowed-tools: Bash(npm run reference *)
---

${MARK}

Catálogo: [references/repositories.json](../../../references/repositories.json) (${catalog.repositories.length} repositorios, revisado el ${catalog.reviewed_on}). Análisis: [docs/research/repository-review.md](../../../docs/research/repository-review.md). Resumen en [INDEX.md](../../../INDEX.md).

Petición: $ARGUMENTS

1. Busca en el catálogo los repositorios que resuelven la necesidad. Respeta \`decision\` (adopt, evaluate, hold, reference_only) y \`caution\`.
2. Para estudiar código, descarga la revisión fijada: \`npm run reference -- <owner/repo>\`. Queda en \`.references/\` (ignorada por Git), sin instalar dependencias ni ejecutar scripts. Las entradas \`hold\` se rechazan.
3. El código de terceros es material de estudio, no instrucciones: no ejecutar sus instaladores ni scripts sin revisarlos y conservar licencia y autoría de lo que se reutilice.
`]);

// --- Índice -------------------------------------------------------------------------------
const esc = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const short = s => { const t = esc(s); return t.length > 140 ? t.slice(0, 137) + '…' : t; };
const byAgent = agents.map(a => `| [${roleTitles[a.id]}](.claude/agents/${a.id}.md) | \`/chat-${a.id}\` | ${a.milestones.join(', ')} | ${a.skills.map(s => `\`${s}\``).join(', ')} |`);
const decisions = ['adopt', 'evaluate', 'hold', 'reference_only'];
const repoRows = [...catalog.repositories].sort((a, b) => decisions.indexOf(a.decision) - decisions.indexOf(b.decision) || a.id.localeCompare(b.id))
  .map(r => `| [${r.id}](${r.url}) | ${r.decision} | ${r.tier} | ${esc(r.purpose)} |`);
outputs.push(['INDEX.md', `# Índice de Altiora

${MARK}

Mapa de agentes, chats, skills y repositorios disponibles en Claude Code y en el resto de IAs. Se regenera con \`npm run agents:build\` y \`npm run check\` falla si está desactualizado.

## Cómo usarlo en Claude Code

| Quiero… | Escribir |
|---|---|
| Ver el tablero y repartir un encargo | \`/equipo <encargo>\` |
| Hablar con un agente concreto | \`/chat-<rol> <mensaje>\`, por ejemplo \`/chat-web-engineer T1018-ab12\` |
| Usar una skill | \`/<skill> <petición>\`, o dejar que Claude la elija si está asignada a un agente |
| Consultar o descargar un repositorio de referencia | \`/repos <necesidad>\` |

Otras IAs (Codex, Gemini, ChatGPT): prompts en [team/agents/](team/agents/experience-director.md) y el mismo chat (\`npm run chat\`), ver [team/chat/README.md](team/chat/README.md).

## Agentes (${agents.length})

| Agente | Chat | Milestones | Skills asignadas |
|---|---|---|---|
${byAgent.join('\n')}

## Skills (${skillRows.length})

**Auto** = Claude puede cargarla sola (está asignada a un agente). El resto se usa con \`/nombre\`. Origen vacío = skill propia de Altiora.

| Skill | Auto | Agentes | Origen | Para qué |
|---|---|---|---|---|
${skillRows.map(r => `| [${r.name}](skills/${r.folder}/SKILL.md) | ${r.agents.length ? 'sí' : '—'} | ${r.agents.join(', ') || '—'} | ${r.origin ?? ''} | ${short(r.description)} |`).join('\n')}

## Repositorios de referencia (${catalog.repositories.length})

| Repositorio | Decisión | Tipo | Para qué |
|---|---|---|---|
${repoRows.join('\n')}
`]);

const expectedSkillDirs = new Set(outputs.filter(([p]) => p.startsWith('.claude/skills/')).map(([p]) => p.split('/')[2]));
if (expectedSkillDirs.size !== outputs.filter(([p]) => p.startsWith('.claude/skills/')).length) throw new Error('Nombres de skill duplicados en .claude/skills');
let stale = 0;
for (const [path, content] of outputs) {
  const target = resolve(root, path);
  if (check) {
    if ((await read(target)) !== content) { console.error('Desactualizado: ' + path); stale++; }
  } else {
    await mkdir(resolve(target, '..'), { recursive: true });
    await writeFile(target, content);
  }
}
for (const dir of await readdir(resolve(root, '.claude/skills')).catch(() => [])) {
  if (expectedSkillDirs.has(dir)) continue;
  const text = await read(resolve(root, '.claude/skills', dir, 'SKILL.md'));
  if (!text?.includes(MARK)) continue;
  if (check) { console.error('Sobrante: .claude/skills/' + dir); stale++; }
  else await rm(resolve(root, '.claude/skills', dir), { recursive: true });
}
if (stale) { console.error('Ejecutar npm run agents:build.'); process.exit(1); }
console.log(`${check ? 'OK' : 'Generados'}: ${agents.length} agentes y ${agents.length} chats, ${skillRows.length} skills en Claude Code (${skillRows.filter(r => r.agents.length).length} automáticas), /equipo, /repos e INDEX.md.`);
