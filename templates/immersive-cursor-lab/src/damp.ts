/** Delta máximo por frame: evita saltos al volver de una pestaña oculta. */
export const MAX_DT = 0.05;

/**
 * Interpolación exponencial independiente de la tasa de refresco.
 * alpha = 1 - exp(-lambda * dt): el mismo lambda da la misma sensación a 60 y a 120 Hz.
 * lambda alto = respuesta rápida; bajo = más inercia.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  const alpha = 1 - Math.exp(-lambda * Math.min(dt, MAX_DT));
  return current + (target - current) * alpha;
}

export const clamp = (v: number, min = -1, max = 1) => Math.min(max, Math.max(min, v));
