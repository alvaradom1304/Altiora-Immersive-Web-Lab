#!/usr/bin/env node
// Read-only project diagnostics. Never starts clients, MCP servers or renders.
import {readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createReport, probeExecutable} from './visual-preflight.mjs';
import {detectAerender} from './after-effects-bridge.mjs';
import {safeLocalPath} from './local-path-safety.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MAX_CONFIG_BYTES = 256 * 1024;
const CLIENTS = [
  {id: 'claude-code', instructions: 'CLAUDE.md', adapter: '.claude/agents/audio-specialist.md', config: '.mcp.json', verify: 'En Claude Code abrir /mcp y comprobar las herramientas altiora-after-effects.'},
  {id: 'codex', instructions: 'AGENTS.md', adapter: '.codex/agents/audio-specialist.toml', config: '.codex/config.toml', verify: 'En la sesión Codex revisar las herramientas MCP disponibles; el archivo de proyecto viene deshabilitado.'},
  {id: 'gemini-cli', instructions: 'GEMINI.md', adapter: '.gemini/agents/audio-specialist.md', config: '.gemini/settings.json', verify: 'En Gemini CLI ejecutar gemini mcp list y comprobar las herramientas en una sesión autorizada.'},
  {id: 'antigravity', instructions: 'GEMINI.md', adapter: 'team/agents/audio-specialist.md', config: '.agents/mcp_config.json', verify: 'En Antigravity revisar su panel MCP; el archivo local se prepara aparte, no se versiona.'},
  {id: 'chatgpt-web', instructions: 'AGENTS.md', adapter: 'team/agents/audio-specialist.md', config: null, verify: 'Usar el handoff compartido. Un chat web no obtiene acceso a la PC por leer estos archivos.'}
];

async function projectText(root, path) {
  const target = resolve(root, path);
  await safeLocalPath(root, target);
  const info = await stat(target);
  if (!info.isFile() || info.size > MAX_CONFIG_BYTES) throw new Error('UNSAFE_OR_OVERSIZE');
  return readFile(target, 'utf8');
}

// Only report allowlisted booleans; never return config contents, environment or paths.
export function summarizeMCP(text, format) {
  if (format === 'toml') {
    const section = text.match(/^\[mcp_servers\.altiora-after-effects\]\s*\r?\n([\s\S]*?)(?=^\[|$(?![\s\S]))/m)?.[1];
    if (!section) return {status: 'ENTRY_NOT_FOUND'};
    const match = section.match(/^enabled\s*=\s*(true|false)\s*(?:#.*)?$/m);
    return {status: 'ENTRY_TEXT_PRESENT_NOT_TOML_VALIDATED', enabled: match ? match[1] === 'true' : null};
  }
  const config = JSON.parse(text);
  const entry = config?.mcpServers?.['altiora-after-effects'];
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return {status: 'ENTRY_NOT_FOUND'};
  if (typeof entry.command !== 'string' || !entry.command.trim() || !Array.isArray(entry.args) || !entry.args.every(x => typeof x === 'string')) return {status: 'INVALID_ENTRY'};
  return {status: 'ENTRY_SHAPE_PRESENT', enabled: typeof entry.disabled === 'boolean' ? !entry.disabled : null, trusted: typeof entry.trust === 'boolean' ? entry.trust : null};
}

export async function inspectClients(root = ROOT) {
  return Promise.all(CLIENTS.map(async client => {
    const files = {};
    for (const [kind, path] of [['instructions', client.instructions], ['adapter', client.adapter]]) {
      try { files[kind] = (await projectText(root, path)).trim() ? 'PRESENT' : 'EMPTY'; }
      catch (e) { files[kind] = e.code === 'ENOENT' ? 'MISSING' : 'UNREADABLE_OR_UNSAFE'; }
    }
    let config = {status: 'NOT_APPLICABLE'};
    if (client.config) {
      try { config = summarizeMCP(await projectText(root, client.config), client.config.endsWith('.toml') ? 'toml' : 'json'); }
      catch (e) { config = {status: e.code === 'ENOENT' ? 'MISSING' : 'INVALID_UNREADABLE_OR_UNSAFE'}; }
    }
    return {client: client.id, project_files: files, mcp_config: config,
      connection: 'NOT_VERIFIED', execution_test: 'NOT_PERFORMED', next_action: client.verify};
  }));
}

export async function diagnose({root = ROOT, visualProbe = createReport, aeProbe = detectAerender, executableProbe = probeExecutable} = {}) {
  const visual = await visualProbe();
  let python = visual.tools.find(t => t.name === 'Python 3');
  if (python?.status !== 'AVAILABLE') {
    python = executableProbe('Python', 'python', ['--version']);
    if (python.status !== 'AVAILABLE' && process.platform === 'win32') python = executableProbe('Python', 'py', ['-3', '--version']);
  }
  const ae = aeProbe();
  return {
    schema_version: 1, report_type: 'altiora_capability_diagnostic',
    observed_at: new Date().toISOString(), execution_context: visual.execution_context,
    tools: [{name: 'Node.js', status: 'AVAILABLE', version: process.version},
      ...visual.tools.filter(t => t.name !== 'Python 3').map(t => process.platform === 'win32' && t.name === 'npm' && t.status !== 'AVAILABLE'
        ? {...t, status: 'WINDOWS_WRAPPER_NOT_PROBED', note: 'Direct process probes do not execute npm.cmd/npm.ps1; run npm --version in your own shell.'} : t), python,
      executableProbe('FFprobe', 'ffprobe', ['-version']),
      {name: 'After Effects aerender', status: ae.available ? 'DETECTED_NOT_RENDER_TESTED' : 'NOT_DETECTED', version: null}].filter(Boolean),
    clients: await inspectClients(root),
    next_actions: [
      'Para herramientas NOT_FOUND/NOT_DETECTED confirmar instalación y ruta con el propietario; no instalar automáticamente.',
      'Ejecutar routing:eval para recuperación de skills; el resultado no mide tokens ni ejecución de agentes.',
      'Para producción reunir medios y derechos aprobados, generar QA técnico y completar revisión humana; ver docs/operations/production-qa.md.'
    ],
    limits: [
      'Solo esta máquina y este checkout. Versiones disponibles no prueban licencias, GPU ni renders.',
      'Los adaptadores son archivos del proyecto; no acreditan descubrimiento o autenticación de ningún cliente.',
      'No se leen configuraciones personales, secretos ni cuentas; no se ejecutan clientes ni servidores MCP.',
      'No cambia configuraciones ni concede permisos. Un archivo presente no es una conexión.'
    ]
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length && !['--json', '--text'].includes(args[0]))) throw new Error('Use --json or --text');
  const report = await diagnose();
  process.stdout.write(args.includes('--text') ? [
    `Altiora — ${report.execution_context}`,
    ...report.tools.map(t => `${t.name}: ${t.status}`),
    ...report.clients.map(c => `${c.client}: ${c.mcp_config.status}; connection=${c.connection}`),
    ...report.limits
  ].join('\n') + '\n' : JSON.stringify(report, null, 2) + '\n');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {process.stderr.write('CAPABILITY_DIAGNOSTIC_FAILED: unable to inspect safely\n'); process.exitCode = 1;});
}
