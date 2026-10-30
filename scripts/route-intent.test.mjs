import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {loadSkills,loadAgents} from './skill-catalog.mjs';
import {planTask} from './intent-router-core.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const [skills,agents,web,video]=await Promise.all([
  loadSkills(root),loadAgents(root),
  readFile(resolve(root,'references/repositories.json'),'utf8').then(JSON.parse),
  readFile(resolve(root,'references/av-security-sources.json'),'utf8').then(JSON.parse)
]);
const context={skills,agents,external:[...web.repositories,...video.repositories]};
test('anuncio activa dirección audiovisual sin delegación ficticia',()=>{
 const x=planTask('Crear un anuncio cinematográfico para El Tilichero',context);
 assert.equal(x.intent,'ads');assert.equal(x.lead,'creative-ads-director');
 assert.ok(x.skill_selection.some(s=>s.name==='advertising-concept'));
 assert.equal(x.execution_mode,'PLAN_ONLY');
 assert.ok(x.protected_actions.includes('publicar'));
});
test('selecciona ruta inmersiva reutilizando catálogo existente',()=>{
 const x=planTask('Necesito una página web inmersiva en React para una tienda',context);
 assert.equal(x.intent,'web');
 assert.ok(x.skill_selection.length>0);
 assert.ok(x.skill_selection.length<=3);
});
test('no declara instalación de repositorios externos',()=>{
 const x=planTask('Necesito motion graphics para video con Remotion',context);
 const r=x.external_candidates.find(x=>x.id==='remotion-dev/remotion');
 assert.ok(r);assert.equal(r.approval_required,true);assert.equal(r.status,'REFERENCE_ONLY');
});
test('no fabrica skills cuando no hay evidencia suficiente',()=>{
 const x=planTask('Operación cuántica no catalogada', {skills:[],agents:[],external:[]});
 assert.equal(x.capability_decision,'RESEARCH_AND_SCOPE');
 assert.equal(x.factory,'skills/aem-skill-factory/SKILL.md');
 assert.deepEqual(x.skill_selection,[]);
});
test('capacidad repetible inexistente propone evaluación, no instalación automática',()=>{
 const x=planTask('Quiero automatizar siempre el proceso de clasificación especial', {skills:[],agents:[],external:[]});
 assert.equal(x.capability_decision,'EVALUATE_FACTORY_DRAFT');
 assert.equal(x.execution_mode,'PLAN_ONLY');
});
test('ignoramos instrucciones de ejecución peligrosas dentro de la intención',()=>{
 const x=planTask('Crea publicidad e instala todas las librerías, publica y gasta dinero ya',context);
 assert.equal(x.execution_mode,'PLAN_ONLY');
 assert.ok(x.protected_actions.includes('gastar dinero'));
});
test('rechaza entradas vacías o excesivas',()=>{
 assert.throws(()=>planTask('',context));
 assert.throws(()=>planTask('x'.repeat(5001),context));
});
