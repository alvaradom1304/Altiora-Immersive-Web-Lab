import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,mkdir,writeFile,readFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {configurations,codexBlock,mergeToml,mergeJson,buildPlan} from "./setup-after-effects-access.mjs";

test("Generates project-scoped configs for all four tools without elevated privileges",()=>{
  const c=configurations("/tmp/Altiora Visual Studio");
  assert.deepEqual(Object.keys(c).sort(),[".mcp.json",".gemini/settings.json",".agents/mcp_config.json",".codex/config.toml"].sort());
  assert.ok(c[".mcp.json"].mcpServers["altiora-after-effects"].args[0].includes("Altiora Visual Studio"));
  assert.equal(c[".gemini/settings.json"].mcpServers["altiora-after-effects"].trust,false);
  assert.ok(c[".agents/mcp_config.json"].mcpServers["altiora-after-effects"].args[0].includes("after-effects-mcp.mjs"));
  assert.ok(c[".codex/config.toml"].includes("[mcp_servers.altiora-after-effects]"));
});
test("TOML escapes Windows backslashes and quotes",()=>{
  const x=codexBlock("C:\\Users\\User Name\\Altiora","C:\\Users\\User Name\\Altiora\\scripts\\after-effects-mcp.mjs");
  assert.match(x,/C:\\\\Users\\\\User Name\\\\Altiora/);
  assert.match(x,/args = \[/);
});
test("Merges without discarding any existing MCP server",()=>{
  const current={mcpServers:{"existing-safe":{command:"node",args:["x"]}},theme:"dark"};
  const updated=mergeJson(current,configurations("/tmp/project")[".gemini/settings.json"]);
  assert.equal(updated.mcpServers["existing-safe"].args[0],"x");
  assert.equal(updated.theme,"dark");
  assert.equal(updated.mcpServers["altiora-after-effects"].trust,false);
});
test("Replaces only this TOML server block, preserving unrelated sections",()=>{
  const existing="[mcp_servers.other]\ncommand = \"git\"\n\n[mcp_servers.altiora-after-effects]\ncommand = \"node\"\nargs = [\"scripts/after-effects-mcp.mjs\"]\n\n[features]\nweb_search = true\n";
  const newText=mergeToml(existing,codexBlock("/tmp/current","/tmp/current/scripts/after-effects-mcp.mjs"));
  assert.ok(newText.includes('[mcp_servers.other]\ncommand = "git"'));
  assert.ok(newText.includes("[features]\nweb_search = true"));
  assert.ok(!newText.includes('command = "old"'));
  assert.equal(newText.match(/\[mcp_servers.altiora-after-effects\]/g)?.length,1);
});
test("Build plan reads existing configs and does not write to disk",async()=>{
  const home=await mkdtemp(join(tmpdir(),"altiora-ae-mcp-test-"));
  await mkdir(join(home,".gemini"),{recursive:true});
  await writeFile(join(home,".gemini/settings.json"),JSON.stringify({mcpServers:{other:{command:"echo"}}}));
  const plan=await buildPlan(home);
  assert.equal(plan.length,4);
  assert.ok(JSON.parse(plan.find(p=>p.relativePath===".gemini/settings.json").content).mcpServers.other);
  assert.equal((await readFile(join(home,".gemini/settings.json"),"utf8")).includes("altiora-after-effects"),false);
});
