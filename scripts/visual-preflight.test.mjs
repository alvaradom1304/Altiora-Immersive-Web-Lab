import test from "node:test";
import assert from "node:assert/strict";
import {probeExecutable, createReport, formatReport} from "./visual-preflight.mjs";

test("executable found is not mistaken for connected plugin", () => {
  const stub = () => ({status: 0, stdout: "Blender 4.3.1\nBuild: ..."});
  const value = probeExecutable("Blender", "blender", ["--version"], stub);
  assert.deepEqual(value, {name:"Blender", status:"AVAILABLE", version:"Blender 4.3.1"});
});

test("ENOENT becomes not found without claiming absence from whole computer", () => {
  const stub = () => ({status: null, error:{code:"ENOENT"}});
  const value = probeExecutable("Blender", "blender", ["--version"], stub);
  assert.equal(value.status, "NOT_FOUND");
});

test("failed or timed-out commands report error, never available", () => {
  const stub = () => ({status: null, error:{code:"ETIMEDOUT"}});
  assert.equal(probeExecutable("FFmpeg", "ffmpeg", ["-version"], stub).status, "ERROR");
  assert.equal(probeExecutable("Git", "git", ["--version"], () => ({status: 1, stderr:"bad"})).status, "ERROR");
});

test("preflight never claims Adobe, Figma or MCP connected", async () => {
  const stub = (cmd, args) => ({status: 0, stdout: "VERSION\n"});
  const report = await createReport(stub);
  assert.equal(report.report_type, "local_visual_preflight");
  assert.equal(report.manual_checks.length, 3);
  assert.ok(report.manual_checks.every(x => x.status === "MANUAL_CHECK_REQUIRED"));
  assert.equal(report.tools.length, 6);
  assert.doesNotMatch(formatReport(report), /AUTOMATICALLY_CONNECTED|LINKED_AND_READY/);
});

test("no arbitrary commands can be passed as preflight probes", () => {
  assert.throws(() => probeExecutable("bad","x","; destructive command"), {name:"AssertionError"});
});
