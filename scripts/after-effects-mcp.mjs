#!/usr/bin/env node
/**
 * Altiora After Effects local MCP bridge.
 * Transport: stdio only. No HTTP, filesystem browse, arbitrary scripts or shell.
 * Render is disabled unless the owner explicitly opts in using env variable.
 */
import {createInterface} from "node:readline";
import {detectAerender, planLocalRender, executeLocalRender} from "./after-effects-bridge.mjs";

const SERVER_NAME="altiora-after-effects-local";
const PROTOCOL_VERSION="2025-06-18";
export const TOOLS=[
  {
    name:"after_effects_preflight",
    description:"Read-only check whether Adobe After Effects aerender is discoverable on THIS local computer. Does not prove a valid Adobe license or ability to modify .aep.",
    inputSchema:{type:"object",properties:{},additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false}
  },
  {
    name:"after_effects_plan_render",
    description:"Read-only: validate an existing .aep inside Altiora workspace and prepare exact aerender invocation; does not launch AE, render or edit projects.",
    inputSchema:{
      type:"object",
      properties:{
        project:{type:"string",description:"Existing .aep relative to Altiora repo, e.g. approved/product.aep"},
        composition:{type:"string",description:"Existing After Effects composition name"},
        output:{type:"string",description:"New output relative to workspace (e.g. out/product.mov)"}
      },
      required:["project","composition","output"],additionalProperties:false
    },
    annotations:{readOnlyHint:true,destructiveHint:false}
  },
  {
    name:"after_effects_render",
    description:"Opt-in only: render an EXISTING approved .aep composition via local aerender, with fresh output file. Disabled unless PC owner sets ALTIORA_AE_ALLOW_RENDER=YES-I-APPROVE-LOCAL-RENDERS. No code execution, project editing or external network.",
    inputSchema:{
      type:"object",
      properties:{
        project:{type:"string"},
        composition:{type:"string"},
        output:{type:"string"}
      },
      required:["project","composition","output"],additionalProperties:false
    },
    annotations:{readOnlyHint:false,destructiveHint:false}
  }
];

function toToolResult(value,isError=false){
  return {content:[{type:"text",text:JSON.stringify(value,null,2)}],isError};
}

export async function handleRequest(msg){
  if(!msg || typeof msg!=="object" || Array.isArray(msg)) throw new Error("Invalid JSON-RPC message");
  if(msg.method?.startsWith("notifications/")) return null;
  const id=Object.hasOwn(msg,"id")?msg.id:undefined;
  const response=(result)=>({jsonrpc:"2.0",id,result});
  if(msg.method==="initialize")return response({
    protocolVersion:PROTOCOL_VERSION,
    capabilities:{tools:{listChanged:false}},
    serverInfo:{name:SERVER_NAME,version:"0.1.0"}
  });
  if(msg.method==="ping")return response({});
  if(msg.method==="tools/list")return response({tools:TOOLS});
  if(msg.method==="resources/list")return response({resources:[]});
  if(msg.method==="prompts/list")return response({prompts:[]});
  if(msg.method==="tools/call"){
    const name=msg.params?.name;
    const args=msg.params?.arguments??{};
    try {
      if(!args||typeof args!=="object"||Array.isArray(args))throw new Error("Arguments must be an object");
      if(name==="after_effects_preflight"){
        if(Object.keys(args).length)throw new Error("No arguments accepted");
        return response(toToolResult({status:"CHECKED_LOCAL_ONLY",...detectAerender(),render_enabled:process.env.ALTIORA_AE_ALLOW_RENDER==="YES-I-APPROVE-LOCAL-RENDERS",supports_native_project_editing:false}));
      }
      if(name==="after_effects_plan_render"){
        return response(toToolResult(await planLocalRender(args.project,args.composition,args.output)));
      }
      if(name==="after_effects_render"){
        return response(toToolResult(await executeLocalRender(args.project,args.composition,args.output)));
      }
      throw new Error("Unknown tool: "+String(name).slice(0,100));
    }catch(e){
      return response(toToolResult({error:e.message,status:"BLOCKED_OR_FAILED"},true));
    }
  }
  return {jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}};
}

async function main(){
  // MCP stdio uses one JSON object per newline, without status logs on stdout.
  const rl=createInterface({input:process.stdin,crlfDelay:Infinity});
  for await (const line of rl){
    if(!line.trim())continue;
    if(line.length>131072){process.stderr.write("MCP input exceeds size limit\n");continue;}
    let payload;
    try{payload=JSON.parse(line);}catch(e){
      process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:null,error:{code:-32700,message:"Parse error"}})+"\n");
      continue;
    }
    try{
      const value=await handleRequest(payload);
      if(value!==null && payload.id!==undefined)process.stdout.write(JSON.stringify(value)+"\n");
    }catch(e){
      if(payload.id!==undefined)process.stdout.write(JSON.stringify({jsonrpc:"2.0",id:payload.id,error:{code:-32603,message:"Internal error"}})+"\n");
      process.stderr.write("Altiora MCP error: "+e.message+"\n");
    }
  }
}
if(import.meta.url===new URL("file://"+process.argv[1]).href) {
  main().catch(e=>{process.stderr.write("Altiora MCP fatal: "+e.message+"\n");process.exitCode=1;});
}
