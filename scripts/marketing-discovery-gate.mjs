#!/usr/bin/env node
// Altiora Discovery Preproduction Gate. Audita el MANIFIESTO de investigación, no las piezas audiovisuales.
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const ID=/^[a-z0-9][a-z0-9_-]{1,79}$/i;
const txt=x=>typeof x==='string'&&x.trim().length>=12;
const UNIQUE=a=>new Set(a).size===a.length;
export function validate(report){
 const errors=[],reviews=[],notes=[];
 if(!report||typeof report!=='object'||Array.isArray(report))return {status:'BLOCKED',errors:['El reporte debe ser JSON objeto'],reviews,notes};
 if(report.schema_version!==1)errors.push('schema_version debe ser 1');
 if(!ID.test(report.client||'')||!ID.test(report.campaign||''))errors.push('client/campaign deben ser slugs válidos');
 if(!['ad','video','marketing_visual','campaign'].includes(report.output_type))errors.push('output_type inválido');
 if(!txt(report.business_goal)||!txt(report.audience)||!txt(report.product_truth))errors.push('Falta objetivo, audiencia o realidad verificable del producto');
 if(!Array.isArray(report.research_questions)||report.research_questions.length<2||report.research_questions.some(x=>!txt(x)))errors.push('Registrar >=2 preguntas concretas de Discovery');
 const evidence=Array.isArray(report.evidence)?report.evidence:[];
 if(evidence.length<2)reviews.push('Menos de dos fuentes relevantes; ampliar investigación o documentar limitaciones');
 const byId=new Map();
 for(const e of evidence){
  if(!ID.test(e?.id||'')||byId.has(e?.id))errors.push('IDs de evidencia inválidos o repetidos');
  if(typeof e?.id==='string')byId.set(e.id,e);
  if(!['watched_video','viewed_frame','read_webpage','client_provided','observed_product','measured_test','inaccessible'].includes(e?.kind))errors.push('Categoría no válida en evidencia '+e?.id);
  if(!txt(e?.source)||!txt(e?.observation)||!txt(e?.observed_at))errors.push('Falta fuente, observación concreta o fecha en '+e?.id);
  if(!['DIRECT','SECONDARY','UNAVAILABLE'].includes(e?.verification))errors.push('Verificación no clasificada en '+e?.id);
  if(e?.kind==='inaccessible'&&e.verification!=='UNAVAILABLE')errors.push('Fuente inaccesible no puede marcarse verificada: '+e?.id);
  if(e?.verification==='DIRECT'&&e?.kind==='inaccessible')errors.push('No observada: '+e?.id);
  if(e?.metric_claim&&!txt(e.metric_source))errors.push('Métrica sin fuente verificable: '+e?.id);
 }
 if(!UNIQUE(evidence.map(e=>e?.id)))errors.push('Evidencia duplicada');
 const direct=evidence.filter(e=>e.verification==='DIRECT'&&e.kind!=='inaccessible');
 if(!direct.length)errors.push('Sin observación directa comprobable: no afirmar haber visto anuncios');
 const hasVisual=direct.some(e=>['watched_video','viewed_frame','client_provided','observed_product'].includes(e.kind));
 if(['ad','video','marketing_visual'].includes(report.output_type)&&!hasVisual)reviews.push('No hay referencia visual o material real observado; requiere revisión antes de diseño');
 const proposals=Array.isArray(report.alternatives)?report.alternatives:[];
 if(proposals.length<2)errors.push('Comparar al menos dos alternativas, incluyendo opción sin motion/transición cuando sea viable');
 const choices=new Map();
 for(const option of proposals){
  if(!ID.test(option?.id||'')||choices.has(option?.id))errors.push('ID de alternativa inválido/duplicado');
  if(typeof option?.id==='string')choices.set(option.id,option);
  if(!txt(option?.technique)||!txt(option?.reason)||!txt(option?.failure_mode)||!txt(option?.expected_customer_effect))errors.push('Alternativa sin justificación o riesgo: '+option?.id);
  if(!Array.isArray(option?.evidence_ids)||!option.evidence_ids.length||option.evidence_ids.some(id=>!byId.has(id)||byId.get(id)?.verification==='UNAVAILABLE'))errors.push('Alternativa sin evidencia disponible: '+option?.id);
 }
 if(!choices.has(report?.decision?.selected_id))errors.push('La opción seleccionada debe existir');
 if(!txt(report?.decision?.why)||!txt(report?.decision?.validation_plan))errors.push('Falta razonamiento y experimento para validar después de publicar');
 if(!['LOW','MEDIUM','HIGH'].includes(report.confidence))errors.push('Nivel de confianza ausente');
 if(report.confidence==='LOW')reviews.push('Confianza LOW: usar hipótesis exploratoria con revisión humana');
 if(!Array.isArray(report.constraints)||!report.constraints.length)errors.push('Faltan restricciones de marca, derechos o capacidades');
 if(!txt(report.limitations))errors.push('Declarar limitaciones y datos desconocidos');
 const status=errors.length?'BLOCKED':reviews.length?'NEEDS_REVIEW':'PASS';
 return {status,errors,reviews,notes,counts:{evidence:evidence.length,direct_observations:direct.length,alternatives:proposals.length},notice:'PASS verifica completitud declarada, NO efecto comercial ni comprensión automática de video'};
}
async function main(){
 const args=process.argv.slice(2),i=args.indexOf('--report');
 if(i<0||!args[i+1])throw Error('Uso: npm run marketing:discovery -- --report media-workspaces/cliente/campana/05_QA/discovery-report.json');
 const result=validate(JSON.parse(await readFile(resolve(args[i+1]),'utf8')));
 console.log(JSON.stringify(result,null,2));
 if(result.status!=='PASS')process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){main().catch(e=>{console.error('BLOCKED:',e.message);process.exitCode=1})}
