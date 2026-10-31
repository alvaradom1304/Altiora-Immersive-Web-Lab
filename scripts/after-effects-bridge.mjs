#!/usr/bin/env node
/**
 * After Effects render bridge (Adobe aerender) — opt-in local execution.
 * Only accepts an EXISTING .aep, a bounded composition name, and output under
 * the project workspace. Does not install Adobe, access network or read secrets.
 * The default mode is preflight only. NEVER assume a GitHub runner can operate
 * the user's After Effects desktop.
 */
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {realpath, stat, mkdir, writeFile} from "node:fs/promises";
import {resolve,dirname,relative,isAbsolute,sep,extname} from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=fileURLToPath(new URL("../",import.meta.url));
const ALLOWED_AERENDER=process.platform==="win32"?"aerender.exe":"aerender";

export function isWithin(parent,child){
  const rel=relative(parent,child);
  return rel!=="" && rel!==".." && !rel.startsWith(".."+sep) && !isAbsolute(rel);
}
export function validateArgs(project,comp,output,root=ROOT) {
  assert.ok(typeof project==="string"&&project.trim(),"Project path required");
  assert.ok(typeof comp==="string"&&comp.trim()&&comp.length<=160&&!/[\r\n]/.test(comp),"Valid composition name required");
  assert.ok(typeof output==="string"&&output.trim(),"Output path required");
  const pj=resolve(root,project),out=resolve(root,output);
  assert.ok(isWithin(root,pj)&&isWithin(root,out),"Paths must remain inside workspace");
  assert.equal(extname(pj).toLowerCase(),".aep","Only .aep project files accepted");
  assert.ok([".mov",".avi",".mp4"].includes(extname(out).toLowerCase()),"Unsupported output extension");
  return {project:pj,comp,output:out};
}
export function renderArguments(job){
  return ["-project",job.project,"-comp",job.comp,"-output",job.output];
}
export function detectAerender(runner=spawnSync,exe=process.env.ALTIORA_AERENDER||ALLOWED_AERENDER){
  // Version/help alone cannot confirm a working GUI license; use a benign probe.
  const x=runner(exe,["-help"],{encoding:"utf8",timeout:8000,maxBuffer:256*1024,shell:false,windowsHide:true});
  return {
    available:!x.error && (x.status===0 || /After Effects|aerender|usage:/i.test(String(x.stdout||"")+" "+String(x.stderr||""))),
    executable:exe,
    diagnostic:x.error?.code||x.status,
    note:"Availability is local CLI discovery only. Requires compatible installed licensed AE and valid render settings."
  };
}

export async function planLocalRender(project,comp,output) {
  const job=validateArgs(project,comp,output);
  const src=await stat(job.project);
  assert.ok(src.isFile(),"Source must be a file");
  const real=await realpath(job.project);
  const realRoot=await realpath(ROOT);
  assert.ok(isWithin(realRoot,real),"Source symbolic link escapes workspace");
  return {
    status:"PLANNED",application:"Adobe After Effects",engine:"aerender",
    project:job.project,composition:job.comp,output:job.output,
    command:[process.env.ALTIORA_AERENDER||ALLOWED_AERENDER,...renderArguments(job)],
    notes:["Requires licensed After Effects locally; no cloud desktop access implied","AE Output Module settings determine actual codec","Visual, rights and sound QA required"]
  };
}

export async function executeLocalRender(project,comp,output) {
  // Opt-in must be provided by the PC owner in the LOCAL process environment.
  assert.equal(process.env.ALTIORA_AE_ALLOW_RENDER,"YES-I-APPROVE-LOCAL-RENDERS",
    "Render disabled. Owner must explicitly enable local render in the MCP/client environment.");
  const plan=await planLocalRender(project,comp,output);
  const exact=process.env.ALTIORA_AE_APPROVED_PROJECT;
  assert.ok(exact && exact.trim(), "Approved local .aep path required in ALTIORA_AE_APPROVED_PROJECT");
  const approvedPath=resolve(ROOT,exact);
  const actualApproved=await realpath(approvedPath);
  const actualSource=await realpath(plan.project);
  assert.equal(actualSource,actualApproved,"Project was not approved by the PC owner");
  const allowedOut=resolve(ROOT,"out");
  assert.ok(isWithin(allowedOut,plan.output),"Output must remain inside out/");
  const probe=detectAerender();
  assert.ok(probe.available,"After Effects aerender is not verified on this machine");
  await mkdir(dirname(plan.output),{recursive:true});
  const realRoot=await realpath(ROOT);
  const realOutputDirectory=await realpath(dirname(plan.output));
  assert.ok(isWithin(realRoot,realOutputDirectory),"Output directory symbolic link escapes workspace");
  const previous=await stat(plan.output).catch(e=>{if(e.code==="ENOENT")return null;throw e;});
  assert.equal(previous,null,"Output already exists; choose a new output name (prevents accidental overwrite)");
  const runner=spawnSync(plan.command[0],renderArguments({project:plan.project,comp:plan.composition,output:plan.output}),{
    cwd:ROOT,encoding:"utf8",timeout:1800000,maxBuffer:1024*1024,shell:false,windowsHide:true
  });
  assert.ok(!runner.error&&runner.status===0,
    "aerender failed: "+(runner.error?.message||runner.stderr||runner.status).toString().slice(0,400));
  const result=await stat(plan.output);
  assert.ok(result.size>10000,"No substantial output file produced");
  const report={
    type:"after_effects_local_render",status:"RENDERED_NOT_QA_APPROVED",
    output:plan.output,bytes:result.size,project:plan.project,comp:plan.composition,
    marketing_approved:false,format_verified:false,
    notes:["Run technical media metadata and human QA","Check content rights and Adobe license"]
  };
  await writeFile(resolve(ROOT,"continuity/after-effects-last-render.json"),JSON.stringify(report,null,2)+"\n");
  return report;
}

async function main(){
  const args=process.argv.slice(2);
  if(args.length===0 || args[0]==="--check"){
    assert.ok(args.length<=1,"Usage: --check | --plan <project.aep> <comp> <out.mov> | --render <project.aep> <comp> <out.mov>");
    process.stdout.write(JSON.stringify({type:"after_effects_local_preflight",...detectAerender(),adobe_connector:"NOT_VERIFIED",project_opened:false},null,2)+"\n");
    return;
  }
  assert.ok(["--plan","--render"].includes(args[0])&&args.length===4,"Invalid arguments");
  const job=validateArgs(args[1],args[2],args[3]);
  const result = args[0] === "--plan"
    ? await planLocalRender(args[1],args[2],args[3])
    : await executeLocalRender(args[1],args[2],args[3]);
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(e=>{process.stderr.write("AFTER_EFFECTS_BRIDGE: "+e.message+"\n");process.exitCode=1;});
}
