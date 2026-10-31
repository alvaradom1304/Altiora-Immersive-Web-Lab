import test from "node:test";
import assert from "node:assert/strict";
import {validateVideoMetadata,makeQAReport} from "./verify-master.mjs";

const probe={
  streams:[{codec_type:"video",codec_name:"h264",width:1080,height:1920,avg_frame_rate:"30/1",duration:"15"}],
  format:{duration:"15.000"}
};

test("1080x1920 @ 30 fps 15 seconds H264 is a technical pass, not a commercial pass",()=>{
 const report=makeQAReport(probe,2150000);
 assert.equal(report.pass,true);
 assert.equal(report.marketing_ready,false);
 assert.equal(report.format.width,1080);
 assert.equal(report.format.height,1920);
 assert.equal(report.format.duration_seconds,15);
 assert.equal(report.marketing_blockers.length,4);
});

test("reject 540p previews, fps mismatch, duration mismatch and wrong codec",()=>{
 for(const mutation of [
   x=>x.streams[0].width=540,
   x=>x.streams[0].avg_frame_rate="24/1",
   x=>x.format.duration="11.000",
   x=>x.streams[0].codec_name="vp9"
 ]){
  const bad=structuredClone(probe);mutation(bad);
  assert.throws(()=>validateVideoMetadata(bad));
 }
});

test("reject tiny/empty or missing videos",()=>{
 assert.throws(()=>makeQAReport(probe,32));
 assert.throws(()=>validateVideoMetadata({streams:[],format:{duration:"15"}}));
});

test("audio flag detects source audio without pretending license approval",()=>{
 const x=structuredClone(probe);x.streams.push({codec_type:"audio",codec_name:"aac"});
 const result=makeQAReport(x,500000);
 assert.equal(result.format.has_audio,true);
 assert.equal(result.marketing_ready,false);
});
