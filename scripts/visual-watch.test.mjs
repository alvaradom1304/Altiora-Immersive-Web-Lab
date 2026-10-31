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

test("routine P0 and P1 pushes do not flood update PRs",()=>{
  const old={entries:[normalizeEntry(e("org/name"),d())]};
  const next={entries:[normalizeEntry(e("org/name"),d("2026-10-26T00:00:00Z"))]};
  assert.deepEqual(changesSince(old,next),[]);
  next.entries[0].priority="P1";
  assert.deepEqual(changesSince({...old,entries:[{...old.entries[0],priority:"P1"}]},next),[]);
});

test("resuming activity after 90+ days is flagged for top priority",()=>{
  const old={entries:[normalizeEntry(e("org/name"),d("2025-06-01T00:00:00Z"))]};
  const next={entries:[normalizeEntry(e("org/name"),d("2026-10-29T00:00:00Z"))]};
  assert.ok(changesSince(old,next).some(c=>c.kind==="P0_ACTIVITY_RESUMED"));
});

test("stable releases are detected only after a release baseline exists",()=>{
  const a={...normalizeEntry(e("org/name"),d()),release_tag:"v1.0.0"};
  const b={...a,release_tag:"v1.1.0"};
  assert.deepEqual(changesSince({entries:[a]},{entries:[b]}).map(x=>x.kind),["STABLE_RELEASE"]);
  // Prior snapshots before release enrichment must not create false changes.
  const old={...a};delete old.release_tag;
  assert.deepEqual(changesSince({entries:[old]},{entries:[b]}),[]);
  assert.match(reportText({entries:[b]},changesSince({entries:[a]},{entries:[b]}),false),/STABLE_RELEASE/);
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
    json:async()=>url.includes("/releases/latest") ?
      {tag_name:"v2.5.0",published_at:"2026-10-30T01:00:00Z"} :
      {full_name:"org/name",archived:false,disabled:false,
      pushed_at:"2026-10-30T01:00:00Z",default_branch:"main",license:{spdx_id:"MIT"}}
  });
  const scan=await buildSnapshot({repos:[e("org/name")]}, "",fetcher);
  assert.equal(scan.entries.length,1);
  assert.equal(scan.source,"github_repository_metadata");
  assert.equal(scan.monitor,"catalogue_only_no_install");
  assert.equal(scan.entries[0].release_tag,"v2.5.0");
});

test("api outage cannot silently become a successful scan",async()=>{
  const stub=async()=>({ok:false,status:403});
  await assert.rejects(()=>buildSnapshot({repos:[e("org/name")]},"",stub),/GitHub API 403/);
});

test("release-free repos accept 404 but 403 fails clearly",async()=>{
  const stub=async url=>url.includes("/releases/latest")
    ? {ok:false,status:404}
    : {ok:true,status:200,json:async()=>d()};
  const snapshot=await buildSnapshot({repos:[e("org/name")]},"",stub);
  assert.equal(snapshot.entries[0].release_tag,null);
  const denied=async url=>url.includes("/releases/latest")
    ? {ok:false,status:403}
    : {ok:true,status:200,json:async()=>d()};
  await assert.rejects(()=>buildSnapshot({repos:[e("org/name")]},"",denied),/release metadata GitHub API 403/);
});
