import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScan } from './skill-security-gate.mjs';
const report = (score, recommendation, extra = {}) => ({
  risk_assessment: { score, recommendation },
  execution_successful: true,
  issues: [],
  ...extra
});
test('only complete successful SAFE scan may proceed to manual review', () => {
  assert.equal(evaluateScan(report(0, 'SAFE'), 0).allowed, true);
  assert.equal(evaluateScan(report(20, 'SAFE'), 0).allowed, true);
});
test('CAUTION and DO_NOT_INSTALL do not pass', () => {
  assert.equal(evaluateScan(report(21, 'CAUTION'), 0).allowed, false);
  assert.equal(evaluateScan(report(75, 'DO_NOT_INSTALL'), 1).allowed, false);
});
test('scanner failures and incomplete results fail closed', () => {
  assert.equal(evaluateScan(report(0, 'SAFE'), 1).allowed, false);
  assert.equal(evaluateScan(report(0, 'SAFE', { execution_successful: false }), 0).allowed, false);
  assert.equal(evaluateScan(null, 0).allowed, false);
  assert.equal(evaluateScan({}, 0).allowed, false);
  assert.equal(evaluateScan(report(NaN, 'SAFE'), 0).allowed, false);
});
test('unknown future recommendation fails closed', () => {
  assert.equal(evaluateScan(report(0, 'UNKNOWN'), 0).allowed, false);
});
