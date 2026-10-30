// Escanea UN paquete local sin ejecutar sus scripts. Bloquea si falta SkillSpector.
import {realpath,lstat,readdir} from 'node:fs/promises';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {assessScan} from './security-policy.mjs';
const input=process.argv[2];
if (!input || input.startsWith('-') || process.argv.length!==3) {console.error('Uso: npm run security:scan -- skills/<nombre> (o .references/<repo>)');process.exit(2);}
const root=await realpath(resolve(new URL('../',import.meta.url).pathname)).catch(()=>null);
if(!root){console.error('No se pudo resolver el repo');process.exit(2);}
const candidate=resolve(process.cwd(),input);
let path;
try {path=await realpath(candidate);} catch {console.error('El objetivo no existe');process.exit(2);}
const rel=relative(root,path);
if(rel===''||rel.startsWith('..'+sep)||isAbsolute(rel)||!(/^(skills|\.references|third-party)\//.test(rel.replaceAll(sep,'/')))){console.error('Objetivo fuera de carpeta permitida: skills/, .references/ o third-party/');process.exit(2);}
let count=0,bytes=0;
async function guard(current,depth=0){
 if(depth>14)throw new Error('Demasiados niveles');
 const stat=await lstat(current);
 if(stat.isSymbolicLink())throw new Error('No se admiten enlaces simbólicos');
 if(stat.isFile()){count++;bytes+=stat.size;if(count>3000||bytes>100*1024*1024)throw new Error('Paquete demasiado grande');return;}
 if(!stat.isDirectory())throw new Error('Tipo de archivo no permitido');
 for(const e of await readdir(current))await guard(resolve(current,e),depth+1);
}
try{await guard(path);}catch(e){console.error('Preflight bloqueado: '+e.message);process.exit(2);}
const env={};
for(const k of ['PATH','HOME','TMPDIR','TEMP','TMP','SYSTEMROOT','SystemRoot','PATHEXT','COMSPEC','USERPROFILE','VIRTUAL_ENV','LANG','LC_ALL'])if(process.env[k])env[k]=process.env[k];
const version=spawnSync('skillspector',['--version'],{encoding:'utf8',env,timeout:15000,windowsHide:true,maxBuffer:1024*1024});
if(version.error||version.status!==0||!/(?:^|\b)v?2\.12\.0(?:\b|$)/.test((version.stdout||'')+' '+(version.stderr||''))){console.error('BLOCKED: instalar y revisar SkillSpector v2.12.0 en entorno aislado; no auto-instalamos código externo.');process.exit(3);}
const scan=spawnSync('skillspector',['scan',path,'--no-llm','--format','json','--fail-on-incomplete'],{encoding:'utf8',env,timeout:180000,windowsHide:true,maxBuffer:20*1024*1024});
if(scan.error||scan.status!==0){console.error('BLOCKED: SkillSpector falló o cobertura incompleta. '+(scan.error?.message||'exit='+scan.status));process.exit(4);}
let parsed;
try{parsed=JSON.parse(scan.stdout)}catch{console.error('BLOCKED: informe JSON de scanner inválido');process.exit(4);}
const v=assessScan(parsed);
console.log(JSON.stringify({tool:'NVIDIA SkillSpector',version:'2.12.0',mode:'static/no-llm',source:rel,files:count,bytes,scan_result:v,not_installed:true},null,2));
if(!v.allowed)process.exit(5);
console.log('SAFE (scanner) no sustituye revisión humana, licencias, análisis de dependencias ni sandbox.');
