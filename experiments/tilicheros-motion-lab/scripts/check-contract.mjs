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
assert.equal(pkg.private, true);
assert.equal(pkg.dependencies.remotion, pkg.dependencies["@remotion/cli"]);
assert.equal(pkg.dependencies.remotion, "4.0.539");
assert.match(rootCode, /id="TilicherosGamingDemo"/);
assert.match(rootCode, /durationInFrames=\{450\}/);
assert.match(rootCode, /fps=\{30\}/);
assert.match(rootCode, /width=\{1080\}/);
assert.match(rootCode, /height=\{1920\}/);
assert.match(defaults, /artworkDisclaimer:\s*"VISUAL CONCEPTUAL/);
assert.match(defaults, /productImage:\s*"assets\/product-concept\.svg"/);
assert.match(adCode, /staticFile\(content\.productImage\)/);
assert.match(adCode, /content\.artworkDisclaimer/);
for (const path of [
  "src/index.ts", "src/Root.tsx", "src/GamingAd.tsx", "src/content.ts",
  "public/assets/product-concept.svg", "blender/generate-concept.py", "README.md",
]) {
  assert.ok(await fileExists(path), "Falta " + path);
}
const illustration = await read("public/assets/product-concept.svg");
assert.ok(illustration.includes("<svg") && illustration.includes("</svg>"));
assert.ok(illustration.includes("no representa un producto disponible"));
console.log("OK: contrato visual, disclaimers, archivos y 450 frames / 30 fps = 15s");
console.log("NO confirma render de video, render Blender, compatibilidad GPU ni licencias del cliente");
