import test from "node:test";
import assert from "node:assert/strict";
import {validateArgs,renderArguments,detectAerender,isWithin,aerenderCandidates} from "./after-effects-bridge.mjs";
import {resolve} from "node:path";
const root="/tmp/altiora-safe";

test("aerender plan validates project, composition, and output path",()=>{
 const v=validateArgs("approved/product.aep","Shot 1 — PRODUCT","out/approved.mov",root);
 assert.equal(v.project,resolve(root,"approved/product.aep"));
 assert.deepEqual(renderArguments(v),["-project",v.project,"-comp","Shot 1 — PRODUCT","-output",v.output]);
});
test("blocks traversal, external files, bad extensions and line injection",()=>{
 for(const fields of [
  ["../secret.aep","Shot","out/a.mov"],
  ["approved/p.aep","Shot","../../outside.mov"],
  ["approved/p.jsx","Shot","out/a.mov"],
  ["approved/p.aep","-help","out/a.mov"],
  ["approved/p.aep","Shot","out/a:stream.mov"],
  ["approved/p.aep","Shot\u0000hidden","out/a.mov"],
  ["approved/p.aep","Shot\nanother","out/a.mov"],
  ["approved/p.aep","Shot","out/a.sh"]
 ]) assert.throws(()=>validateArgs(...fields,root));
 assert.equal(isWithin(root,resolve(root,"../outside")),false);
});
test("probe missing executable does not fabricate access",()=>{
 const stub=()=>({status:null,error:{code:"ENOENT"}});
 const x=detectAerender(stub,"aerender");
 assert.equal(x.available,false);
 assert.equal(x.diagnostic,"ENOENT");
});
test("successful help probe is not certified project render",()=>{
 const stub=()=>({status:0,stdout:"aerender - Adobe After Effects render engine",stderr:""});
 const x=detectAerender(stub,"aerender");
 assert.equal(x.available,true);
 assert.match(x.note,/Local aerender detected/);
});

test("Windows discovery prioritizes explicit trusted owner path",()=>{
 const v=aerenderCandidates({ALTIORA_AERENDER:"D:\\Adobe\\aerender.exe",ProgramFiles:"C:\\Program Files"},"win32");
 assert.equal(v[0],"D:\\Adobe\\aerender.exe");
 assert.ok(v.includes("aerender.exe"));
});
test("macOS fallback is available without installed After Effects",()=>{
 const v=aerenderCandidates({},"darwin");
 assert.ok(v.includes("aerender"));
});
