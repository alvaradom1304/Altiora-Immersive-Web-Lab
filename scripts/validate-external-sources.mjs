import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {checkSource} from './security-policy.mjs';
const file=fileURLToPath(new URL('../references/av-security-sources.json',import.meta.url));
const c=JSON.parse(await readFile(file,'utf8'));
if(!Array.isArray(c.repositories)||c.repositories.length===0)throw Error('Catálogo vacío');
if(!/^20\d{2}-\d{2}-\d{2}$/.test(c.reviewed_on))throw Error('Fecha inválida');
let errors=0;
const ids=new Set();
for(const r of c.repositories){
 const p=checkSource(r);
 if(ids.has(r.id))p.push('duplicate');
 ids.add(r.id);
 if(p.length){console.error(`${r.id}: ${p.join(',')}`);errors++;}
}
if(errors)process.exit(1);
console.log(`Fuentes externas: ${c.repositories.length} referencias con commit y licencia; ninguna instalada.`);
