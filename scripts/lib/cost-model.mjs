function nonnegative(value, field) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error('Completa ' + field + ' con un número finito mayor o igual a cero.');
  }
  return value;
}
const rounded = value => Math.round((value + Number.EPSILON) * 100) / 100;
export function compareCosts(input) {
  if (!input || input.schema_version !== 1) throw new Error('schema_version debe ser 1.');
  if (typeof input.illustrative !== 'boolean') throw new Error('Indica si los datos son illustrative: true o false.');
  if (!/^[A-Z]{3}$/.test(input.currency ?? '')) throw new Error('Usa un único código de moneda de tres letras.');
  if (!Number.isInteger(input.horizon_months) || input.horizon_months < 1 || input.horizon_months > 120) {
    throw new Error('horizon_months debe ser un entero entre 1 y 120.');
  }
  if (typeof input.label !== 'string' || !input.label.trim()) throw new Error('Falta el nombre de la comparación.');
  const rate = nonnegative(input.hourly_cost, 'hourly_cost');
  const currentCash = nonnegative(input.current?.monthly_cash, 'current.monthly_cash');
  const currentHours = nonnegative(input.current?.monthly_hours, 'current.monthly_hours');
  const proposedCash = nonnegative(input.proposed?.monthly_cash, 'proposed.monthly_cash');
  const proposedHours = nonnegative(input.proposed?.monthly_hours, 'proposed.monthly_hours');
  const setupCash = nonnegative(input.proposed?.setup_cash, 'proposed.setup_cash');
  const setupHours = nonnegative(input.proposed?.setup_hours, 'proposed.setup_hours');
  const cashSaving = currentCash - proposedCash;
  const hoursFreed = currentHours - proposedHours;
  const capacityValue = hoursFreed * rate;
  const economicBenefit = cashSaving + capacityValue;
  const setupEquivalent = setupCash + setupHours * rate;
  const monthlyCurrentTotal = currentCash + currentHours * rate;
  const monthlyProposedTotal = proposedCash + proposedHours * rate;
  const cashHorizonNet = cashSaving * input.horizon_months - setupCash;
  const economicHorizonNet = economicBenefit * input.horizon_months - setupEquivalent;
  const cashPayback = cashSaving > 0 ? setupCash / cashSaving : null;
  const economicPayback = economicBenefit > 0 ? setupEquivalent / economicBenefit : null;
  const metrics = [cashSaving, hoursFreed, capacityValue, economicBenefit, setupEquivalent,
    monthlyCurrentTotal, monthlyProposedTotal, cashHorizonNet, economicHorizonNet];
  if (!metrics.every(Number.isFinite) || (cashPayback !== null && !Number.isFinite(cashPayback))
      || (economicPayback !== null && !Number.isFinite(economicPayback))) {
    throw new Error('Las cifras superan el rango de cálculo.');
  }
  return {
    label: input.label, illustrative: input.illustrative, currency: input.currency,
    horizon_months: input.horizon_months,
    monthly_cash_saving: rounded(cashSaving),
    monthly_hours_freed: rounded(hoursFreed),
    monthly_capacity_value: rounded(capacityValue),
    monthly_total_economic_benefit: rounded(economicBenefit),
    setup_cash: setupCash,
    setup_hours: setupHours,
    setup_economic_equivalent: rounded(setupEquivalent),
    current_monthly_total: rounded(monthlyCurrentTotal),
    proposed_monthly_total: rounded(monthlyProposedTotal),
    cash_net_over_horizon: rounded(cashHorizonNet),
    economic_net_over_horizon: rounded(economicHorizonNet),
    cash_payback_months: cashPayback === null ? null : rounded(cashPayback),
    economic_payback_months: economicPayback === null ? null : rounded(economicPayback),
    explanation: 'La capacidad es tiempo valorado, no caja. Valores negativos indican mayor coste. No sumar alternativas de un mismo gasto.'
  };
}
