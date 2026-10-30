#!/usr/bin/env node
// Extrae fotogramas de video local, NO comprende contenido; nunca sube material.
import {readdir,lstat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(fileURLToPath(new URL('../',import.meta.url)),'media-workspaces');
export const RATIOS=[0.1,0.5,0.9];
export function slug(x){if(typeof x!=='string'||!/^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(x))throw Error('Nombre de campaña inseguro');return x}
export function timestamps(duration){if(!Number.isFinite(duration)||duration<=0)throw Error('Duración de video inválida');return RATIOS.map(r=>Math.round(Math.max(0,Math.min(Math.max(0,duration-0.02),duration*r))*1000)/1000)}
export function mediaFiles(items){return items.filter(x=>x.isFile()&&/\.(mov|mp4|m4v|webm|mkv)$/i.test(x.name)).map(x=>x.name).sort()}
async function cmd(name,args){
 return new Promise((ok,fail)=>{
  const x=spawn(name,args,{stdio:['ignore','pipe','pipe'],shell:false});
  let out='',err='';x.stdout.on('data',v=>out+=v.toString());x.stderr.on('data',v=>err+=v.toString());
  x.on('error',fail);x.on('close',code=>code===0?ok(out):fail(Error(name+' exited '+code+' '+err.slice(-600))));
 })
}
async function main(){
 const args=process.argv.slice(2),get=x=>{const i=args.indexOf(x);return i<0?null:args[i+1]};
 const client=slug(get('--client')),campaign=slug(get('--campaign')),folder=join(ROOT,client,campaign);
 const raw=join(folder,'01_CRUDOS'),outdir=join(folder,'04_EDITABLES','discovery-frames');
 const rawStat=await lstat(raw);if(!rawStat.isDirectory()||rawStat.isSymbolicLink())throw Error('01_CRUDOS no es directorio seguro');
 const items=await readdir(raw,{withFileTypes:true});if(items.some(x=>x.isSymbolicLink()))throw Error('Revisar symlinks en 01_CRUDOS antes de procesar');
 const names=mediaFiles(items);if(!names.length)throw Error('No hay grabaciones MOV/MP4 accesibles');
 await mkdir(outdir,{recursive:true});
 const list=[];
 for(const name of names){
  const src=join(raw,name);
  const st=await lstat(src);if(!st.isFile()||st.isSymbolicLink())throw Error('Archivo inseguro: '+name);
  const probe=JSON.parse(await cmd('ffprobe',['-v','error','-show_entries','format=duration','-of','json',src]));
  const dur=Number(probe?.format?.duration);const times=timestamps(dur);
  const frames=[];
  for(let i=0;i<times.length;i++){
   const file=name.replace(/[^a-z0-9._-]/gi,'_').slice(0,70)+'-'+String(i+1).padStart(2,'0')+'.jpg';
   const target=join(outdir,file);
   await cmd('ffmpeg',['-hide_banner','-loglevel','error','-nostdin','-y','-ss',times[i].toFixed(3),'-i',src,'-frames:v','1','-vf','scale=640:-2',target]);
   frames.push({time_seconds:times[i],file});
  }
  list.push({source:name,duration_seconds:dur,frames});
 }
 const manifest={status:'FRAMES_EXTRACTED_NOT_SEMANTICALLY_ANALYZED',client,campaign,created_at:new Date().toISOString(),files:list,warning:'Fotogramas extraídos, NO vistos/interpretados. El agente o persona debe analizar contenido y contrastar audio antes de declarar observación directa.'};
 await writeFile(join(outdir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({status:manifest.status,folder:outdir,clips:list.length,frames:list.reduce((n,v)=>n+v.frames.length,0)},null,2));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){main().catch(e=>{console.error('BLOCKED:',e.message);process.exitCode=1})}
