import test from "node:test";
import assert from "node:assert/strict";
import {normalizeEntry,changesSince,reportText,buildSnapshot} from "./visual-watch.mjs";

const e=(id,priority="P0")=>({id,priority,decision:"evaluate"});
const d=(pushed_at="2026-10-25T00:00:00Z",license="MIT")=>({
  full_name:"org/name", archived:false, disabled:false,pushed_at,
  default_branch:"main",license:{spdx_id:license}
});

test("normalizes metadata and never interprets catalog as installation",()=>{
  const v=normalizeEntry(e("org/name"),d());
  assert.equal(v.license,"MIT");
  assert.equal(v.last_push,"2026-10-25T00:00:00Z");
  assert.equal(v.archived,false);
  assert.ok(!Object.hasOwn(v,"installed"));
});

test("baseline proposes references without downloading code",()=>{
  const current={schema_version:1,entries:[normalizeEntry(e("org/name"),d())]};
  const changes=changesSince(null,current);
  assert.deepEqual(changes.map(x=>x.kind),["NEW_REFERENCE"]);
  assert.match(reportText(current,changes,true),/línea base inicial/);
});

test("P0 maintenance is flagged but P1 routine commits do not flood PRs",()=>{
  const old={entries:[normalizeEntry(e("org/name"),d())]};
  const next={entries:[normalizeEntry(e("org/name"),d("2026-10-26T00:00:00Z"))]};
  assert.deepEqual(changesSince(old,next).map(x=>x.kind),["P0_ACTIVITY"]);
  next.entries[0].priority="P1";
  assert.deepEqual(changesSince({...old,entries:[{...old.entries[0],priority:"P1"}]},next),[]);
});

test("license and archival transitions are escalated",()=>{
  const before={entries:[normalizeEntry(e("org/name","P2"),d())]};
  const next={entries:[normalizeEntry(e("org/name","P2"),{...d(),"archived":true,license:{spdx_id:"GPL-3.0"}})]};
  const kinds=changesSince(before,next).map(x=>x.kind);
  assert.ok(kinds.includes("ARCHIVED")&&kinds.includes("LICENSE"));
});

test("missing reference in new catalog is tracked",()=>{
  const before={entries:[normalizeEntry(e("org/name"),d())]};
  assert.deepEqual(changesSince(before,{entries:[]}).map(x=>x.kind),["REMOVED_REFERENCE"]);
});

test("offline mock scan checks Github metadata only",async()=>{
  const fetcher=async(url,opts)=>({
    ok:true,
    status:200,
    json:async()=>({full_name:"org/name",archived:false,disabled:false,
      pushed_at:"2026-10-30T01:00:00Z",default_branch:"main",license:{spdx_id:"MIT"}})
  });
  const scan=await buildSnapshot({repos:[e("org/name")]}, "",fetcher);
  assert.equal(scan.entries.length,1);
  assert.equal(scan.source,"github_repository_metadata");
  assert.equal(scan.monitor,"catalogue_only_no_install");
});

test("api outage cannot silently become a successful scan",async()=>{
  const stub=async()=>({ok:false,status:403});
  await assert.rejects(()=>buildSnapshot({repos:[e("org/name")]},"",stub),/GitHub API 403/);
});
