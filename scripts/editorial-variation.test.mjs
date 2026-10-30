import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,writeFile,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {ROUTES,difference,checkVariation,generate,validateBrief,run} from "./editorial-variation.mjs";
const brief={brand:"El Tilichero",product:"earbuds",goal:"attention",emotion:"playful",product_claims_verified:[],verified_footage_tags:["dialogue","reaction","macro","detail","foley","lifestyle","action"]};
test("tres tratamientos de familias narrativas distintas si el material lo respalda",()=>{
 const r=generate(brief);assert.equal(r.status,"READY_FOR_CREATIVE_REVIEW");assert.equal(r.treatments.length,3);
 assert.equal(new Set(r.treatments.map(t=>t.style.story)).size,3);assert.equal(r.history_loaded,false);
});
test("una simple modificación de color, música o texto no pasa el gate",()=>{
 const s=ROUTES[0].style; const altered={...s,sound:"music-new",typography:"capsule"};
 assert.equal(difference(s,altered).distinct,false);
 assert.equal(checkVariation({style:altered},[{style:s}]).status,"TOO_SIMILAR");
});
test("rutas radicalmente distintas superan el gate de estructura",()=>{
 assert.equal(checkVariation({style:ROUTES[1].style},[{style:ROUTES[0].style}]).status,"DISTINCT");
});
test("historial bloquea repetir la misma idea para el siguiente anuncio",()=>{
 const r=generate(brief,[{style:ROUTES[0].style}]);
 assert.ok(!r.treatments.some(x=>x.route==="human-comedy"));assert.ok(r.blocked_routes.includes("human-comedy"));
});
test("sin tomas verificadas no inventa tratamientos ni finge edición",()=>{
 const r=generate({...brief,verified_footage_tags:[]});assert.equal(r.status,"NEEDS_REVIEW");assert.equal(r.treatments.length,0);
});
test("rechaza claims omitidos o producto ausente",()=>{
 assert.throws(()=>validateBrief({...brief,product_claims_verified:undefined}),/product_claims_verified/);
 assert.throws(()=>validateBrief({...brief,brand:""}),/marca/);
});
test("CLI genera archivo solo una vez y no pisa plan aprobado",async()=>{
 const d=await mkdtemp(join(tmpdir(),"altiora-variation-"));try{
  const input=join(d,"brief.json"),output=join(d,"plan.json");
  await writeFile(input,JSON.stringify(brief));
  await run(["plan","--brief",input,"--output",output]);
  assert.equal(JSON.parse(await readFile(output,"utf8")).treatments.length,3);
  await assert.rejects(()=>run(["plan","--brief",input,"--output",output]),{code:"EEXIST"});
 }finally{await rm(d,{recursive:true,force:true})}
});
