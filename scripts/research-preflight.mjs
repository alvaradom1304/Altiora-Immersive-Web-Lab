#!/usr/bin/env node
// Preflight local OFFLINE para Altiora Discovery First. No instala MCP, no accede a red ni abre archivos privados.
import {spawnSync} from 'node:child_process';
import {lstatSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(fileURLToPath(new URL('../media-workspaces/',import.meta.url)));
export function slug(s){
 if(typeof s!=='string'||!/^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/.test(s)) throw Error('Slug inseguro: usar a-z, 0-9 y guiones (máx. 48 caracteres)');
 return s;
}
export function binaryStatus(name,exec=spawnSync){
 try {
  const r=exec(name,['-version'],{encoding:'utf8',timeout:4000,stdio:['ignore','pipe','pipe']});
  return r.error?'UNAVAILABLE':r.status===0?'AVAILABLE':'FAILED';
 } catch {return 'UNAVAILABLE'}
}
export function dirStatus(path,stat=lstatSync){
 try{const s=stat(path);return s.isDirectory()&&!s.isSymbolicLink()?'PRESENT':'UNSAFE'}catch(e){return e?.code==='ENOENT'?'MISSING':'ERROR'}
}
export function workspaceStatus(client,campaign,root=ROOT,stat=lstatSync){
 if(client===undefined&&campaign===undefined)return 'NOT_CHECKED';
 if(client===undefined||campaign===undefined)throw Error('--client y --campaign deben indicarse juntos');
 const safeClient=slug(client),safeCampaign=slug(campaign);
 for(const p of [root,join(root,safeClient),join(root,safeClient,safeCampaign),join(root,safeClient,safeCampaign,'01_CRUDOS')]){
  const status=dirStatus(p,stat);if(status!=='PRESENT')return status;
 }
 return 'PRESENT';
}
export function preflight({client,campaign,exec=spawnSync,stat=lstatSync,root=ROOT}={}){
 const ffmpeg=binaryStatus('ffmpeg',exec),ffprobe=binaryStatus('ffprobe',exec);
 const workspace=workspaceStatus(client,campaign,root,stat);
 const nodeMajor=Number(process.versions.node.split('.')[0]);
 const mediaTools=nodeMajor>=20&&ffmpeg==='AVAILABLE'&&ffprobe==='AVAILABLE'?'READY':'BLOCKED';
 return {
  schema_version:1,
  checked_at:new Date().toISOString(),
  node_version:process.versions.node,
  ffmpeg,ffprobe,
  media_tools:mediaTools,
  workspace,
  browser_mcp:'NOT_VERIFIED_IN_THIS_PREFLIGHT',
  video_understanding:'REQUIRES_ACTUAL_VISUAL_AND_AUDIO_REVIEW',
  security:'NO_INSTALL_NO_NETWORK_NO_MEDIA_UPLOAD',
  next_action:mediaTools!=='READY'?'Instalar/verificar Node 20+, ffmpeg y ffprobe localmente tras revisión':workspace==='MISSING'?'Crear workspace con npm run video:project -- init':workspace==='UNSAFE'?'Revisar directorios y symlinks':"Revisar Playwright MCP por plataforma y luego ejecutar Discovery real"
 };
}
async function main(){
 const a=process.argv.slice(2);
 if(a.some(x=>!['--client','--campaign','--json'].includes(x)&&!a.includes('--client')&&!a.includes('--campaign')))throw Error('Argumento no reconocido');
 const get=k=>{let i=a.indexOf(k);return i<0?undefined:a[i+1]};
 const client=get('--client'),campaign=get('--campaign');
 const report=preflight({client,campaign});
 console.log(JSON.stringify(report,null,2));
 if(report.media_tools!=='READY'||['MISSING','UNSAFE','ERROR'].includes(report.workspace))process.exitCode=2;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 main().catch(e=>{console.error('BLOCKED:',e.message);process.exitCode=2});
}
