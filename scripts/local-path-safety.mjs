import assert from 'node:assert/strict';
import {lstat, realpath} from 'node:fs/promises';
import {relative, isAbsolute, resolve, sep} from 'node:path';

// Check BEFORE mkdir/write. Reject junctions, dangling links and file aliases.
// The checkout and its parent directories must be controlled by the local owner.
export async function safeLocalPath(root, target) {
  root = resolve(root);
  target = resolve(target);
  const rel = relative(root, target);
  assert.ok(rel && rel !== '..' && !rel.startsWith('..'+sep) && !isAbsolute(rel), 'Path escapes workspace');
  const realRoot = await realpath(root);
  let current = root;
  for (const part of rel.split(sep)) {
    assert.ok(!/[\x00-\x1f:]/.test(part), 'Unsafe path component');
    current = resolve(current, part);
    let info;
    try { info = await lstat(current); } catch (e) { if(e.code === 'ENOENT') continue; throw e; }
    assert.ok(!info.isSymbolicLink(), 'Symbolic link or junction is not allowed');
    assert.ok(!info.isFile() || info.nlink === 1, 'Hard-linked file is not allowed');
    const actual = await realpath(current);
    const inside = relative(realRoot, actual);
    assert.ok(inside && inside !== '..' && !inside.startsWith('..'+sep) && !isAbsolute(inside), 'Resolved path escapes workspace');
  }
  return target;
}
