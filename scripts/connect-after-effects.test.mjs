import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile,symlink,access,link} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPlan,applyPlan,mergeToml,codexBlock,mergeJson,configurations} from './setup-after-effects-access.mjs';
import {safeLocalPath} from './local-path-safety.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const name='altiora-after-effects';

test('legacy client plan is read-only and routes to four project configs',()=>{
  const r=spawnSync(process.execPath,['scripts/connect-after-effects.mjs','--plan'],{cwd:root,encoding:'utf8',shell:false,windowsHide:true});
  assert.equal(r.status,0,r.stderr);
  const plan=JSON.parse(r.stdout);
  assert.equal(plan.status,'DRY_RUN_NO_CHANGES');
  assert.equal(plan.files.length,4);
  assert.ok(!plan.commands,'No global CLI mutations');
});

test('setup apply preserves unrelated settings, backs up originals and is idempotent',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'altiora config space-'));
  await mkdir(join(folder,'.gemini'));
  const original=JSON.stringify({theme:'dark',mcpServers:{other:{command:'other'}}});
  await writeFile(join(folder,'.gemini/settings.json'),original);
  const result=await applyPlan(folder,await buildPlan(folder));
  assert.equal(result.updated.length,4);
  assert.equal(await readFile(join(result.backup_directory,'.gemini/settings.json'),'utf8'),original);
  const config=JSON.parse(await readFile(join(folder,'.gemini/settings.json'),'utf8'));
  assert.equal(config.theme,'dark');assert.equal(config.mcpServers.other.command,'other');
  assert.equal(config.mcpServers[name].command,process.execPath);
  assert.equal(config.mcpServers[name].trust,false);
  const again=await applyPlan(folder,await buildPlan(folder));
  assert.deepEqual(again.updated,[]);
});

test('stale plans and custom owner render permissions fail before rewriting',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'altiora stale-'));
  const plans=await buildPlan(folder);
  await writeFile(join(folder,'.mcp.json'),'{}');
  await assert.rejects(applyPlan(folder,plans),/changed since plan/);
  assert.throws(()=>mergeJson({mcpServers:{[name]:{command:'node',env:{ALTIORA_AE_ALLOW_RENDER:'custom'}}}},configurations(folder)['.mcp.json']),/manual review/);
  assert.throws(()=>mergeToml('[mcp_servers."altiora-after-effects"]\ncommand="node"',codexBlock(folder,'server')),/manual review/);
  assert.throws(()=>mergeToml('[mcp_servers.altiora-after-effects.env]\nX="Y"',codexBlock(folder,'server')),/manual review/);
});

test('junctions cannot redirect config or output directory creation outside checkout',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'altiora links-'));
  const external=await mkdtemp(join(tmpdir(),'altiora external-'));
  await symlink(external,join(folder,'out'),process.platform==='win32'?'junction':'dir');
  await assert.rejects(safeLocalPath(folder,join(folder,'out/new/deep.mov')),/link|junction/);
  await assert.rejects(access(join(external,'new')));
  await symlink(external,join(folder,'.gemini'),process.platform==='win32'?'junction':'dir');
  await assert.rejects(buildPlan(folder),/link|junction/);
});

test('hard-linked output aliases are rejected',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'altiora hardlink-'));
  await writeFile(join(folder,'source.mov'),'preserve');
  await link(join(folder,'source.mov'),join(folder,'target.mov'));
  await assert.rejects(safeLocalPath(folder,join(folder,'target.mov')),/Hard-linked/);
});

test('generated stdio command works from another directory with Windows spaces',()=>{
  const entry=configurations(root)['.mcp.json'].mcpServers[name];
  const request=JSON.stringify({jsonrpc:'2.0',id:8,method:'initialize',params:{protocolVersion:'2025-06-18'}})+'\n'+JSON.stringify({jsonrpc:'2.0',id:9,method:'tools/list'})+'\n';
  const r=spawnSync(entry.command,entry.args,{cwd:tmpdir(),input:request,encoding:'utf8',shell:false,windowsHide:true,env:{...process.env,ALTIORA_AE_ALLOW_RENDER:'',ALTIORA_AE_APPROVED_PROJECT:''}});
  assert.equal(r.status,0,r.stderr);
  const messages=r.stdout.trim().split('\n').map(JSON.parse);
  assert.equal(messages[0].result.protocolVersion,'2025-06-18');
  assert.equal(messages[1].result.tools.length,2);
});
