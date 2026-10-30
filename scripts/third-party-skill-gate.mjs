#!/usr/bin/env node
// Security gate: FAIL CLOSED. Never install a skill directly from GitHub.
// Run: npm run security:gate -- --report path/to/skillspector.json --source https://github.com/org/repo --revision <40-hex-sha>
// This script parses a supplied SkillSpector report; it never executes scanned code or fetches secrets.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import url from "node:url";
function fail(message) { throw new Error(message); }
export function evaluate({report,source,revision,acknowledge=false}) {
 if(!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(source||""))fail("source GitHub inválida");
 if(!/^[a-f0-9]{40}$/.test(revision||""))fail("se requiere commit SHA-1 de 40 hex");
 if(!report||typeof report!=="object"||Array.isArray(report))fail("reporte JSON inválido");
 // Report may wrap a result. Unknown formats are blocked rather than guessed.
 const x=(report.result && typeof report.result==="object")?report.result:report;
 const risk= x.risk_score ?? x.score;
 const recommendation=x.recommendation;
 const severity=x.severity;
 const findings=x.findings;
 const incomplete=x.incomplete??x.scan_incomplete??x.coverage?.incomplete;
 if(!Number.isFinite(risk)||risk<0||risk>100)fail("risk_score ausente o inválido");
 if(!["SAFE","CAUTION","DO_NOT_INSTALL"].includes(recommendation))fail("recommendation no reconocida");
 if(!["LOW","MEDIUM","HIGH","CRITICAL"].includes(severity))fail("severity ausente/no reconocida");
 if(!Array.isArray(findings))fail("findings ausentes");
 if(incomplete!==false)fail("cobertura de análisis incompleta o desconocida; no instalar");
 const containsHigh=findings.some(f=>["HIGH","CRITICAL"].includes(String(f.severity||"").toUpperCase()));
 if(risk>20||recommendation!=="SAFE"||severity!=="LOW"||containsHigh)fail("riesgo no permitido; revisión humana requerida");
 if(!acknowledge)fail("falta confirmación expresa de revisión humana --ack-review");
 return {status:"REVIEW_PASSED_NOT_INSTALLED",source,revision,risk,findings:findings.length};
}
const cli=process.argv[1] && path.resolve(process.argv[1])===url.fileURLToPath(import.meta.url);
if(cli){
 try {
 const args=process.argv.slice(2);
 const val=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:null;};
 const reportPath=val("--report"),source=val("--source"),revision=val("--revision");
 if(!reportPath)fail("indica --report archivo.json");
 const bytes=fs.readFileSync(reportPath);
 if(bytes.length>5_000_000)fail("reporte supera 5MB");
 const digest=crypto.createHash("sha256").update(bytes).digest("hex");
 const x=evaluate({report:JSON.parse(bytes.toString("utf8")),source,revision,acknowledge:args.includes("--ack-review")});
 console.log(JSON.stringify({...x,report_sha256:digest},null,2));
 console.log("Solo aprobada la revisión: ninguna dependencia fue instalada.");
 }catch(e){console.error("BLOCKED:",e.message);process.exitCode=1}
}
