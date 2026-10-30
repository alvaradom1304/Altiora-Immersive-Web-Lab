import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {initCampaign,inventoryCampaign,campaignStatus,slug,FOLDERS} from './video-project.mjs';
async function fixture(fn){const dir=await mkdtemp(join(tmpdir(),'altiora-video-test-'));try{return await fn(dir)}finally{await rm(dir,{recursive:true,force:true})}}
test('crea cinco carpetas separadas e instrucciones sin medios de prueba',()=>fixture(async base=>{
 const root=await initCampaign(base,'el-tilichero','earbuds');
 assert.equal((await campaignStatus(base,'el-tilichero','earbuds')).ready,true);
 for(const name of FOLDERS)assert.ok((await readdir(root)).includes(name));
 assert.match(await readFile(join(root,'02_REFERENCIAS','REFERENCIAS.md'),'utf8'),/URL/);
 assert.deepEqual(await readdir(join(root,'01_CRUDOS')),[]);
 assert.deepEqual(await readdir(join(root,'03_RESULTADOS')),[]);
}));
test('idempotencia: init no reemplaza un brief de cliente',()=>fixture(async base=>{
 const root=await initCampaign(base,'cliente','campana');await writeFile(join(root,'00_BRIEF.md'),'MI BRIEF','utf8');
 await initCampaign(base,'cliente','campana');assert.equal(await readFile(join(root,'00_BRIEF.md'),'utf8'),'MI BRIEF');
}));
test('inventario SHA256 de crudos reales, conserva originales y no afirma edición',()=>fixture(async base=>{
 const root=await initCampaign(base,'cliente','producto');const bytes=Buffer.from('clip de prueba no es vídeo final');
 const path=join(root,'01_CRUDOS','clip.MOV');await writeFile(path,bytes);await writeFile(join(root,'01_CRUDOS','nota.txt'),'not a clip');
 const {report}=await inventoryCampaign(base,'cliente','producto');
 assert.equal(report.status,'INVENTARIED_NOT_EDITED');assert.equal(report.files.length,1);
 assert.equal(report.files[0].sha256,createHash('sha256').update(bytes).digest('hex'));
 assert.deepEqual(await readFile(path),bytes);assert.ok(report.ignored.includes('nota.txt'));
}));
test('rechaza traversal y slugs inseguros',()=>{
 for(const v of ['../private','a/b','Cliente X','-cliente','cliente-','', '.git']) assert.throws(()=>slug(v),/Slug inválido/);
});
test('status de campaña inexistente es false; inventario no inventa videos',()=>fixture(async base=>{
 assert.equal((await campaignStatus(base,'cliente','nueva')).ready,false);
 await assert.rejects(()=>inventoryCampaign(base,'cliente','nueva'),/init primero/);
}));
