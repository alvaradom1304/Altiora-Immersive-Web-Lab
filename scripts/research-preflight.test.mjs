import test from 'node:test';
import assert from 'node:assert/strict';
import {slug,binaryStatus,dirStatus,workspaceStatus,preflight} from './research-preflight.mjs';
const ok={status:0},bad={status:1};
const isDir=()=>({isDirectory:()=>true,isSymbolicLink:()=>false});
test('slug prevents path traversal and unsafe names',()=>{
 assert.equal(slug('el-tilichero'),'el-tilichero');
 for(const x of ['../foo','UPPER','foo/bar','.',''])assert.throws(()=>slug(x));
});
test('binary check is offline and fail closed',()=>{
 assert.equal(binaryStatus('ffmpeg',()=>ok),'AVAILABLE');
 assert.equal(binaryStatus('ffmpeg',()=>bad),'FAILED');
 assert.equal(binaryStatus('ffmpeg',()=>({error:new Error('missing')})),'UNAVAILABLE');
 assert.equal(binaryStatus('ffmpeg',()=>{throw Error('missing')}),'UNAVAILABLE');
});
test('workspace check distinguishes absent and unsafe folders',()=>{
 assert.equal(workspaceStatus(undefined,undefined),'NOT_CHECKED');
 assert.throws(()=>workspaceStatus('ok',undefined));
 assert.equal(workspaceStatus('ok','campaign','/mock',isDir),'PRESENT');
 assert.equal(workspaceStatus('ok','campaign','/mock',()=>{const e=new Error('missing');e.code='ENOENT';throw e}),'MISSING');
 assert.equal(dirStatus('/mock',()=>({isDirectory:()=>true,isSymbolicLink:()=>true})),'UNSAFE');
});
test('preflight does not claim MCP or vision verification',()=>{
 const r=preflight({client:'client',campaign:'campaign',root:'/mock',exec:()=>ok,stat:isDir});
 assert.equal(r.media_tools,'READY');
 assert.equal(r.workspace,'PRESENT');
 assert.equal(r.browser_mcp,'NOT_VERIFIED_IN_THIS_PREFLIGHT');
 assert.equal(r.video_understanding,'REQUIRES_ACTUAL_VISUAL_AND_AUDIO_REVIEW');
});
test('preflight blocks absent media tools',()=>{
 const r=preflight({exec:()=>({error:new Error('no binary')})});
 assert.equal(r.media_tools,'BLOCKED');
 assert.equal(r.workspace,'NOT_CHECKED');
});
