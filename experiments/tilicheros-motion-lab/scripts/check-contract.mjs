import assert from "node:assert/strict";
import {readFile, stat} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(resolve(root, path), "utf8");
const fileExists = (path) => stat(resolve(root, path)).then(s=>s.isFile(), ()=>false);

const pkg = JSON.parse(await read("package.json"));
const rootCode = await read("src/Root.tsx");
const defaults = await read("src/content.ts");
const adCode = await read("src/GamingAd.tsx");
const variants = await read("src/variants.ts");
assert.equal(pkg.private, true);
assert.equal(pkg.dependencies.remotion, pkg.dependencies["@remotion/cli"]);
assert.equal(pkg.dependencies.remotion, "4.0.539");
assert.match(rootCode, /id="TilicherosGamingDemo"/);
assert.match(rootCode, /id="TilicherosAnimeDemo"/);
assert.match(rootCode, /id="TilicherosBabyDemo"/);
assert.match(rootCode, /durationInFrames=\{450\}/);
assert.match(rootCode, /fps=\{30\}/);
assert.match(rootCode, /width=\{1080\}/);
assert.match(rootCode, /height=\{1920\}/);
assert.match(defaults, /artworkDisclaimer:\s*"VISUAL CONCEPTUAL/);
assert.match(defaults, /productImage:\s*"assets\/product-concept\.svg"/);
assert.match(adCode, /staticFile\(content\.productImage\)/);
assert.match(adCode, /content\.artworkDisclaimer/);
assert.match(adCode, /content\.eyebrow/);
assert.match(adCode, /content\.outroLabel/);
assert.match(adCode, /content\.atmosphere/);
assert.match(variants, /animeContent/);
assert.match(variants, /babyContent/);
assert.equal(pkg.scripts["render:anime"]?.includes("TilicherosAnimeDemo"), true);
assert.equal(pkg.scripts["render:baby"]?.includes("TilicherosBabyDemo"), true);
for (const path of [
  "src/index.ts", "src/Root.tsx", "src/GamingAd.tsx", "src/content.ts",
  "public/assets/product-concept.svg", "public/assets/anime-concept.svg", "public/assets/baby-concept.svg",
  "src/variants.ts", "blender/generate-concept.py", "README.md",
]) {
  assert.ok(await fileExists(path), "Falta " + path);
}
const illustration = await read("public/assets/product-concept.svg");
assert.ok(illustration.includes("<svg") && illustration.includes("</svg>"));
for (const name of ["anime", "baby"]) {
  const img = await read(`public/assets/${name}-concept.svg`);
  assert.ok(img.includes("<svg") && img.includes("</svg>"));
  assert.match(img, /no corresponde a un artículo en venta|No representa mercancía existente/);
}
assert.ok(illustration.includes("no representa un producto disponible"));
console.log("OK: contrato visual, disclaimers, archivos y 3 concept variants; 450 frames / 30 fps = 15s");
console.log("NO confirma render de video, render Blender, compatibilidad GPU ni licencias del cliente");
