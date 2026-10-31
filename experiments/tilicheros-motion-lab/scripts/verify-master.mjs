#!/usr/bin/env node
/**
 * Technical MP4 master QA, evidence only. A PASS does not certify commercial
 * legitimacy, visual art direction, product authenticity or music rights.
 */
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {readFile, stat, writeFile, mkdir} from "node:fs/promises";
import {resolve, dirname, relative, sep, isAbsolute} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));

export function validateVideoMetadata(payload) {
  const stream=(payload?.streams||[]).find(s=>s.codec_type==="video");
  assert.ok(stream,"No video stream found");
  assert.equal(stream.width,1080,"Master width must be 1080");
  assert.equal(stream.height,1920,"Master height must be 1920");
  assert.equal(stream.codec_name,"h264","Master must use H.264");
  const [n,d]=String(stream.avg_frame_rate||"0/1").split("/").map(Number);
  assert.ok(n>0&&d>0&&Math.abs(n/d-30)<0.05,"Master FPS must be 30");
  const duration=Number(payload.format?.duration||stream.duration||0);
  assert.ok(Number.isFinite(duration)&&Math.abs(duration-15)<0.20,"Master must be 15 seconds");
  return {
    width:stream.width,height:stream.height,codec:stream.codec_name,
    fps:Number((n/d).toFixed(3)),duration_seconds:Number(duration.toFixed(3)),
    has_audio:(payload.streams||[]).some(s=>s.codec_type==="audio")
  };
}

export function makeQAReport(video,bytes) {
  const metrics=validateVideoMetadata(video);
  assert.ok(bytes>10000,"Master MP4 suspiciously small");
  return {
    schema_version:1,
    test_type:"rendered_mp4_technical_validation",
    pass:true,format:metrics,file_size_bytes:bytes,
    marketing_ready:false,
    marketing_blockers:[
      "Artwork is labelled VISUAL CONCEPTUAL and is not inventory or a verified physical product",
      "No verified price, availability, product specifications, permissions or commercial rights",
      "No licensed audio or professionally reviewed sound design has been supplied",
      "Human review of typography, continuity, safety and visual quality pending"
    ],
    note:"PASS means technical 1080x1920 15s H.264 export, not a commercial ad nor CGI realism certification"
  };
}

async function main(){
  const args=process.argv.slice(2);
  assert.ok(args.length===0||(args.length===2&&args[0]==="--file"),"Use --file out/tilicheros-gaming-demo.mp4");
  const relativeFile=args.length===2?args[1]:"out/tilicheros-gaming-demo.mp4";
  const path=resolve(root,relativeFile);
  const rel=relative(root,path);
  assert.ok(rel&&!isAbsolute(rel)&&rel!==".."&&!rel.startsWith(".."+sep),"File must be inside project");
  const info=await stat(path);
  const f=spawnSync("ffprobe",["-v","error","-show_entries","stream=index,codec_type,codec_name,width,height,avg_frame_rate,duration:format=duration","-of","json",path],{encoding:"utf8",timeout:20000,maxBuffer:1024*1024,shell:false});
  assert.equal(f.status,0,"ffprobe unavailable/failed: "+(f.stderr||f.error?.message));
  const report=makeQAReport(JSON.parse(f.stdout),info.size);
  const target=resolve(root,"out/qa-master.json");
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,JSON.stringify(report,null,2)+"\n");
  process.stdout.write(JSON.stringify(report,null,2)+"\n");
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(e=>{process.stderr.write("MASTER_QA_FAILED: "+e.message+"\n");process.exitCode=1;});
}
