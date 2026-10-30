// Create a REVIEW-ONLY skill proposal. Never modifies skills/, mirrors or installed tools.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
import {loadSkills,loadAgents} from './skill-catalog.mjs';
import {planTask,normalize} from './intent-router-core.mjs';
export function skillSlug(text) {
 const slug=normalize(text).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50).replace(/-+$/,'');
 if(!slug || !/^[a-z][a-z0-9-]*$/.test(slug)) throw Error('No se puede derivar un nombre seguro');
 return slug;
}
export function draftMarkdown(name,task,route){
 if(!/^[a-z][a-z0-9-]{2,63}$/.test(name)) throw Error('Nombre de skill inválido');
 return [
  '---','name: '+name,
  'description: '+JSON.stringify('BORRADOR NO INSTALADO: procedimiento por validar para '+name),
  '---','','# Propuesta: '+name,'',
  '**Estado: DRAFT / NOT_RUN. No es una skill activa.** Revisar con skills/aem-skill-factory/SKILL.md antes de promover.','',
  '## Encargo origen',JSON.stringify(task.trim()),'',
  '## Diagnóstico y criterio de creación',
  '- Ruta detectada: '+route.intent,
  '- Skills reutilizables consideradas: '+(route.skill_selection.map(s=>s.name).join(', ')||'ninguna'),
  '- Decisión inicial: '+route.capability_decision,
  '- Comparar con procedimientos existentes antes de crear una duplicación.',
  '- Evidencia de brecha funcional: PENDIENTE.','',
  '## Contrato de capacidad (completar con investigación real)',
  '- Problema repetible y cliente objetivo: PENDIENTE.',
  '- Entradas necesarias, datos y permisos: PENDIENTE.',
  '- Procedimiento verificable paso a paso: PENDIENTE.',
  '- Salidas, errores, fallbacks y criterios de aceptación: PENDIENTE.',
  '- Beneficio empresarial y baseline: UNKNOWN; medir, no inventar.',
  '- Derechos, seguridad y licencias externas: PENDIENTE.',
  '- Evaluación: al menos 2 casos reales y 1 caso límite; NOT_RUN.','',
  '## Siguiente paso',
  'Delegar investigación y revisión de solapamientos a altiora-research o rol competente.',
  'Si conviene crear: completar contrato, tests, ejemplos y evidencias; revisión humana; mover a skills/'+name+'/SKILL.md solo por PR aprobada, ejecutar npm run agents:build y npm run check.',
  'No importar ni ejecutar código de terceros sin gate de seguridad.',''
 ].join('\n');
}
async function main(){
 const root=fileURLToPath(new URL('../',import.meta.url));
 const task=process.argv.slice(2).join(' ').trim();
 if(!task) throw Error('Uso: npm run capability:draft -- "capacidad repetible no cubierta"');
 const [skills,agents,web,video]=await Promise.all([
  loadSkills(root),loadAgents(root),
  readFile(resolve(root,'references/repositories.json'),'utf8').then(JSON.parse),
  readFile(resolve(root,'references/av-security-sources.json'),'utf8').then(JSON.parse)
 ]);
 const route=planTask(task,{skills,agents,external:[...web.repositories,...video.repositories]});
 if(route.capability_decision==='REUSE') {
  console.log(JSON.stringify({status:'REUSE_FIRST',selected:route.skill_selection.map(s=>s.name),message:'Primero demostrar brecha concreta. Ninguna skill fue creada.'},null,2));
  return;
 }
 const name=skillSlug(task);
 if(skills.some(s=>s.name===name)) throw Error('Ya existe la skill '+name);
 const dir=resolve(root,'proposals/capabilities',name);
 await mkdir(dir,{recursive:true});
 const path=join(dir,'SKILL.md');
 await writeFile(path,draftMarkdown(name,task,route),{flag:'wx'});
 console.log(JSON.stringify({status:'DRAFT_NOT_INSTALLED',path:'proposals/capabilities/'+name+'/SKILL.md',review_required:true},null,2));
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) main().catch(e=>{console.error(e.message);process.exitCode=1});
