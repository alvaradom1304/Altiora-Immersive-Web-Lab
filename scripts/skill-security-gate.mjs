// Altiora security gate. Never executes or installs the skill being inspected.
// Requires the independently installed NVIDIA SkillSpector CLI (pinned, reviewed).
// Default: static-only scanning. No skill contents sent to an LLM by this wrapper.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function evaluateScan(report, exitStatus) {
  if (exitStatus !== 0) return { allowed: false, reason: 'Scan failed, was incomplete, or the scanner rejected the target.' };
  if (!report || typeof report !== 'object' || report.execution_successful !== true) {
    return { allowed: false, reason: 'Missing or unsuccessful scan evidence.' };
  }
  const risk = report.risk_assessment;
  if (!risk || !Number.isFinite(risk.score) || typeof risk.recommendation !== 'string') {
    return { allowed: false, reason: 'Unrecognized scan report schema.' };
  }
  if (risk.recommendation !== 'SAFE' || risk.score > 20) {
    return { allowed: false, reason: `Security review required: ${risk.recommendation} (${risk.score}/100).` };
  }
  return { allowed: true, reason: `Static scan passed: SAFE (${risk.score}/100). Manual source and license review still required.` };
}

function main(args) {
  if (args.length !== 2 || args[0] !== '--target' || !args[1].trim()) {
    console.error('Usage: npm run security:scan -- --target <local-staged-skill-directory-or-git-url>');
    process.exitCode = 2;
    return;
  }
  const result = spawnSync('skillspector', [
    'scan', args[1], '--no-llm', '--format', 'json', '--fail-on-incomplete'
  ], {
    shell: false, encoding: 'utf8', timeout: 180000, maxBuffer: 12 * 1024 * 1024,
    windowsHide: true
  });
  if (result.error) {
    console.error('BLOCKED: SkillSpector unavailable or timed out. Install the pinned, reviewed CLI first.');
    console.error(result.error.message);
    process.exitCode = 2;
    return;
  }
  let report;
  try { report = JSON.parse(result.stdout || ''); }
  catch {
    console.error('BLOCKED: SkillSpector did not return valid JSON. No approval without evidence.');
    if (result.stderr) console.error(result.stderr.slice(0, 1500));
    process.exitCode = 2;
    return;
  }
  const decision = evaluateScan(report, result.status);
  console.log((decision.allowed ? 'SCAN PASSED (not installation authorization): ' : 'BLOCKED: ') + decision.reason);
  console.log('Mode: static-only; supply-chain lookup may send dependency coordinates to OSV.dev.');
  console.log('Findings:', Array.isArray(report.issues) ? report.issues.length : 'unknown');
  if (!decision.allowed) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
