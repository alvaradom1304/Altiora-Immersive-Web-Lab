#!/usr/bin/env node
/**
 * Configure Altiora local After Effects MCP for Claude Code, Gemini CLI /
 * compatible Antigravity setups and Codex, with owner opt-in.
 * The default is DRY RUN. --apply edits project-scoped configs only, creates
 * private backups, never executes Adobe, installs software or exposes secrets.
 */
import assert from "node:assert/strict";
import {readFile,writeFile,mkdir,stat,copyFile} from "node:fs/promises";
import {dirname,resolve,relative,isAbsolute,sep,join} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=fileURLToPath(new URL("../",import.meta.url));
const FILES=[".mcp.json",".gemini/settings.json",".agents/mcp_config.json",".codex/config.toml"];
const SERVER="altiora-after-effects";

export function configurations(root) {
  const script=resolve(root,"scripts/after-effects-mcp.mjs");
  return {
    ".mcp.json":{mcpServers:{
      [SERVER]:{type:"stdio",command:"node",args:[script]}
    }},
    ".gemini/settings.json":{mcpServers:{
      [SERVER]:{
        command:"node",args:[script],cwd:root,trust:false,
        includeTools:["after_effects_preflight","after_effects_plan_render","after_effects_render"],
        timeout:1800000
      }
    }},
    ".agents/mcp_config.json":{mcpServers:{
      [SERVER]:{command:"node",args:[script]}
    }},
    ".codex/config.toml":codexBlock(root,script)
  };
}
export function codexBlock(root,script){
  const q=s=>JSON.stringify(s).replace(/\u2028|\u2029/g," ");
  // TOML basic strings are JSON-compatible for these escaped absolute paths.
  return [
    "["+"mcp_servers."+SERVER+"]",
    "command = "+q("node"),
    "args = ["+q(script)+"]",
    "cwd = "+q(root),
    "startup_timeout_sec = 10",
    "tool_timeout_sec = 1800"
  ].join("\n")+"\n";
}
export function mergeToml(current,block){
  const header="["+"mcp_servers."+SERVER+"]";
  const lines=current.split("\n");
  const start=lines.findIndex(line=>line.trim()===header);
  if(start<0) return current.trimEnd()+"\n\n"+block;
  let end=start+1;
  while(end<lines.length&&!/^\s*\[[^\]]+\]\s*$/.test(lines[end]))end++;
  return [...lines.slice(0,start),...block.trimEnd().split("\n"),"",...lines.slice(end)].join("\n").trimEnd()+"\n";
}
export function mergeJson(current,addition) {
  assert.ok(current && typeof current==="object"&&!Array.isArray(current));
  const servers=current.mcpServers??{};
  assert.ok(servers && typeof servers==="object"&&!Array.isArray(servers));
  return {...current,mcpServers:{...servers,...addition.mcpServers}};
}
export async function buildPlan(root=ROOT){
  const desired=configurations(root);
  const entries=[];
  for(const relativePath of FILES){
    const path=resolve(root,relativePath);
    let original=null,existing=null;
    try{original=await readFile(path,"utf8");}catch(e){if(e.code!=="ENOENT")throw e;}
    if(relativePath.endsWith(".json")) {
      existing=original===null?{}:JSON.parse(original);
      entries.push({relativePath,path,original,
        content:JSON.stringify(mergeJson(existing,desired[relativePath]),null,2)+"\n"});
    }else{
      entries.push({relativePath,path,original,
        content:mergeToml(original??"",desired[relativePath])});
    }
  }
  return entries;
}

async function main(){
  const flags=process.argv.slice(2);
  assert.ok(flags.length<=1&&["--apply","--check"].includes(flags[0]??"--check"),
    "Use --check (default) or --apply");
  const apply=flags[0]==="--apply";
  const plans=await buildPlan();
  const changed=plans.filter(x=>x.original!==x.content);
  if(!apply){
    process.stdout.write(JSON.stringify({
      status:"DRY_RUN",server:SERVER,configuration_files:plans.map(x=>x.relativePath),
      pending_changes:changed.map(x=>x.relativePath),
      node_executable:process.execPath,
      note:"No files or permissions changed. Run npm run after-effects:setup -- --apply locally to configure trusted project MCP; native AE still requires installation and authorization."
    },null,2)+"\n");
    return;
  }
  // Backups remain untracked; preserve originals before editing.
  const stamp=new Date().toISOString().replace(/[.:]/g,"-");
  const backups=resolve(ROOT,".altiora-private","backups",stamp);
  await mkdir(backups,{recursive:true});
  for(const p of changed){
    if(p.original!==null){
      const backup=resolve(backups,p.relativePath);
      await mkdir(dirname(backup),{recursive:true});
      await copyFile(p.path,backup);
    }
    await mkdir(dirname(p.path),{recursive:true});
    await writeFile(p.path,p.content,"utf8");
  }
  process.stdout.write(JSON.stringify({
    status:"PROJECT_MCP_CONFIGURED_NOT_YET_CONNECTED",updated:changed.map(x=>x.relativePath),
    backup_directory:backups,
    next:"Restart Claude Code / Gemini CLI / Antigravity / Codex from this trusted repository. Approve MCP project trust, run after_effects_preflight, verify aerender and Adobe license. Render remains disabled until local opt-in."
  },null,2)+"\n");
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(e=>{process.stderr.write("ALTIORA_AE_SETUP: "+e.message+"\n");process.exitCode=1;});
}
