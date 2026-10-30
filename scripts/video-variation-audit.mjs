#!/usr/bin/env node
// Control offline de diversidad declarada; NO interpreta medios ni modifica archivos.
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const AXES=Object.freeze(['hook','narrative','pacing','camera','motion','sound','typography','ending']);
const fields=['footage_fit','brand_fit','feasibility','clarity'];
const goodText=s=>typeof s==='string'&&s.trim().length>=8;
const goodId=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{1,79}$/i.test(s);
const goodFile=s=>typeof s==='string'&&s.trim().length>0&&s.length<=255&&!s.includes('\\0');
const norm=s=>typeof s==='string'?s.trim().toLocaleLowerCase('es').replace(/\s+/g,' '):'';
export function distance(a,b){
 return AXES.reduce((n,axis)=>n+(norm(a?.[axis])!==norm(b?.[axis])?1:0),0);
}
export function audit(proposal,history={executions:[]}){
 const errors=[],reviews=[],notes=[];
 if(!proposal||typeof proposal!=='object'||Array.isArray(proposal))return {status:'FAIL',errors:['Propuesta JSON inválida'],reviews,notes};
 if(proposal.schema_version!==1)errors.push('schema_version debe ser 1');
 if(!goodId(proposal.client)||!goodId(proposal.campaign))errors.push('client y campaign deben ser identificadores seguros (2–80 caracteres)');
 if(proposal.footage_reviewed!==true)errors.push('Falta visionado real de los clips; ffprobe no sustituye verlo');
 if(!goodText(proposal.objective))errors.push('Definir objetivo de comunicación verificable');
 if(!Array.isArray(proposal.brand_invariants)||proposal.brand_invariants.length===0)errors.push('Faltan invariantes de marca');
 const evidence=Array.isArray(proposal.evidence)?proposal.evidence:[];
 if(evidence.length===0)errors.push('Registrar evidencia real de metraje y timecodes');
 const evidenceIds=new Set();
 for(const x of evidence){
  if(!goodId(x?.id)||!goodFile(x?.file)||!goodText(x?.observation)||
     !Number.isFinite(x?.in_seconds)||!Number.isFinite(x?.out_seconds)||
     x.in_seconds<0||x.out_seconds<=x.in_seconds)errors.push('Evidencia de metraje incompleta: id, archivo, observación, in/out segundos');
  if(evidenceIds.has(x?.id))errors.push('ID de evidencia duplicado: '+String(x?.id));
  evidenceIds.add(x?.id);
 }
 const candidates=Array.isArray(proposal.candidates)?proposal.candidates:[];
 if(candidates.length<3)errors.push('Se requieren tres conceptos realmente diferentes antes de elegir');
 if(candidates.length>8)errors.push('Máximo ocho conceptos por auditoría');
 const byId=new Map();
 for(const c of candidates){
  if(!goodId(c?.id)||byId.has(c?.id))errors.push('ID de concepto inválido o duplicado');
  if(typeof c?.id==='string')byId.set(c.id,c);
  if(!goodText(c?.concept)||!goodText(c?.why_this))errors.push('Concepto o justificación demasiado genéricos: '+String(c?.id));
  if(!Array.isArray(c?.footage_ids)||!c.footage_ids.length||c.footage_ids.some(id=>!evidenceIds.has(id)))errors.push('Cada concepto debe citar evidencia de metraje: '+String(c?.id));
  for(const axis of AXES)if(!goodText(c?.grammar?.[axis]))errors.push('Falta descripción específica de '+axis+' en '+String(c?.id));
  for(const f of fields)if(!Number.isFinite(c?.scores?.[f])||c.scores[f]<0||c.scores[f]>5)errors.push('Puntuación 0–5 inválida: '+f+' en '+String(c?.id));
 }
 for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++){
  const a=candidates[i],b=candidates[j],d=distance(a?.grammar,b?.grammar);
  if(d<4)errors.push('Conceptos demasiado parecidos: '+String(a?.id)+' / '+String(b?.id)+' ('+d+'/8 diferencias; mínimo 4)');
 }
 const selected=byId.get(proposal.selected_id);
 if(!selected)errors.push('selected_id debe señalar un concepto existente');
 let score=null;
 if(selected&&fields.every(f=>Number.isFinite(selected.scores?.[f]))){
  score=Math.round((selected.scores.footage_fit*.40+selected.scores.brand_fit*.25+selected.scores.feasibility*.20+selected.scores.clarity*.15)*100)/100;
  if(score<3.5)reviews.push('Selección con ajuste comercial/artístico bajo: '+score+'/5; revisar antes de render');
 }
 if(!history||typeof history!=='object'||!Array.isArray(history.executions))errors.push('Historial inválido: se esperaba executions[]');
 else if(selected){
  const last=history.executions.filter(h=>h?.client===proposal.client&&h?.approved===true).slice(-5);
  for(const h of last){
   if(!AXES.every(x=>goodText(h?.fingerprint?.[x]))){reviews.push('Campaña anterior sin huella completa: '+String(h?.campaign));continue;}
   const d=distance(selected.grammar,h.fingerprint);
   if(d<3){
    const msg='Se parece a '+String(h.campaign)+' ('+d+'/8 cambios; mínimo 3)';
    if(goodText(proposal.override_reason)&&proposal.override_reason.length>=30)reviews.push(msg+'; excepción exige aprobación editorial');
    else errors.push(msg+'; rediseñar o documentar excepción de continuidad');
   }
  }
  if(last.length===0)notes.push('Sin campañas anteriores aprobadas para este cliente');
 }
 return {status:errors.length?'FAIL':reviews.length?'NEEDS_REVIEW':'PASS',client:proposal.client,campaign:proposal.campaign,selected_id:proposal.selected_id,weighted_fit:score,errors,reviews,notes,dimensions:AXES};
}
async function cli(args){
 const opt=name=>{const i=args.indexOf(name);return i<0?null:args[i+1]};
 const proposalPath=opt('--proposal'),historyPath=opt('--history');
 if(!proposalPath)throw Error('Uso: npm run video:variation -- --proposal <creative-proposal.json> [--history <_creative-history.json>]');
 const proposal=JSON.parse(await readFile(resolve(proposalPath),'utf8'));
 let history={executions:[]};
 if(historyPath){try{history=JSON.parse(await readFile(resolve(historyPath),'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;}}
 const result=audit(proposal,history);
 process.stdout.write(JSON.stringify(result,null,2)+'\n');
 if(result.status!=='PASS')process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 cli(process.argv.slice(2)).catch(e=>{console.error('FAIL:',e.message);process.exitCode=1;});
}
