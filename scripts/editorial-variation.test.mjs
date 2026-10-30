import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,writeFile,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {ROUTES,difference,checkVariation,generate,validateBrief,recordApproved,run} from "./editorial-variation.mjs";
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

test("historial se actualiza solo tras MP4 existente y QA humano",async()=>{
 const d=await mkdtemp(join(tmpdir(),"altiora-variation-record-"));
 try {
  const renderPath=join(d,"final.mp4"),qaPath=join(d,"qa.json"),historyPath=join(d,"history.json");
  const proposal={brand:"El Tilichero",campaign:"earbuds",route:"human-comedy",style:ROUTES[0].style};
  await writeFile(renderPath,Buffer.alloc(4096,1));
  await writeFile(qaPath,JSON.stringify({status:"APPROVED",human_reviewed:true,visual_reviewed:true,technical_qa_passed:true}));
  const result=await recordApproved({proposal,historyPath,renderPath,qaPath});
  assert.equal(result.entries,1);
  assert.equal(JSON.parse(await readFile(historyPath,"utf8"))[0].route,"human-comedy");
  await assert.rejects(()=>recordApproved({proposal,historyPath,renderPath,qaPath}),/parecido|registrado/);
 }finally{await rm(d,{recursive:true,force:true})}
});
test("no registra sin QA ni render suficiente",async()=>{
 const d=await mkdtemp(join(tmpdir(),"altiora-variation-qa-"));
 try{
  const renderPath=join(d,"final.mp4"),qaPath=join(d,"qa.json"),historyPath=join(d,"history.json");
  await writeFile(renderPath,Buffer.from("x"));
  await writeFile(qaPath,JSON.stringify({status:"DRAFT"}));
  await assert.rejects(()=>recordApproved({proposal:{style:ROUTES[0].style},historyPath,renderPath,qaPath}),/pequeño/);
  await writeFile(renderPath,Buffer.alloc(4096,1));
  await assert.rejects(()=>recordApproved({proposal:{style:ROUTES[0].style},historyPath,renderPath,qaPath}),/QA incompleto/);
 }finally{await rm(d,{recursive:true,force:true})}
});
