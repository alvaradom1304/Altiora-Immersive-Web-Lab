// npm run route -- "crear un anuncio de producto"
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {loadSkills,loadAgents} from './skill-catalog.mjs';
import {planTask} from './intent-router-core.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const task=process.argv.slice(2).join(' ').trim();
if(!task){console.error('Uso: npm run route -- "encargo"');process.exitCode=2;}
else {
 try {
  const [skills,agents,web,video]=await Promise.all([
   loadSkills(root),loadAgents(root),
   readFile(resolve(root,'references/repositories.json'),'utf8').then(JSON.parse),
   readFile(resolve(root,'references/av-security-sources.json'),'utf8').then(JSON.parse)
  ]);
  console.log(JSON.stringify(planTask(task,{skills,agents,external:[...web.repositories,...video.repositories]}),null,2));
 } catch(e){console.error('Error de enrutamiento:',e.message);process.exitCode=1;}
}
