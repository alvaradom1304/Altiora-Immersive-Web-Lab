import test from 'node:test';
import assert from 'node:assert/strict';
import {skillSlug,draftMarkdown} from './capability-draft.mjs';
test('normaliza slug de forma segura y portable',()=>{
 assert.equal(skillSlug('Edición Automática para Podcast!'),'edicion-automatica-para-podcast');
 assert.throws(()=>skillSlug('../../')); 
});
test('borrador no se anuncia como instalado o probado',()=>{
 const x=draftMarkdown('prueba-capacidad','Proceso de muestra',{intent:'research',skill_selection:[],capability_decision:'RESEARCH_AND_SCOPE'});
 assert.match(x,/DRAFT \/ NOT_RUN/);
 assert.match(x,/PENDIENTE/);
 assert.match(x,/PR aprobada/);
});
test('rechaza nombres de archivo maliciosos',()=>{
 assert.throws(()=>draftMarkdown('../../evil','x',{intent:'ops',skill_selection:[],capability_decision:'RESEARCH_AND_SCOPE'}));
});
