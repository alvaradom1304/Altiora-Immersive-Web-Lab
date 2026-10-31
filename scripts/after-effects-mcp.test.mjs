import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {handleRequest,TOOLS} from "./after-effects-mcp.mjs";

test("MCP supports initialization and restricted read-only list until owner approves",async()=>{
  const init=await handleRequest({jsonrpc:"2.0",id:1,method:"initialize",params:{protocolVersion:"2025-06-18"}});
  assert.equal(init.id,1);
  assert.equal(init.result.serverInfo.name,"altiora-after-effects-local");
  assert.ok(init.result.capabilities.tools);
  const list=await handleRequest({jsonrpc:"2.0",id:2,method:"tools/list"});
  assert.deepEqual(list.result.tools.map(t=>t.name),[
    "after_effects_preflight","after_effects_plan_render"
  ]);
  assert.ok(TOOLS.every(t=>t.inputSchema.additionalProperties===false));
  assert.equal(await handleRequest({jsonrpc:"2.0",method:"notifications/initialized"}),null);
});

test("Read-only preflight shows availability without falsely claiming project access",async()=>{
  const out=await handleRequest({jsonrpc:"2.0",id:3,method:"tools/call",params:{name:"after_effects_preflight",arguments:{}}});
  assert.equal(out.result.isError,false);
  const x=JSON.parse(out.result.content[0].text);
  assert.equal(x.supports_native_project_editing,false);
  assert.equal(x.render_enabled,false);
  assert.ok(typeof x.available==="boolean");
});

test("Render is blocked without the PC owner's explicit render opt-in",async()=>{
  const before=process.env.ALTIORA_AE_ALLOW_RENDER;
  try{
    delete process.env.ALTIORA_AE_ALLOW_RENDER;
    const out=await handleRequest({jsonrpc:"2.0",id:4,method:"tools/call",params:{
      name:"after_effects_render",
      arguments:{project:"approved/real.aep",composition:"Approved",output:"out/approved.mov"}
    }});
    assert.equal(out.result.isError,true);
    assert.match(out.result.content[0].text,/owner must approve|Render disabled/i);
  }finally{
    if(before===undefined)delete process.env.ALTIORA_AE_ALLOW_RENDER;
    else process.env.ALTIORA_AE_ALLOW_RENDER=before;
  }
});

test("No arbitrary shell, script or file-browse tool is exposed",async()=>{
  const list=await handleRequest({jsonrpc:"2.0",id:5,method:"tools/list"});
  assert.ok(!list.result.tools.some(t=>/shell|script|browse|write_file|delete/i.test(t.name)));
  const bad=await handleRequest({jsonrpc:"2.0",id:6,method:"tools/call",params:{name:"after_effects_eval_jsx",arguments:{script:"alert(1)"}}});
  assert.equal(bad.result.isError,true);
  const unknown=await handleRequest({jsonrpc:"2.0",id:7,method:"untrusted/execute"});
  assert.equal(unknown.error.code,-32601);
});

test("MCP stdio roundtrip launches on local Node and replies to tools/list",async()=>{
  const child=spawn(process.execPath,["scripts/after-effects-mcp.mjs"],{
    cwd:fileURLToPath(new URL("../",import.meta.url)),
    stdio:["pipe","pipe","pipe"],
    env:{...process.env,ALTIORA_AE_ALLOW_RENDER:""},
    windowsHide:true
  });
  let output="",stderr="";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data",chunk=>output+=chunk);
  child.stderr.on("data",chunk=>stderr+=chunk);
  child.stdin.write(JSON.stringify({jsonrpc:"2.0",id:99,method:"tools/list"})+"\n");
  child.stdin.end();
  await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{child.kill();reject(new Error("MCP stdio timeout"));},5000);
    child.on("error",e=>{clearTimeout(timeout);reject(e);});
    child.on("close",code=>{clearTimeout(timeout);if(code!==0)reject(new Error(stderr||"stdio failed"));else resolve();});
  });
  const response=JSON.parse(output.trim());
  assert.equal(response.id,99);
  assert.equal(response.result.tools.length,2);
});
