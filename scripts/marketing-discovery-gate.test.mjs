import test from 'node:test';
import assert from 'node:assert/strict';
import {validate} from './marketing-discovery-gate.mjs';
const base=()=>({
 schema_version:1,client:'el-tilichero',campaign:'earbuds-reel',output_type:'ad',
 business_goal:'Crear consultas a WhatsApp por el producto',audience:'Compradores de accesorios móviles en Costa Rica',product_truth:'Auriculares inalámbricos de modelo aún por verificar',
 research_questions:['¿Cómo muestran el producto anuncios públicos reales?','¿Cuándo mejora la comprensión usar animación?'],
 evidence:[
 {id:'clip01',kind:'client_provided',source:'01_CRUDOS/clip-original.mov',observation:'Caja de producto visible en toma con movimiento lateral',observed_at:'2026-10-30 11:00 CR',verification:'DIRECT'},
 {id:'ref01',kind:'watched_video',source:'https://example.org/public-video',observation:'Plano largo de apertura de estuche con audio directo',observed_at:'2026-10-30 11:01 CR',verification:'DIRECT'}
 ],
 alternatives:[
 {id:'natural',technique:'Montaje documental con sonido real',reason:'Resaltar el gesto real de apertura grabado',expected_customer_effect:'Comprender el uso del estuche sin distracción',failure_mode:'Poca acción visual si el plano es demasiado estático',evidence_ids:['clip01']},
 {id:'motion',technique:'Etiquetas animadas junto al producto real',reason:'Ayudar a identificar elementos pequeños durante la apertura',expected_customer_effect:'Facilitar comprensión del producto en móvil',failure_mode:'Texto puede saturar el encuadre y tapar el producto',evidence_ids:['clip01','ref01']}
 ],
 decision:{selected_id:'natural',why:'El material presenta gesto natural claro y suficiente',validation_plan:'Publicar dos versiones autorizadas y medir consultas reales'},
 confidence:'MEDIUM',constraints:['No atribuir marca Apple sin autenticidad','Usar música autorizada'],
 limitations:'No conocemos métricas de ventas ni datos previos de esta categoría'
});
test('reporte completo permite pasar a propuesta, nunca prueba ventas',()=>{let x=validate(base());assert.equal(x.status,'PASS');assert.match(x.notice,/NO efecto/)});
test('inexistencia de observación directa bloquea',()=>{let p=base();p.evidence.forEach(x=>x.verification='SECONDARY');assert.equal(validate(p).status,'BLOCKED')});
test('no vistos no son vistos',()=>{let p=base();p.evidence[1].kind='inaccessible';assert.equal(validate(p).status,'BLOCKED')});
test('faltan alternativas, bloquea receta por defecto',()=>{let p=base();p.alternatives.pop();assert.equal(validate(p).status,'BLOCKED')});
test('una sola fuente exige revisión, no paso silencioso',()=>{let p=base();p.evidence.pop();p.alternatives[1].evidence_ids=['clip01'];assert.equal(validate(p).status,'NEEDS_REVIEW')});
test('métrica inventada sin prueba bloquea',()=>{let p=base();p.evidence[0].metric_claim='ROAS 100x';assert.equal(validate(p).status,'BLOCKED')});
test('no decidir basándose en fuente inaccesible',()=>{let p=base();p.evidence[1].verification='UNAVAILABLE';p.evidence[1].kind='inaccessible';assert.equal(validate(p).status,'BLOCKED')});
test('confianza LOW pide revisión',()=>{let p=base();p.confidence='LOW';assert.equal(validate(p).status,'NEEDS_REVIEW')});
test('formato malformado no pasa',()=>assert.equal(validate(null).status,'BLOCKED'));
