import { readFile } from 'node:fs/promises';
import { validatePackage, plan, validateResult } from './core.mjs';
import { exportPackage } from './export.mjs';
import { fileURLToPath } from 'node:url';

try {
  const [command, input, host] = process.argv.slice(2);
  const manifest = await validatePackage();
  if (command === 'check') console.log('OK: manifest, instructions, DAGs and pinned sources');
  else if (command === 'check-export') {
    const report = await exportPackage({target: fileURLToPath(new URL('../../', import.meta.url)), host: 'all'});
    if (report.entries.some(e => e.action !== 'unchanged')) throw new Error('Missing host exports; run export --apply');
    console.log('OK: host exports match canonical instructions');
  }
  else if (command === 'plan' && input) console.log(JSON.stringify(plan(manifest, JSON.parse(await readFile(input, 'utf8')), host), null, 2));
  else if (command === 'validate-result' && input) {
    validateResult(manifest, JSON.parse(await readFile(input, 'utf8')));
    console.log('OK: result contract; semantic claims require artifact review');
  } else throw new Error('Usage: cli.mjs check | plan <task.json> <claude|antigravity> | validate-result <result.json>');
} catch (error) { console.error(error.message); process.exitCode = 1; }
