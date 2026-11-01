import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsDir = resolve(root, 'skills');

for (const name of ['analytics', 'mcp-builder', 'skill-creator']) {
  const path = resolve(skillsDir, name, 'SKILL.md');
  const text = (await readFile(path, 'utf8')).replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const headings = lines.map((l, i) => ({ l, i, m: l.match(/^(#{1,6})\s+(.*)$/) })).filter(h => h.m);
  console.log(`\n=== Empty sections in ${name} ===`);
  headings.forEach((h, idx) => {
    const next = headings[idx + 1];
    if (next && next.m[1].length <= h.m[1].length) {
      const slice = lines.slice(h.i + 1, next.i);
      if (slice.every(l => !l.trim())) {
        console.log(`Line ${h.i + 1}: ${h.l} (followed by Line ${next.i + 1}: ${next.l})`);
      }
    }
  });
}

