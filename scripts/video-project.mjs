#!/usr/bin/env node
// Estructura local privada de trabajo audiovisual. Sin dependencias externas.
import {mkdir,readdir,lstat,readFile,writeFile} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join,relative,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
const PROJECT_ROOT=resolve(fileURLToPath(new URL('../',import.meta.url)),'media-workspaces');
export const FOLDERS=['01_CRUDOS','02_REFERENCIAS','03_RESULTADOS','04_EDITABLES','05_QA'];
export function slug(value){
 if(typeof value!=='string'||!/^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(value))throw Error('Slug inválido. Usar letras minúsculas, números y guiones (1-48), sin espacios ni rutas.');
 return value;
}
export function location(base,client,campaign){return resolve(base,slug(client),slug(campaign))}
async function writeNew(file,body){try{await writeFile(file,body,{flag:'wx',encoding:'utf8'})}catch(e){if(e.code!=='EEXIST')throw e}}
const brief=(client,campaign)=>`# Brief audiovisual — ${client} / ${campaign}

Estado: DRAFT (sin validación).
Marca: ${client}
Campaña: ${campaign}
Producto, modelo y autenticidad: PENDIENTE
Objetivo y audiencia: PENDIENTE
Destino y CTA: PENDIENTE
Precio, existencia y afirmaciones verificadas: PENDIENTE
Logo, colores y fuentes autorizados: PENDIENTE
Personas participantes y permisos: PENDIENTE
Música, sonidos y licencias: PENDIENTE

Entregables: montaje humor (si hay escenas), montaje premium, originales inmutables, proyecto editable, MP4 verificados y QA.
No publicar sin aprobación ni atribuir prestaciones al producto sin pruebas.
`;
export async function initCampaign(base,client,campaign){
 const root=location(base,client,campaign);
 for(const dir of FOLDERS)await mkdir(join(root,dir),{recursive:true});
 await writeNew(join(root,'00_BRIEF.md'),brief(client,campaign));
 await writeNew(join(root,'02_REFERENCIAS','REFERENCIAS.md'),`# Referencias audiovisuales

Registrar por cada ejemplo: URL, autor, licencia/permiso, fecha, qué recurso de montaje inspira y cómo producir una solución original.
No copiar ni descargar anuncios de terceros sin derechos.
`);
 await writeNew(join(root,'04_EDITABLES','README.md'),`# Fuentes editables

Guardar aquí proyecto Remotion, scripts de FFmpeg, cortes/timeline, recursos autorizados, decisiones de edición y manifiesto de dependencias.
Se permite editar estos archivos; nunca modificar 01_CRUDOS.
`);
 await writeNew(join(root,'05_QA','REVISION.md'),`# QA de entregas

Estado inicial: NOT_RUN.
Por cada resultado anotar: ruta MP4, ffprobe/resolución/fps/audio, revisión de cuadros, subtítulos, derechos, mensajes comerciales, dispositivos y revisión humana.
No declarar SUCCESS sin MP4 y visionado final.
`);
 return root;
}
export async function campaignStatus(base,client,campaign){
 const root=location(base,client,campaign);
 let ready=true;const folders={};
 for(const f of FOLDERS){try{const stat=await lstat(join(root,f));folders[f]=stat.isDirectory()&&!stat.isSymbolicLink();}catch{folders[f]=false}if(!folders[f])ready=false;}
 return {root,ready,folders};
}
async function hashFile(file){const h=createHash('sha256');for await(const chunk of createReadStream(file))h.update(chunk);return h.digest('hex')}
export async function inventoryCampaign(base,client,campaign){
 const root=location(base,client,campaign), status=await campaignStatus(base,client,campaign);
 if(!status.ready)throw Error('Campaña incompleta: ejecutar init primero');
 const dir=join(root,'01_CRUDOS'), entries=await readdir(dir,{withFileTypes:true});
 const allowed=/\.(mov|mp4|m4v|mkv|avi|wav|mp3|m4a|aiff|webm)$/i,files=[],ignored=[];
 for(const item of entries.sort((a,b)=>a.name.localeCompare(b.name))){
 if(!item.isFile()){if(item.isSymbolicLink())throw Error('Se detectó enlace simbólico en crudos: '+item.name);ignored.push(item.name);continue;}
 if(!allowed.test(item.name)){ignored.push(item.name);continue;}
 const file=join(dir,item.name),stat=await lstat(file);
 if(stat.isSymbolicLink()||!stat.isFile())throw Error('Ruta no válida en crudos: '+item.name);
 files.push({file:item.name,bytes:stat.size,sha256:await hashFile(file)});
 }
 const report={schema_version:1,client,campaign,generated_at:new Date().toISOString(),status:'INVENTARIED_NOT_EDITED',files,ignored,notes:'Solo inventario/hashes. Aún requiere inspección ffprobe y revisión visual.'};
 const output=join(root,'05_QA','asset-inventory.json');
 await writeFile(output,JSON.stringify(report,null,2)+'\n','utf8');
 return {report,output};
}
const main=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(main){
 try {
 const [action,...args]=process.argv.slice(2);const opt=(name)=>{const i=args.indexOf(name);return i===-1?null:args[i+1]};
 const client=opt('--client'),campaign=opt('--campaign');
 if(!client||!campaign)throw Error('Uso: npm run video:project -- init|inventory|status --client el-tilichero --campaign earbuds');
 if(action==='init'){const root=await initCampaign(PROJECT_ROOT,client,campaign);console.log('Campaña lista (contenido privado excluido de Git): '+relative(resolve(PROJECT_ROOT,'..'),root));}
 else if(action==='inventory'){const {report,output}=await inventoryCampaign(PROJECT_ROOT,client,campaign);console.log('Inventariados: '+report.files.length+'; informe: '+output)}
 else if(action==='status'){const x=await campaignStatus(PROJECT_ROOT,client,campaign);console.log(JSON.stringify(x,null,2));if(!x.ready)process.exitCode=1}
 else throw Error('Acción desconocida: '+action);
 }catch(e){console.error('ERROR:',e.message);process.exitCode=1}
}
