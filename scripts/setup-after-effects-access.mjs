#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {safeLocalPath} from './local-path-safety.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const SERVER='altiora-after-effects';
export function codexBlock(root,script,node=process.execPath){
  return `[mcp_servers.${SERVER}]\ncommand = ${JSON.stringify(node)}\nargs = [${JSON.stringify(script)}]\ncwd = ${JSON.stringify(root)}\nenabled = true\nstartup_timeout_sec = 10\ntool_timeout_sec = 1800\n`;
}
export function configurations(root,node=process.execPath){
  const script=resolve(root,'scripts/after-effects-mcp.mjs');
  const entry={command:node,args:[script]};
  return {
    '.mcp.json':{mcpServers:{[SERVER]:{type:'stdio',...entry}}},
    '.gemini/settings.json':{mcpServers:{[SERVER]:{...entry,cwd:root,trust:false,timeout:1800000}}},
    '.codex/config.toml':codexBlock(root,script,node),
    '.agents/mcp_config.json':{mcpServers:{[SERVER]:{...entry,timeoutSeconds:1800}}}
  };
}
export function mergeJson(current,addition){
  assert.ok(current && typeof current==='object' && !Array.isArray(current),'Invalid JSON config');
  const servers=current.mcpServers??{};
  assert.ok(servers && typeof servers==='object' && !Array.isArray(servers),'Invalid MCP map');
  const old=servers[SERVER];
  if(old) {
    assert.ok(!old.env && !old.url && !old.httpUrl && !old.serverUrl, 'Custom server configuration requires manual review');
    assert.ok(old.command==='node' || old.command===process.execPath,'Custom Node executable requires manual review');
    assert.ok(old.args?.length===1 && /(?:^|[\\/])scripts[\\/]after-effects-mcp\.mjs$/.test(old.args[0]),'Custom server arguments require manual review');
  }
  return {...current,mcpServers:{...servers,...addition.mcpServers}};
}
export function mergeToml(current,block){
  // Conservative editor: refuse complex constructs rather than corrupt TOML.
  assert.ok(!current.includes('"""') && !current.includes("'''"),'Multiline TOML needs manual review');
  const lines=current.split(/\r?\n/);
  const header=`[mcp_servers.${SERVER}]`;
  const related=lines.filter(l=>/^\s*\[/.test(l) && l.includes(SERVER));
  assert.ok(related.length<=1 && related.every(l=>l.trim()===header),'Custom or nested TOML server table needs manual review');
  const start=lines.findIndex(l=>l.trim()===header);
  if(start<0) return current.trimEnd()+'\n\n'+block;
  let end=start+1;
  while(end<lines.length&&!/^\s*\[/.test(lines[end]))end++;
  const old=lines.slice(start+1,end).filter(l=>l.trim()&&!/^\s*#/.test(l));
  assert.ok(old.every(l=>/^\s*(command|args|cwd|enabled|startup_timeout_sec|tool_timeout_sec)\s*=/.test(l)),'Custom TOML settings need manual review');
  const command=old.find(l=>/^\s*command\s*=/.test(l));
  assert.ok(command && [JSON.stringify('node'),JSON.stringify(process.execPath)].includes(command.split('=').slice(1).join('=').trim()),'Custom TOML executable needs manual review');
  const args=old.find(l=>/^\s*args\s*=/.test(l));
  assert.ok(args && args.includes('after-effects-mcp.mjs'),'Custom TOML arguments need manual review');
  return [...lines.slice(0,start),block.trimEnd(),'',...lines.slice(end)].join('\n').trimEnd()+'\n';
}
export async function buildPlan(root=ROOT){
  const entries=[];
  for(const [relativePath,desired] of Object.entries(configurations(root))){
    const path=await safeLocalPath(root,resolve(root,relativePath));
    let original=null;
    try{original=await readFile(path,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;}
    const content=relativePath.endsWith('.json')
      ?JSON.stringify(mergeJson(original===null?{}:JSON.parse(original),desired),null,2)+'\n'
      :mergeToml(original??'',desired);
    entries.push({relativePath,path,original,content});
  }
  return entries;
}
export async function applyPlan(root,plans){
  for(const p of plans){
    await safeLocalPath(root,p.path);
    const now=await readFile(p.path,'utf8').catch(e=>{if(e.code==='ENOENT')return null;throw e;});
    assert.equal(now,p.original,'Configuration changed since plan; retry');
  }
  const changed=plans.filter(p=>p.original!==p.content);
  const backups=resolve(root,'.altiora-private/backups',new Date().toISOString().replace(/[.:]/g,'-'));
  for(const p of changed){
    if(p.original!==null){
      const backup=await safeLocalPath(root,resolve(backups,p.relativePath));
      await mkdir(dirname(backup),{recursive:true});
      await copyFile(p.path,backup);
    }
    await safeLocalPath(root,p.path);
    await mkdir(dirname(p.path),{recursive:true});
    await writeFile(p.path,p.content,{flag:p.original===null?'wx':'w',mode:0o600});
  }
  return {status:'PROJECT_CONFIGURED_NOT_CONNECTED',updated:changed.map(p=>p.relativePath),backup_directory:changed.length?backups:null};
}
export async function main(flags=process.argv.slice(2)){
  assert.ok(flags.length<=1&&['--apply','--check'].includes(flags[0]??'--check'),'Use --check or --apply');
  const plans=await buildPlan();
  const result=flags[0]==='--apply'?await applyPlan(ROOT,plans):{
    status:'DRY_RUN_NO_CHANGES',files:plans.map(p=>p.relativePath),pending_changes:plans.filter(p=>p.original!==p.content).map(p=>p.relativePath)
  };
  process.stdout.write(JSON.stringify({...result,note:'Restart installed local clients from this trusted checkout; verify after_effects_preflight. No Adobe installation, render permission or remote access granted.'},null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{
  process.stderr.write('ALTIORA_AE_SETUP: '+e.message+'\n');process.exitCode=1;
});
