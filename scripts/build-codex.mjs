// Adaptador nativo para los subagentes de Codex, derivado de fuentes de Altiora.
// Uso: node scripts/build-codex.mjs [--check]
import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadAgents} from './skill-catalog.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const check=process.argv.includes('--check');
const agents=await loadAgents(root);
const MARK='# Generado con npm run agents:build. No editar manualmente.';
const instructions=(a)=>`Lee AGENTS.md, el brief del cliente y team/agents/${a.id}.md antes de trabajar. Actúa como el rol ${a.id} de Altiora. Selecciona únicamente las skills pertinentes en .agents/skills/; sus fuentes están en skills/. Para videos reales consulta creative-ads-os/WORK_ROUTER.md y skills/ai-video-direction/references/postproduction-playbook.md. Para el proyecto local usa npm run video:project -- init --client CLIENTE --campaign CAMPANA y respeta media-workspaces/. Preserva crudos, no subas videos ni secretos a Git, y no afirmes que renderizaste si no existe MP4 verificado. No instales ejecutables/skills externos sin pasar docs/security/third-party-skill-gate.md. Solicita aprobación para publicar o gastar. Si el entorno permite subagentes, coordina con creative-ads-director, motion-designer, visual-producer y qa-reviewer. Reporta pruebas reales y pendientes.`;
const generated=new Set();
let errors=0;
for(const a of agents){
 if(!/^[a-z0-9-]+$/.test(a.id))throw Error('ID no válido: '+a.id);
 const path=`.codex/agents/${a.id}.toml`;
 const value=`${MARK}\nname = ${JSON.stringify(a.id)}\ndescription = ${JSON.stringify(a.when)}\ndeveloper_instructions = ${JSON.stringify(instructions(a))}\n`;
 generated.add(a.id+'.toml');
 const file=resolve(root,path);
 if(check){
 let old=null;try{old=(await readFile(file,'utf8')).replace(/\r\n/g,'\n')}catch{}
 if(old!==value){console.error('Codex desactualizado: '+path);errors++;}
 }else{await mkdir(resolve(root,'.codex/agents'),{recursive:true});await writeFile(file,value,'utf8');}
}
for(const f of await readdir(resolve(root,'.codex/agents')).catch(()=>[])){
 if(generated.has(f))continue;
 const file=resolve(root,'.codex/agents',f);
 const old=await readFile(file,'utf8').catch(()=>null);
 if(old?.startsWith(MARK)){
 if(check){console.error('Codex obsoleto: '+f);errors++;}
 else await rm(file);
 }
}
if(errors){console.error('Ejecutar npm run agents:build para sincronizar Codex.');process.exitCode=1;}
else console.log(`${check?'OK':'Generados'} Codex: ${agents.length} subagentes; skills en .agents/skills/.`);
