#!/usr/bin/env node
/**
 * Altiora Visual Tech Scout, metadata-only continuous improvement.
 * No third-party code download/execute; no installs, merges or publishes.
 */
import assert from "node:assert/strict";
import {readFile, writeFile, mkdir} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const CATALOG = resolve(ROOT, "references/visual-libraries-2026.json");
const OUTPUT = resolve(ROOT, "continuity/visual-watch/latest.json");
const REVIEW = resolve(ROOT, "continuity/visual-watch/review.md");

export function normalizeEntry(entry, data) {
  assert.match(entry.id, /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  assert.ok(data && typeof data === "object");
  const license = data.license?.spdx_id || "UNVERIFIED";
  return {
    id: entry.id,
    priority: entry.priority,
    decision: entry.decision,
    archived: Boolean(data.archived),
    disabled: Boolean(data.disabled),
    last_push: data.pushed_at || null,
    license,
    default_branch: data.default_branch || null,
    canonical_repo: data.full_name || entry.id,
    // Latest stable GitHub release (not necessarily a safe package upgrade).
    release_tag: null,
    release_published_at: null
  };
}

export function changesSince(previous, current) {
  const old = new Map((previous?.entries || []).map(x => [x.id, x]));
  const changes = [];
  for (const after of current.entries) {
    const before = old.get(after.id);
    if (!before) {
      changes.push({id: after.id, kind: "NEW_REFERENCE", priority: after.priority});
      continue;
    }
    for (const field of ["archived", "disabled", "license", "default_branch", "canonical_repo"]) {
      if (before[field] !== after[field]) changes.push({
        id: after.id, kind: field.toUpperCase(), priority: after.priority,
        previous: before[field] ?? null, current: after[field] ?? null
      });
    }
    // Release monitoring: suppress false RELEASE_CHANGE when migrating old snapshots
    // that did not yet include release fields.
    if (Object.hasOwn(before, "release_tag") &&
        before.release_tag !== after.release_tag) {
      changes.push({
        id: after.id, kind: "STABLE_RELEASE", priority: after.priority,
        previous: before.release_tag ?? null, current: after.release_tag ?? null
      });
    }
    // Routine pushes aren't an actionable update signal. Only flag a P0 repo
    // that resumes activity after 90+ days of inactivity.
    const priorMs = Date.parse(before.last_push ?? "");
    const nextMs = Date.parse(after.last_push ?? "");
    if (after.priority === "P0" && Number.isFinite(priorMs) &&
        Number.isFinite(nextMs) && nextMs > priorMs &&
        Date.now() - priorMs > 90 * 86400000 &&
        nextMs - priorMs > 90 * 86400000) {
      changes.push({
        id: after.id, kind: "P0_ACTIVITY_RESUMED", priority: after.priority,
        previous: before.last_push, current: after.last_push
      });
    }
  }
  for (const before of previous?.entries || []) {
    if (!current.entries.some(x => x.id === before.id)) {
      changes.push({id:before.id, kind:"REMOVED_REFERENCE", priority:before.priority});
    }
  }
  return changes;
}

export function reportText(current, changes, isBaseline) {
  const alerts = changes.filter(c=>["ARCHIVED","DISABLED","LICENSE","STABLE_RELEASE"].includes(c.kind));
  return [
    "# Altiora · Visual Tech Scout — revisión de repositorios",
    "",
    "**Tipo:** " + (isBaseline ? "línea base inicial" : "cambios relevantes desde la última línea base fusionada"),
    "**Total examinado:** " + current.entries.length,
    "**Cambios detectados:** " + changes.length,
    "**Alertas de riesgo:** " + alerts.length,
    "",
    "Este reporte usa metadatos públicos de GitHub, incluida la última versión estable de repositorios P0/P1. **No certifica seguridad, licencias de dependencias, ni compatibilidad comercial**.",
    "",
    "## Cambios",
    ...(changes.length ? changes.map(c =>
      "- " + c.kind + " — [" + c.id + "](https://github.com/" + c.id + ") (" + c.priority + ")" +
      (c.previous !== undefined ? ": " + JSON.stringify(c.previous) + " → " + JSON.stringify(c.current) : "")
    ) : ["Sin cambios relevantes."]),
    "",
    "## Protocolo para visual-tech-scout",
    "1. Priorizar ARCHIVED, DISABLED, LICENSE y STABLE_RELEASE; toda versión requiere revisar changelog, seguridad y ruptura de API.",
    "2. Inspeccionar changelog, versión estable, derechos comerciales y CVEs antes de proponer un cambio.",
    "3. Crear prueba aislada del producto y comparar calidad, rendimiento, accesibilidad y complejidad.",
    "4. Si el cambio aporta valor medido, crear otra PR para instalación o mejora, con rollback y QA.",
    "5. No actualizar packages, addons, servidores MCP, firmas o credenciales solo por un cambio en GitHub.",
    "6. Si el flujo falla, conservar evidencia del job y declarar error, no darlo por verificado.",
    "",
    "## Estado",
    "- Metadatos: examinados si el job terminó correctamente.",
    "- Análisis humano/técnico de releases: PENDIENTE.",
    "- Nuevas librerías instaladas: NINGUNA.",
    "- Actualización autónoma de código de cliente: DESACTIVADA.",
    ""
  ].join("\n");
}

async function fetchRepo(entry, token, fetcher=fetch) {
  const endpoint="https://api.github.com/repos/"+entry.id.split("/").map(encodeURIComponent).join("/");
  const headers={
    "Accept":"application/vnd.github+json",
    "User-Agent":"altiora-visual-tech-scout",
    "X-GitHub-Api-Version":"2022-11-28"
  };
  if(token) headers.Authorization="Bearer "+token;
  const ctrl=new AbortController();
  const timeout=setTimeout(()=>ctrl.abort(),10000);
  try {
    const resp=await fetcher(endpoint,{headers,signal:ctrl.signal,redirect:"follow"});
    if(!resp.ok) throw Error(entry.id+": GitHub API "+resp.status+" (rate limit or permission check)");
    return normalizeEntry(entry,await resp.json());
  } finally {clearTimeout(timeout);}
}

async function fetchLatestStableRelease(entry, token, fetcher=fetch) {
  // Only metadata. 404 is normal for repositories that publish no GitHub releases.
  const endpoint = "https://api.github.com/repos/" +
    entry.id.split("/").map(encodeURIComponent).join("/") + "/releases/latest";
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "altiora-visual-tech-scout",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) headers.Authorization = "Bearer " + token;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetcher(endpoint, {headers, signal: ctrl.signal, redirect: "follow"});
    if (res.status === 404) return {release_tag: null, release_published_at: null};
    if (!res.ok) throw Error(entry.id + ": release metadata GitHub API " + res.status);
    const data = await res.json();
    if (typeof data.tag_name !== "string" || !data.tag_name.trim())
      throw Error(entry.id + ": invalid release response");
    return {
      release_tag: data.tag_name.slice(0, 128),
      release_published_at: data.published_at || null
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function buildSnapshot(catalog, token, fetcher=fetch) {
  assert.ok(catalog?.repos?.length>0,"Catálogo no válido");
  const ids = new Set();
  for (const e of catalog.repos) {
    assert.ok(!ids.has(e.id),"Duplicado: "+e.id);
    ids.add(e.id);
  }
  const entries = new Array(catalog.repos.length);
  let cursor=0;
  const worker=async()=>{
    while(cursor<catalog.repos.length) {
      const i=cursor++;
      const entry = catalog.repos[i];
      const meta = await fetchRepo(entry, token, fetcher);
      if (entry.priority === "P0" || entry.priority === "P1") {
        Object.assign(meta, await fetchLatestStableRelease(entry, token, fetcher));
      }
      entries[i] = meta;
    }
  };
  await Promise.all(Array.from({length:5},()=>worker()));
  return {schema_version:1,source:"github_repository_metadata",monitor:"catalogue_only_no_install",entries};
}

async function main() {
  const flags=process.argv.slice(2);
  assert.ok(flags.length<=1 && (flags.length===0||["--write","--json"].includes(flags[0])),"Use --write or --json");
  const catalog=JSON.parse(await readFile(CATALOG,"utf8"));
  let previous=null;
  try{previous=JSON.parse(await readFile(OUTPUT,"utf8"));}catch(e){if(e.code!=="ENOENT")throw e;}
  const current=await buildSnapshot(catalog,process.env.GITHUB_TOKEN||"");
  const diff=changesSince(previous,current);
  const baseline=previous===null;
  const md=reportText(current,diff,baseline);
  if(flags.includes("--write")) {
    if(!baseline && diff.length===0) {
      process.stdout.write("NO_CHANGES: metadata reviewed; no update PR needed.\n");
    }else{
      await mkdir(dirname(OUTPUT),{recursive:true});
      await writeFile(OUTPUT,JSON.stringify(current,null,2)+"\n");
      await writeFile(REVIEW,md);
      process.stdout.write("CHANGES_FOUND: "+diff.length+"; updated review + snapshot.\n");
    }
  }else if(flags.includes("--json")) process.stdout.write(JSON.stringify({baseline,changes:diff,snapshot:current},null,2)+"\n");
  else process.stdout.write(md);
  if(process.env.GITHUB_STEP_SUMMARY) {
    const {appendFile}=await import("node:fs/promises");
    await appendFile(process.env.GITHUB_STEP_SUMMARY,md+"\n");
  }
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(e=>{process.stderr.write("VISUAL_SCOUT_FAILED: "+e.message+"\n");process.exitCode=1;});
}
