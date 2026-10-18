import test from 'node:test';
import assert from 'node:assert/strict';
import { compareCosts } from './lib/cost-model.mjs';

const baseline = () => ({
  schema_version: 1, illustrative: true, label: 'Caso ficticio', currency: 'USD',
  horizon_months: 12, hourly_cost: 20,
  current: { monthly_cash: 30, monthly_hours: 1 },
  proposed: { monthly_cash: 12, monthly_hours: 2, setup_cash: 40, setup_hours: 3 }
});

test('una factura menor puede empeorar el coste total al añadir mantenimiento', () => {
  const result = compareCosts(baseline());
  assert.equal(result.monthly_cash_saving, 18);
  assert.equal(result.monthly_hours_freed, -1);
  assert.equal(result.monthly_total_economic_benefit, -2);
  assert.equal(result.cash_net_over_horizon, 176);
  assert.equal(result.economic_net_over_horizon, -124);
  assert.equal(result.cash_payback_months, 2.22);
  assert.equal(result.economic_payback_months, null);
});
test('resta la inversión una sola vez y separa tiempo de caja', () => {
  const input = baseline();
  input.current = { monthly_cash: 50, monthly_hours: 3 };
  input.proposed = { monthly_cash: 10, monthly_hours: 1, setup_cash: 80, setup_hours: 2 };
  const result = compareCosts(input);
  assert.equal(result.monthly_cash_saving, 40);
  assert.equal(result.monthly_capacity_value, 40);
  assert.equal(result.cash_net_over_horizon, 400);
  assert.equal(result.economic_net_over_horizon, 840);
  assert.equal(result.economic_payback_months, 1.5);
});
test('no declara recuperación cuando no hay beneficio recurrente', () => {
  const input = baseline();
  input.current = { monthly_cash: 0, monthly_hours: 0 };
  input.proposed = { monthly_cash: 0, monthly_hours: 0, setup_cash: 0, setup_hours: 0 };
  const result = compareCosts(input);
  assert.equal(result.monthly_cash_saving, 0);
  assert.equal(result.cash_payback_months, null);
  assert.equal(result.economic_payback_months, null);
});
test('campos vacíos y tipos incorrectos no se convierten en costes cero', () => {
  for (const invalid of [null, undefined, '', false, '12', -1, Infinity, NaN]) {
    const input = baseline();
    input.proposed.monthly_cash = invalid;
    assert.throws(() => compareCosts(input), /proposed.monthly_cash/);
  }
});
test('rechaza horizontes inválidos y obliga a identificar datos ficticios', () => {
  for (const months of [0, -1, 1.5, 121, null]) {
    const input = baseline(); input.horizon_months = months;
    assert.throws(() => compareCosts(input), /horizon_months/);
  }
  const input = baseline(); delete input.illustrative;
  assert.throws(() => compareCosts(input), /illustrative/);
});
test('conserva costes mayores y no inventa ahorro sobre una alternativa gratuita', () => {
  const input = baseline();
  input.current.monthly_cash = 0;
  const result = compareCosts(input);
  assert.equal(result.monthly_cash_saving, -12);
  assert.equal(result.cash_payback_months, null);
  assert.ok(result.economic_net_over_horizon < 0);
});
