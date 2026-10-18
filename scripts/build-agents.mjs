// Genera los agentes del equipo a partir de team/agents.json y team/roles/<id>.md:
//   .claude/agents/<id>.md   subagentes de Claude Code
//   team/agents/<id>.md      prompt portable para Codex, Gemini, ChatGPT u otra IA
// Uso: node scripts/build-agents.mjs [--check]   (--check falla si los archivos generados no están al día)
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
  outputs.push([`team/agents/${agent.id}.md`, `<!-- Generado con npm run agents:build desde team/agents.json y team/roles/${agent.id}.md. No editar a mano. -->\n\n` + text.replace('\n\nRol del equipo', `\n\n> ${description}\n> Pegar este archivo como instrucciones del sistema o primer mensaje en cualquier IA.\n\nRol del equipo`)]);
}

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
if (stale) { console.error('Ejecutar npm run agents:build.'); process.exit(1); }
console.log(`${check ? 'OK' : 'Generados'}: ${agents.length} agentes para Claude Code y ${agents.length} prompts portables.`);
