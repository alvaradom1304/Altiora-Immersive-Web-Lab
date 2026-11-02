import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessScan,checkSource} from './security-policy.mjs';
test('SAFE no permite afirmar certificado',()=>{const r=assessScan({risk_assessment:{score:2,severity:'LOW',recommendation:'SAFE'},issues:[]});assert.equal(r.allowed,true);assert.match(r.reason,/revisión humana/);});
test('CAUTION bloqueada',()=>assert.equal(assessScan({risk_assessment:{score:35,severity:'MEDIUM',recommendation:'CAUTION'},issues:[{}]}).allowed,false));
test('DO_NOT_INSTALL bloqueada',()=>assert.equal(assessScan({risk_assessment:{score:87,severity:'CRITICAL',recommendation:'DO_NOT_INSTALL'},issues:[{}]}).allowed,false));
test('reporte incompleto bloqueado',()=>assert.equal(assessScan({risk_assessment:{score:0,severity:'LOW',recommendation:'SAFE'}}).allowed,false));
test('riesgo fuera de rango bloqueado',()=>assert.equal(assessScan({risk_assessment:{score:101,severity:'LOW',recommendation:'SAFE'},issues:[]}).allowed,false));
test('identidad / hash externo inválido',()=>assert.ok(checkSource({id:'bad;pwd',url:'https://github.com/bad;pwd',revision:'main',license:'?',decision:'priority',installed:false,scan_status:'NOT_RUN'}).length>=2));
