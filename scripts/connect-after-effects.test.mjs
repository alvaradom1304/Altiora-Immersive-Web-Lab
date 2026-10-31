import test from "node:test";
import assert from "node:assert/strict";
import {commands,mergeAntigravity,runClient} from "./connect-after-effects.mjs";

const node="C:\\Program Files\\nodejs\\node.exe",server="C:\\Altiora Lab\\scripts\\after-effects-mcp.mjs";

test("all three desktop CLIs receive EXACT same local trusted Node MCP",()=>{
  const plans=commands(node,server);
  assert.deepEqual(plans.map(x=>x.client),["Claude Code","Gemini CLI","Codex CLI"]);
  assert.ok(plans.every(x=>x.args.includes(node)&&x.args.includes(server)));
  assert.ok(plans.every(x=>x.args.includes("altiora-after-effects")));
  assert.ok(plans.every(x=>!x.args.some(a=>/https?:/.test(a))));
});

test("Antigravity configuration adds a local project entry without overwriting other servers",()=>{
  const existing={mcpServers:{safe:{command:"node",args:["other.mjs"]}},otherSetting:"unchanged"};
  const m=mergeAntigravity(existing,node,server);
  assert.equal(m.changed,true);
  assert.deepEqual(m.value.mcpServers.safe,existing.mcpServers.safe);
  assert.equal(m.value.otherSetting,"unchanged");
  assert.equal(m.value.mcpServers["altiora-after-effects"].command,node);
  assert.deepEqual(m.value.mcpServers["altiora-after-effects"].args,[server]);
  assert.equal(mergeAntigravity(m.value,node,server).changed,false);
  assert.throws(()=>mergeAntigravity({mcpServers:{"altiora-after-effects":{command:"unknown"}}},node,server),/differs/);
});

test("missing client is reported, not falsely connected",()=>{
 const stub=()=>({error:{code:"ENOENT",message:"not found"},status:null});
 assert.equal(runClient(commands(node,server)[0],stub).status,"CLI_NOT_INSTALLED");
});

test("client with failed CLI command is reported as FAILED",()=>{
 assert.equal(runClient(commands(node,server)[1],()=>({status:1,stderr:"invalid argument"})).status,"FAILED");
 assert.equal(runClient(commands(node,server)[2],()=>({status:0,stdout:"added"})).status,"REGISTERED");
});
