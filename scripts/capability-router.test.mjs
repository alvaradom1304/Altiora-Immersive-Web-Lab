import test from 'node:test';
import assert from 'node:assert/strict';
import {makePlan,chooseRoute,normalize} from './capability-router.mjs';
const skills=[
'ai-video-direction','motion-design','creative-quality-assurance',
'altiora-repository-research','dependency-security','altiora-quality-review',
'advertising-concept','creative-deconstruction-originality',
'elite-web-experience-os','immersive-web-design','web-performance',
'product-winner-scorecard','whatsapp-lead-to-sale','growth-experiment-analysis',
'writing-plans','systematic-debugging','verification-before-completion'];
const agents=['creative-ads-director','motion-designer','visual-producer','qa-reviewer',
'altiora-engineering','altiora-research','altiora-review','market-intelligence-director',
'experience-director','creative-director','web-engineer','commerce-growth-director',
'business-strategist','growth-analyst'];
test('Spanish normalization and deterministic high-priority video route',()=>{
 assert.equal(normalize('  POSTPRODUCCIÓN  '),'postproduccion');
 assert.equal(chooseRoute('Editá mis videos de earbuds: uní clips, agregá motion graphics').id,'video-postproduction');
});
test('video picks registered lead and only 3 existing skills',()=>{
 const p=makePlan('Editá el video y exportá MP4',skills,agents);
 assert.equal(p.status,'REUSE');
 assert.equal(p.lead,'creative-ads-director');
 assert.deepEqual(p.skills,['ai-video-direction','motion-design','creative-quality-assurance']);
 assert.equal(p.actual_executions,0);
 assert.ok(p.source_candidates.every(x=>!x.installed && !x.verified_for_this_task));
});
test('external repository research triggers security and never auto-installs',()=>{
 const p=makePlan('Busca en GitHub repositorios y verifica skills maliciosas',skills,agents);
 assert.equal(p.intent,'external-repository-security');
 assert.ok(p.skills.includes('dependency-security'));
 assert.match(p.controls.join(' '),/security gate/);
});
test('immersive web delegates to existing specialists',()=>{
 const p=makePlan('Crear una página web con scrollytelling',skills,agents);
 assert.equal(p.intent,'immersive-web');
 assert.equal(p.reviewer,'qa-reviewer');
});
test('unrecognized need produces reviewable gap, not an invented agent',()=>{
 const p=makePlan('Clasificar espectros de cristales microscópicos',skills,agents);
 assert.equal(p.status,'CAPABILITY_GAP');
 assert.equal(p.lead,null);
 assert.equal(p.proposal,'RESEARCH_THEN_SKILL_FACTORY');
});
test('missing registered role/skill never falsely reported as available',()=>{
 const p=makePlan('Editá un video',[],[]);
 assert.equal(p.status,'NEEDS_REVIEW');
 assert.equal(p.lead,null);
 assert.deepEqual(p.skills,[]);
 assert.ok(p.missing_catalog_entries.length>0);
});
test('empty task rejected',()=>assert.throws(()=>chooseRoute('   '),/vacía/));
