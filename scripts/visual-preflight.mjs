#!/usr/bin/env node
/**
 * Read-only capability inspection for Altiora visual production.
 * No installs, plugins, renders, network requests or secret reads.
 */
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

export function probeExecutable(name, executable, args, runner = spawnSync) {
  assert.equal(typeof executable, "string");
  assert.ok(Array.isArray(args) && args.every(x => typeof x === "string"));
  try {
    const result = runner(executable, args, {
      shell: false,
      encoding: "utf8",
      timeout: 5000,
      maxBuffer: 128 * 1024,
      windowsHide: true
    });
    if (result.error?.code === "ENOENT") return {name, status: "NOT_FOUND", version: null};
    if (result.error || result.status !== 0) return {name, status: "ERROR", version: null};
    const line = String(result.stdout || result.stderr || "")
      .split(/\r?\n/).find(x => x.trim().length > 0) ?? "";
    return {name, status: "AVAILABLE", version: line.slice(0, 100)};
  } catch {
    return {name, status: "ERROR", version: null};
  }
}

export async function inspectRemotion() {
  const declared = JSON.parse(await readFile(resolve(root, "experiments/tilicheros-motion-lab/package.json"), "utf8"));
  const requiredVersion = declared.dependencies.remotion;
  const path = resolve(root, "experiments/tilicheros-motion-lab/node_modules/remotion/package.json");
  try {
    const installed = JSON.parse(await readFile(path, "utf8"));
    return {
      name: "Remotion local en experimento Tilicheros",
      status: installed.version === requiredVersion ? "AVAILABLE" : "VERSION_MISMATCH",
      version: installed.version,
      declared_version: requiredVersion
    };
  } catch {
    return {name: "Remotion local en experimento Tilicheros", status: "NOT_INSTALLED", version: null, declared_version: requiredVersion};
  }
}

export async function createReport(runner = spawnSync) {
  const bins = [
    ["Blender", "blender", ["--version"]],
    ["FFmpeg", "ffmpeg", ["-version"]],
    ["Git", "git", ["--version"]],
    ["npm", "npm", ["--version"]],
    ["Python 3", "python3", ["--version"]]
  ];
  const tools = bins.map(([name, command, args]) => probeExecutable(name, command, args, runner));
  tools.push(await inspectRemotion());
  return {
    schema_version: 1,
    report_type: "local_visual_preflight",
    execution_context: process.env.GITHUB_ACTIONS === "true" ? "GITHUB_ACTIONS_RUNNER" : "CURRENT_MACHINE",
    node_version: process.version,
    tools,
    manual_checks: [
      {name: "Adobe Photoshop / Premiere / After Effects", status: "MANUAL_CHECK_REQUIRED", reason: "Requiere app/version/licencia y autorización UXP o scripting; no existe CLI universal fiable."},
      {name: "Figma / conectores de IA", status: "MANUAL_CHECK_REQUIRED", reason: "La presencia de documentación no establece que la cuenta, el plugin o permisos estén conectados."},
      {name: "MCP Blender / Adobe", status: "MANUAL_CHECK_REQUIRED", reason: "No inspeccionar ni ejecutar servidores MCP sin auditoría de código, permisos y secretos."}
    ],
    warnings: [
      "La prueba informa únicamente sobre la máquina donde se ejecutó: no acredita instalaciones en otra computadora.",
      "AVAILABLE significa que el ejecutable respondió a --version; no prueba plugins, GPU, render, seguridad, licencia ni conexión de agentes.",
      "Este comando no realiza instalaciones, conexiones a servicios, lecturas de credenciales ni cambios de archivos."
    ]
  };
}

export function formatReport(result) {
  return [
    "Altiora Visual Studio — preflight [" + result.execution_context + "]",
    "Node: " + result.node_version,
    ...result.tools.map(t => "- " + t.name + ": " + t.status + (t.version ? " (" + t.version + ")" : "")),
    ...result.manual_checks.map(t => "- " + t.name + ": " + t.status),
    "",
    ...result.warnings
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || args.length === 1 && ["--json", "--text"].includes(args[0]), "Usar --json o --text");
  const report = await createReport();
  const result = args.includes("--json") ? JSON.stringify(report, null, 2) : formatReport(report);
  process.stdout.write(result + "\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => {process.stderr.write("Preflight falló: " + err.message + "\n"); process.exitCode = 1;});
}
