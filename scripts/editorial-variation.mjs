#!/usr/bin/env node
// Altiora Editorial Variation Engine. Creative decision-support, not a video renderer.
// No external dependencies or network. Inputs are explicitly tagged, verified human observations.
import {readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
export const DIMENSIONS=["hook","story","rhythm","sound","typography","camera","transition"];
export const ROUTES=[
 {id:"human-comedy",name:"Humor situacional",requires:["dialogue","reaction"],goals:["attention","engagement"],emotions:["funny","playful"],mechanism:"situación humana real y remate",style:{hook:"human-conflict",story:"sketch-payoff",rhythm:"pause-then-punch",sound:"dialogue-first",typography:"caption-reaction",camera:"human-closeups",transition:"hard-cut"}},
 {id:"tactile-premium",name:"Sensorial de producto",requires:["macro","detail"],goals:["perceived-value","consideration"],emotions:["premium","wonder"],mechanism:"textura, manos, sonido y revelación",style:{hook:"sensory-detail",story:"product-reveal",rhythm:"measured-build",sound:"foley-first",typography:"minimal-luxury",camera:"object-macro",transition:"match-cut"}},
 {id:"everyday-relief",name:"Uso cotidiano",requires:["lifestyle","action"],goals:["conversion","consideration"],emotions:["relief","trust"],mechanism:"fricción real y solución visible",style:{hook:"everyday-friction",story:"problem-solution",rhythm:"natural-causal",sound:"ambient-realism",typography:"utility-clarity",camera:"observational",transition:"action-continuity"}},
 {id:"sound-rhythm",name:"Diseño sonoro rítmico",requires:["foley","detail"],goals:["attention","perceived-value"],emotions:["energetic","playful"],mechanism:"montaje nacido de sonidos verificados",style:{hook:"sound-first",story:"rhythmic-product-beats",rhythm:"syncopated",sound:"percussion-foley",typography:"kinetic-minimal",camera:"detail-and-wide",transition:"on-beat"}},
 {id:"first-person-discovery",name:"Descubrimiento POV",requires:["pov","action"],goals:["engagement","consideration"],emotions:["curiosity","trust"],mechanism:"una experiencia desde ojos del comprador",style:{hook:"first-person-curiosity",story:"pov-discovery",rhythm:"continuous-movement",sound:"subjective-diegetic",typography:"thought-bubbles",camera:"pov-handheld",transition:"hidden-continuity"}},
 {id:"verified-test",name:"Demostración factual",requires:["tested-demo"],goals:["conversion","trust"],emotions:["trust","clarity"],mechanism:"mostrar evidencia real de función comprobada",style:{hook:"proof-first",story:"show-dont-tell",rhythm:"demonstration-steps",sound:"live-capture",typography:"evidence-labels",camera:"tripod-locked",transition:"functional-cuts"}},
 {id:"quiet-gallery",name:"Galería visual silenciosa",requires:["detail","macro"],goals:["perceived-value","attention"],emotions:["premium","calm"],mechanism:"composición editorial con contraste y respiración",style:{hook:"graphic-silence",story:"form-and-material",rhythm:"slow-contrast",sound:"minimal-ambience",typography:"editorial-serif",camera:"negative-space",transition:"graphic-match"}}
];
const uniq=a=>[...new Set(a)];
export function validateBrief(brief){
 if(!brief||typeof brief!=="object"||Array.isArray(brief))throw Error("brief JSON inválido");
 if(typeof brief.brand!=="string"||!brief.brand.trim())throw Error("falta marca");
 if(typeof brief.product!=="string"||!brief.product.trim())throw Error("falta producto");
 if(!["attention","engagement","consideration","conversion","perceived-value","trust"].includes(brief.goal))throw Error("goal inválido");
 if(!Array.isArray(brief.verified_footage_tags)||!brief.verified_footage_tags.every(x=>typeof x==="string"))throw Error("faltan observaciones verificadas de tomas (verified_footage_tags)");
 if(!Array.isArray(brief.product_claims_verified))throw Error("declarar product_claims_verified aunque sea []");
 return brief;
}
export function difference(a,b){
 const changed=DIMENSIONS.filter(k=>a?.[k]!==b?.[k]);
 const storyChange=changed.includes("hook")||changed.includes("story");
 return {changed,distinct:changed.length>=4&&storyChange};
}
export function checkVariation(candidate,history=[]){
 if(!candidate||typeof candidate!=="object"||!candidate.style)throw Error("propuesta sin estilo estructurado");
 if(!Array.isArray(history))throw Error("historial inválido");
 const comparisons=history.slice(-8).map((prev,i)=>{
  const old=prev?.style||prev;
  const d=difference(candidate.style,old);
  return {previous:i,changed:d.changed,distinct:d.distinct};
 });
 return {status:comparisons.every(x=>x.distinct)?"DISTINCT":"TOO_SIMILAR",comparisons,history_count:history.length,notice:"La comparación es estructural, no certifica originalidad visual ni calidad del MP4."};
}
export function generate(brief,history=[]){
 validateBrief(brief);
 if(!Array.isArray(history))throw Error("historial inválido");
 const tags=new Set(brief.verified_footage_tags),emotion=brief.emotion||"";
 const feasible=ROUTES.filter(r=>r.requires.some(t=>tags.has(t)));
 const eligible=feasible.map(r=>{
  const novelty=checkVariation({style:r.style},history);
  const blocked=novelty.status!=="DISTINCT";
  const score=(r.goals.includes(brief.goal)?4:0)+(r.emotions.includes(emotion)?3:0)+(r.requires.filter(t=>tags.has(t)).length)+(blocked?-100:0);
  return {...r,score,novelty};
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const treatments=eligible.filter(x=>x.novelty.status==="DISTINCT").slice(0,3).map(x=>({
  route:x.id,title:x.name,mechanism:x.mechanism,score:x.score,style:x.style,
  footage_support:x.requires.filter(t=>tags.has(t)),constraints:brief.restrictions||[],
  truth:"Diseñar usando SOLO las tomas observadas; no inventar diálogos, funcionalidades, tomas o ventas."
 }));
 const blocked=eligible.filter(x=>x.novelty.status!=="DISTINCT").map(x=>x.id);
 return {status:treatments.length>=3?"READY_FOR_CREATIVE_REVIEW":"NEEDS_REVIEW",brand:brief.brand,product:brief.product,
  footage_tags:uniq([...tags]),history_entries:history.length,history_loaded:history.length>0,
  treatments,blocked_routes:blocked,
  missing:treatments.length<3?["Faltan rutas con material verificado y/o el historial impide otras; proponer regrabaciones o nueva narrativa, no simular escenas."]:[],
  instruction:"Elegir una ruta por adecuación al brief; presentar las otras dos para contraste. Tras editar, comprobar la forma audiovisual real y registrar el tratamiento SOLO si el MP4 fue aprobado."};
}
function opt(args,key){const i=args.indexOf(key);return i<0?null:args[i+1]}
async function loadHistory(path){if(!path)return [];try{const v=JSON.parse(await readFile(path,"utf8"));if(!Array.isArray(v))throw Error("historial debe ser array");return v}catch(e){if(e.code==="ENOENT")return [];throw e;}}
export async function run(args){
 const [cmd]=args;const historyPath=opt(args,"--history");const history=await loadHistory(historyPath);
 if(cmd==="plan"){
  const briefPath=opt(args,"--brief"),output=opt(args,"--output");
  if(!briefPath||!output)throw Error("plan necesita --brief y --output");
  const brief=JSON.parse(await readFile(briefPath,"utf8"));
  const report=generate(brief,history);
  await writeFile(output,JSON.stringify(report,null,2)+"\n",{flag:"wx"});
  return {status:report.status,output,alternatives:report.treatments.length};
 }
 if(cmd==="check"){
  const proposalPath=opt(args,"--proposal");if(!proposalPath)throw Error("check necesita --proposal");
  const proposal=JSON.parse(await readFile(proposalPath,"utf8"));
  const report=checkVariation(proposal,history);
  if(report.status!=="DISTINCT")throw Error("RECHAZADO: similitud estructural con edición anterior: "+JSON.stringify(report.comparisons));
  return report;
 }
 throw Error("usar plan o check; no se instala ninguna dependencia ni se renderizan videos");
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 run(process.argv.slice(2)).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1});
}
