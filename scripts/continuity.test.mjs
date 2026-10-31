import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {ROOT, validateCheckpoint, checkContextFiles, makeResumeText} from "./continuity.mjs";

const state = JSON.parse(await readFile(new URL("../continuity/checkpoint.json", import.meta.url), "utf8"));
const clone = () => structuredClone(state);

test("latest checkpoint passes structural validation", () => {
  assert.equal(validateCheckpoint(state), true);
  assert.ok(state.completed_milestones.some((x) => x.id === "VIS-04"));
  assert.ok(state.current_milestone.next_steps.length >= 2);
});

test("linked context files exist", async () => {
  await checkContextFiles(state);
});

test("resume prompt distinguishes application issues from repo issues", () => {
  const result = makeResumeText(state, "prompt");
  assert.match(result, /RETOMAR ALTIORA/);
  assert.match(result, /GitHub Actions/);
  assert.match(result, /ChatGPT/);
  assert.match(result, /VIS-05/);
});

test("cannot label a completed task without evidence", () => {
  const bad = clone();
  bad.completed_milestones[0].evidence = [];
  assert.throws(() => validateCheckpoint(bad), /Falta evidencia/);
});

test("cannot claim TESTED_IN_CI without a check link", () => {
  const bad = clone();
  const cap = bad.capabilities.find((x) => x.status === "TESTED_IN_CI");
  cap.evidence = [];
  assert.throws(() => validateCheckpoint(bad), /Falta prueba CI/);
});

test("cannot mark unavailable external integration as CONNECTED", () => {
  const bad = clone();
  bad.capabilities.find((x) => x.name.includes("Adobe")).status = "CONNECTED";
  assert.throws(() => validateCheckpoint(bad), /Estado de capacidad no válido/);
});

test("cannot silently reuse completed milestone ID", () => {
  const bad = clone();
  bad.current_milestone.id = "VIS-04";
  assert.throws(() => validateCheckpoint(bad), /aparece como completado/);
});

test("blocked tasks require explicit blocker", () => {
  const bad = clone();
  bad.current_milestone.next_steps.find((x) => x.status === "BLOCKED").blocker = null;
  assert.throws(() => validateCheckpoint(bad), /blocker/);
});
