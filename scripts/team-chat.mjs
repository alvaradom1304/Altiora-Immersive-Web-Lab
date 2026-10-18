// Chat y tablero de tareas compartido entre Claude, Codex, Gemini, ChatGPT y personas.
// Guía: team/chat/README.md. Datos en team/chat/ (o en ALTIORA_CHAT_DIR, p. ej. una carpeta compartida).
//   messages.jsonl   un mensaje por línea; Git lo fusiona por unión (.gitattributes)
//   tasks/<id>.json  una tarea por archivo, para que dos IAs no choquen al editar
import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const dir = resolve(root, process.env.ALTIORA_CHAT_DIR || 'team/chat');
const tasksDir = resolve(dir, 'tasks');
const messagesPath = resolve(dir, 'messages.jsonl');
const roles = JSON.parse(await readFile(resolve(root, 'team/agents.json'), 'utf8')).agents.map(a => a.id);
const STATUS = { pendiente: '○', en_curso: '◐', bloqueada: '■', hecha: '●' };

const [command, ...rest] = process.argv.slice(2);
const opts = {}, args = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) opts[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') || rest[i + 1] === undefined ? true : rest[++i];
  else args.push(rest[i]);
}

function fail(message) { console.error(message); process.exit(1); }
function who() {
  const as = opts.as;
  if (typeof as !== 'string' || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(as)) fail('Indicar --as <ia>/<rol>, por ejemplo --as claude/web-engineer o --as humano/experience-director');
  const role = as.split('/')[1];
  if (!roles.includes(role)) fail(`Rol desconocido «${role}». Roles: ${roles.join(', ')}`);
  return as;
}
function checkTarget(to) {
  if (to === 'todos' || roles.includes(to) || /^[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(to)) return to;
  fail('Destinatario no válido: ' + to);
}
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');

async function messages() {
  const text = await readFile(messagesPath, 'utf8').catch(() => '');
  return text.split('\n').filter(Boolean).map(l => JSON.parse(l)).sort((a, b) => a.at.localeCompare(b.at));
}
async function post(message) {
  await mkdir(dir, { recursive: true });
  await appendFile(messagesPath, JSON.stringify({ at: now(), ...message }) + '\n');
}
async function tasks() {
  const files = await readdir(tasksDir).catch(() => []);
  const list = [];
  for (const f of files.filter(f => f.endsWith('.json'))) list.push(JSON.parse(await readFile(resolve(tasksDir, f), 'utf8')));
  return list.sort((a, b) => a.created.localeCompare(b.created));
}
async function load(id) {
  try { return JSON.parse(await readFile(resolve(tasksDir, id + '.json'), 'utf8')); }
  catch { fail('No existe la tarea ' + id); }
}
async function save(task) {
  await mkdir(tasksDir, { recursive: true });
  await writeFile(resolve(tasksDir, task.id + '.json'), JSON.stringify(task, null, 2) + '\n');
}
function line(m) {
  return `${m.at.slice(0, 16).replace('T', ' ')}  ${m.from} → ${m.to}${m.task ? ` [${m.task}]` : ''}: ${m.text}`;
}
async function transition(status, verb) {
  const from = who();
  const task = await load(args[0] ?? fail('Indicar el id de la tarea'));
  if (status === 'en_curso' && task.status === 'en_curso' && task.owner !== from) fail(`${task.id} ya está en curso por ${task.owner}. Escribirle con post en lugar de duplicar trabajo.`);
  if (status === 'en_curso') {
    const open = (await tasks()).filter(t => task.depends.includes(t.id) && t.status !== 'hecha');
    if (open.length && !opts.force) fail(`${task.id} depende de tareas abiertas: ${open.map(t => t.id).join(', ')} (usar --force si se acordó en el chat)`);
  }
  if (status !== 'en_curso' && task.owner && task.owner !== from && !opts.force) fail(`${task.id} pertenece a ${task.owner}.`);
  if ((status === 'bloqueada' || status === 'hecha') && typeof opts.note !== 'string') fail('Indicar --note con el resultado, evidencia o motivo.');
  task.status = status;
  task.owner = status === 'pendiente' ? null : from;
  task.history.push({ at: now(), by: from, status, note: typeof opts.note === 'string' ? opts.note : undefined });
  await save(task);
  const to = status === 'hecha' ? task.reviewer ?? 'experience-director' : status === 'bloqueada' ? 'experience-director' : 'todos';
  await post({ from, to, task: task.id, text: `${verb}: ${task.title}${typeof opts.note === 'string' ? ' — ' + opts.note : ''}` });
  console.log(`${task.id} → ${status}`);
}

switch (command) {
  case 'post': {
    const text = args.join(' ').trim() || fail('Falta el texto del mensaje.');
    await post({ from: who(), to: checkTarget(typeof opts.to === 'string' ? opts.to : 'todos'), task: typeof opts.task === 'string' ? opts.task : undefined, text });
    console.log('Enviado.');
    break;
  }
  case 'read': {
    const all = await messages();
    const last = Number(opts.last) || 30;
    console.log(all.slice(-last).map(line).join('\n') || 'Sin mensajes.');
    break;
  }
  case 'inbox': {
    const me = args[0] ?? fail('Uso: inbox <rol|ia|ia/rol>');
    const [ai, role] = me.includes('/') ? me.split('/') : [me, me];
    const mine = (await messages()).filter(m => [me, ai, role, 'todos'].includes(m.to)).slice(-(Number(opts.last) || 20));
    const assigned = (await tasks()).filter(t => t.status !== 'hecha' && (t.role === role || t.owner === me || t.ai === ai));
    console.log('Mensajes:\n' + (mine.map(line).join('\n') || '  —'));
    console.log('\nTareas abiertas:\n' + (assigned.map(t => `  ${STATUS[t.status]} ${t.id} ${t.title} (${t.status}${t.owner ? ', ' + t.owner : ''})`).join('\n') || '  —'));
    break;
  }
  case 'add': {
    const from = who();
    const title = args.join(' ').trim() || fail('Falta el título de la tarea.');
    const role = opts.role;
    if (!roles.includes(role)) fail(`Indicar --role con uno de: ${roles.join(', ')}`);
    const d = new Date();
    const id = `T${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${randomBytes(2).toString('hex')}`;
    const depends = typeof opts.depends === 'string' ? opts.depends.split(',').map(s => s.trim()) : [];
    for (const dep of depends) await load(dep);
    const task = {
      id, title, role,
      ai: typeof opts.ai === 'string' ? opts.ai : null,
      reviewer: typeof opts.reviewer === 'string' ? checkTarget(opts.reviewer) : null,
      depends, files: typeof opts.files === 'string' ? opts.files.split(',').map(s => s.trim()) : [],
      acceptance: typeof opts.accept === 'string' ? opts.accept : null,
      status: 'pendiente', owner: null, created: now(), created_by: from,
      history: [{ at: now(), by: from, status: 'pendiente' }],
    };
    await save(task);
    await post({ from, to: task.ai ? `${task.ai}/${role}` : role, task: id, text: `Nueva tarea: ${title}${task.acceptance ? ' — aceptación: ' + task.acceptance : ''}` });
    console.log(id);
    break;
  }
  case 'claim': await transition('en_curso', 'Reclamada'); break;
  case 'release': await transition('pendiente', 'Liberada'); break;
  case 'block': await transition('bloqueada', 'Bloqueada'); break;
  case 'done': await transition('hecha', 'Hecha, pide revisión'); break;
  case 'board': {
    const list = await tasks();
    if (!list.length) { console.log('Tablero vacío. Crear tareas con: npm run chat -- add "título" --role <rol> --as <ia>/<rol>'); break; }
    console.log('| Estado | Id | Tarea | Rol | IA sugerida | Dueño | Depende de |\n|---|---|---|---|---|---|---|');
    for (const t of list) console.log(`| ${STATUS[t.status]} ${t.status} | ${t.id} | ${t.title} | ${t.role} | ${t.ai ?? '—'} | ${t.owner ?? '—'} | ${t.depends.join(', ') || '—'} |`);
    break;
  }
  case 'show': {
    console.log(JSON.stringify(await load(args[0] ?? fail('Uso: show <id>')), null, 2));
    break;
  }
  default:
    console.log(`Uso: npm run chat -- <orden>
  board                                   tablero de tareas
  read [--last 30]                        últimos mensajes
  inbox <rol|ia|ia/rol>                   mensajes y tareas para mí
  post --as ia/rol [--to rol|ia|todos] [--task id] "texto"
  add "título" --role rol --as ia/rol [--ai codex] [--reviewer qa-reviewer] [--depends id,id] [--files a,b] [--accept "criterio"]
  claim <id> --as ia/rol                  reclamar antes de trabajar
  done <id> --as ia/rol --note "evidencia"
  block <id> --as ia/rol --note "motivo"
  release <id> --as ia/rol                devolver al tablero
  show <id>                               detalle e historial
Roles: ${roles.join(', ')}
Datos en: ${dir}`);
}
