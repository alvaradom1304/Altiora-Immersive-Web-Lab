import test from "node:test";
import assert from "node:assert/strict";
import {validateArgs,renderArguments,detectAerender,isWithin} from "./after-effects-bridge.mjs";
import {resolve} from "node:path";
const root="/tmp/altiora-safe";

test("aerender plan validates project, composition, and output path",()=>{
 const v=validateArgs("approved/product.aep","Shot 1 — PRODUCT","out/approved.mov",root);
 assert.equal(v.project,"/tmp/altiora-safe/approved/product.aep");
 assert.deepEqual(renderArguments(v),["-project",v.project,"-comp","Shot 1 — PRODUCT","-output",v.output]);
});
test("blocks traversal, external files, bad extensions and line injection",()=>{
 for(const fields of [
  ["../secret.aep","Shot","out/a.mov"],
  ["approved/p.aep","Shot","../../outside.mov"],
  ["approved/p.jsx","Shot","out/a.mov"],
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
 assert.match(x.note,/Requires compatible installed licensed AE/);
});
