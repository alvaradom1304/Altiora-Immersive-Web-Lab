#!/usr/bin/env node
/**
 * Opt-in project-local MCP client registration for After Effects.
 * Run ONLY on the machine with the desired AI CLIs + licensed Adobe AE.
 * No package installs, no remote network listener, no credentials saved.
 * Creates Antigravity project config; uses official CLI commands for others.
 */
import {spawnSync} from "node:child_process";
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=fileURLToPath(new URL("../",import.meta.url));
const SERVER=resolve(ROOT,"scripts/after-effects-mcp.mjs");
const NAME="altiora-after-effects";
const CONFIG=resolve(ROOT,".agents/mcp_config.json");

export function commands(nodePath=process.execPath,serverPath=SERVER){
  return [
    {client:"Claude Code",command:"claude",args:["mcp","add","--transport","stdio","--scope","project",NAME,"--",nodePath,serverPath]},
    {client:"Gemini CLI",command:"gemini",args:["mcp","add","--scope","project",NAME,nodePath,serverPath]},
    {client:"Codex CLI",command:"codex",args:["mcp","add",NAME,"--",nodePath,serverPath]}
  ];
}
export function mergeAntigravity(old,nodePath=process.execPath,serverPath=SERVER){
  const data=old && typeof old==="object"&&!Array.isArray(old)?structuredClone(old):{};
  if(!data.mcpServers)data.mcpServers={};
  if(typeof data.mcpServers!=="object"||Array.isArray(data.mcpServers))throw Error("Invalid Antigravity MCP configuration");
  if(data.mcpServers[NAME]){
    const entry=data.mcpServers[NAME];
    if(entry.command===nodePath&&JSON.stringify(entry.args)===JSON.stringify([serverPath]))return {value:data,changed:false};
    throw Error("Existing "+NAME+" config differs; resolve manually, no automatic overwrite");
  }
  data.mcpServers[NAME]={command:nodePath,args:[serverPath]};
  return {value:data,changed:true};
}
export function runClient(plan,run=spawnSync){
  const result=run(plan.command,plan.args,{cwd:ROOT,encoding:"utf8",timeout:30000,windowsHide:true,shell:false,maxBuffer:256*1024});
  return {client:plan.client,status:result.error?.code==="ENOENT"?"CLI_NOT_INSTALLED":result.status===0?"REGISTERED":"FAILED",diagnostic:String(result.error?.message||result.stderr||"").slice(0,180)};
}
export async function updateAntigravity(){
  let prior={};
  try{prior=JSON.parse(await readFile(CONFIG,"utf8"));}catch(e){if(e.code!=="ENOENT")throw Error("Cannot parse existing Antigravity config; left unchanged");}
  const m=mergeAntigravity(prior);
  if(!m.changed)return {client:"Antigravity IDE/CLI",status:"ALREADY_CONFIGURED"};
  await mkdir(dirname(CONFIG),{recursive:true});
  // Refuse to clobber an existing unrelated file if it changed between read/write.
  await writeFile(CONFIG,JSON.stringify(m.value,null,2)+"\n",{flag:"w"});
  return {client:"Antigravity IDE/CLI",status:"REGISTERED_PROJECT_CONFIG",config:CONFIG};
}
async function main(){
  const args=process.argv.slice(2);
  if(args.length>1||args.length===1&&!["--plan","--apply"].includes(args[0]))
    throw Error("Use --plan or --apply. Applying requires local PC owner action.");
  const apply=args.includes("--apply");
  const plans=commands();
  if(!apply){
    process.stdout.write(JSON.stringify({mode:"PLAN_NO_CHANGES",project:ROOT,node:process.execPath,server:SERVER,
      commands:plans,antigravity_config:CONFIG,render_tools:"DISABLED_UNLESS_EXPLICIT_PC_OWNER_OPT_IN",
      note:"Run node scripts/connect-after-effects.mjs --apply ON YOUR PC to configure only installed AI clients."},null,2)+"\n");return;
  }
  const results=plans.map(p=>runClient(p));
  try{results.push(await updateAntigravity());}catch(e){results.push({client:"Antigravity IDE/CLI",status:"FAILED",diagnostic:String(e.message).slice(0,200)});}
  process.stdout.write(JSON.stringify({mode:"LOCAL_REGISTRATION_ATTEMPT",results,
    note:"REGISTERED means client config accepted, not proven After Effects desktop access. Verify through the client and npm run after-effects:check."},null,2)+"\n");
  if(results.some(x=>x.status==="FAILED"))process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(e=>{process.stderr.write("AE_CLIENT_CONFIG: "+e.message+"\n");process.exitCode=1;});
}
