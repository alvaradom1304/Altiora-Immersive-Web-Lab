#!/usr/bin/env node
// Compatibility entry point: no global CLI registration or package installs.
import {main} from './setup-after-effects-access.mjs';
main(process.argv.slice(2).map(x=>x==='--plan'?'--check':x)).catch(e=>{
  process.stderr.write('AE_CLIENT_CONFIG: '+e.message+'\n');process.exitCode=1;
});
