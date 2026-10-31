#!/usr/bin/env node
/**
 * Altiora continuity: portable, dependency-free recovery from a versioned checkpoint.
 * NEVER mutates GitHub, starts agents, renders media or assumes a live connection.
 */
import assert from "node:assert/strict";
import {readFile, stat} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve, relative, isAbsolute, sep} from "node:path";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const DEFAULT_STATE = resolve(ROOT, "continuity/checkpoint.json");

const validResults = new Set(["MERGED", "DONE"]);
const validCurrent = new Set(["PLANNED", "ACTIVE", "BLOCKED", "REVIEW"]);
const validSteps = new Set(["PENDING", "BLOCKED", "IN_PROGRESS", "DONE"]);
const validCapabilities = new Set(["DOCUMENTED", "TESTED_IN_CI", "UNVERIFIED", "NOT_CONNECTED"]);

const mustBeText = (value, key) => {
  assert.equal(typeof value, "string", key + " debe ser string");
  assert.ok(value.trim().length > 0, key + " no puede estar vacío");
};

export function validateCheckpoint(s) {
  assert.ok(s && typeof s === "object" && !Array.isArray(s));
  assert.equal(s.schema_version, 1);
  assert.match(s.repository, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  assert.match(s.snapshot_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(s.snapshot_kind, "repo_checkpoint_not_live_github_api");
  mustBeText(s.project, "project");
  mustBeText(s.description, "description");

  assert.ok(Array.isArray(s.completed_milestones) && s.completed_milestones.length > 0);
  const completedIds = new Set();
  for (const item of s.completed_milestones) {
    mustBeText(item.id, "completed.id");
    assert.ok(!completedIds.has(item.id), "Milestone duplicado " + item.id);
    completedIds.add(item.id);
    mustBeText(item.name, "completed.name");
    assert.ok(validResults.has(item.result), "Milestone con resultado inválido: " + item.id);
    assert.ok(Array.isArray(item.evidence) && item.evidence.length > 0, "Falta evidencia: " + item.id);
    for (const ev of item.evidence) {
      mustBeText(ev.claim, "evidence.claim");
      assert.ok(typeof ev.url === "string" && ev.url.startsWith("https://github.com/" + s.repository + "/"), "Evidencia de origen no permitida: " + item.id);
      const url = new URL(ev.url);
      assert.equal(url.protocol, "https:");
    }
  }
  const m = s.current_milestone;
  assert.ok(m && typeof m === "object", "Sin milestone actual");
  mustBeText(m.id, "current_milestone.id");
  assert.ok(!completedIds.has(m.id), "Milestone actual aparece como completado");
  mustBeText(m.name, "current_milestone.name");
  assert.ok(validCurrent.has(m.status));
  assert.ok(Array.isArray(m.next_steps) && m.next_steps.length > 0);
  const steps = new Set();
  for (const step of m.next_steps) {
    mustBeText(step.id, "next_step.id");
    assert.ok(!steps.has(step.id), "Paso duplicado: " + step.id);
    steps.add(step.id);
    mustBeText(step.action, "next_step.action");
    mustBeText(step.deliverable, "next_step.deliverable");
    mustBeText(step.validation, "next_step.validation");
    assert.ok(validSteps.has(step.status), "Estado no válido en " + step.id);
    if (step.status === "BLOCKED") mustBeText(step.blocker, "blocker para " + step.id);
  }
  assert.ok(Array.isArray(s.capabilities) && s.capabilities.length > 0);
  const names = new Set();
  for (const cap of s.capabilities) {
    mustBeText(cap.name, "capability.name");
    assert.ok(!names.has(cap.name), "Capacidad duplicada " + cap.name);
    names.add(cap.name);
    assert.ok(validCapabilities.has(cap.status), "Estado de capacidad no válido: " + cap.name);
    assert.ok(Array.isArray(cap.evidence));
    if (cap.status === "TESTED_IN_CI") assert.ok(cap.evidence.length > 0, "Falta prueba CI de " + cap.name);
    for (const url of cap.evidence) {
      assert.ok(typeof url === "string" && url.startsWith("https://github.com/" + s.repository + "/"));
    }
  }
  assert.ok(Array.isArray(s.context_files) && s.context_files.length > 0);
  for (const path of s.context_files) {
    mustBeText(path, "context_files path");
    const abs = resolve(ROOT, path);
    const rel = relative(ROOT, abs);
    assert.ok(rel && !isAbsolute(rel) && rel !== ".." && !rel.startsWith(".." + sep), "Archivo fuera del repositorio: " + path);
  }
  assert.ok(Array.isArray(s.known_limits) && s.known_limits.length > 0);
  s.known_limits.forEach((x) => mustBeText(x, "known_limits entry"));
  mustBeText(s.recovery_instruction, "recovery_instruction");
  return true;
}

export async function checkContextFiles(s) {
  for (const path of s.context_files) {
    const exists = await stat(resolve(ROOT, path)).then((x) => x.isFile(), () => false);
    assert.ok(exists, "Archivo referenciado no existe: " + path);
  }
}

export function makeResumeText(s, mode = "summary") {
  validateCheckpoint(s);
  if (mode === "prompt") {
    return [
      "RETOMAR ALTIORA — leer " + s.repository + "/blob/main/continuity/checkpoint.json.",
      "Proyecto: " + s.project + "; milestone actual: " + s.current_milestone.id + " (" + s.current_milestone.status + ").",
      "Antes de asumir estado: verificar rama main, pull requests, GitHub Actions y archivos locales.",
      "Prioridades:", ...s.current_milestone.next_steps.map((step) => "- " + step.id + " [" + step.status + "] " + step.action + (step.blocker ? " | Bloqueo: " + step.blocker : "")),
      "No repetir trabajo MERGED, no fingir herramientas conectadas, conservar evidencias; distinguir fallos de interfaz ChatGPT y fallos del repo.",
      "Avanzar sobre las tareas desbloqueadas sin solicitar de nuevo todo el contexto."
    ].join("\n");
  }
  return [
    "# Altiora — checkpoint (" + s.snapshot_date + ")",
    "Estado del archivo: snapshot versionado; NO es una lectura en vivo de GitHub.",
    "Completado: " + s.completed_milestones.map(x => x.id).join(", "),
    "Milestone actual: " + s.current_milestone.id + " — " + s.current_milestone.name + " [" + s.current_milestone.status + "]",
    "Pasos siguientes:",
    ...s.current_milestone.next_steps.map(x => "- " + x.id + ": " + x.action + " [" + x.status + "]" + (x.blocker ? " — requiere: " + x.blocker : "")),
    "Capacidades registradas:",
    ...s.capabilities.map(x => "- " + x.name + ": " + x.status),
    "Para recuperar una instrucción breve: npm run resume -- --prompt"
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const modes = ["--check", "--prompt", "--json", "--summary"];
  const selected = args.filter(a => modes.includes(a));
  assert.ok(selected.length <= 1, "Elegir solo un modo.");
  assert.ok(args.length === selected.length, "Argumento inválido. Usar --check, --prompt, --json o --summary.");
  const mode = selected[0] ?? "--summary";
  const state = JSON.parse(await readFile(DEFAULT_STATE, "utf8"));
  validateCheckpoint(state);
  await checkContextFiles(state);
  if (mode === "--check") {
    process.stdout.write("OK: checkpoint estructural válido y archivos de contexto encontrados.\n");
  } else if (mode === "--json") {
    process.stdout.write(JSON.stringify(state, null, 2) + "\n");
  } else {
    process.stdout.write(makeResumeText(state, mode === "--prompt" ? "prompt" : "summary") + "\n");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {process.stderr.write("ERROR continuidad: " + error.message + "\n"); process.exitCode = 1;});
}
