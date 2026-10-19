import { clamp } from './damp';

/**
 * Objetivo del puntero normalizado a [-1, 1] respecto al viewport (+y hacia arriba).
 * Solo guarda objetivos: la interpolación ocurre en el reloj único de main.ts.
 */
export interface PointerTarget {
  x: number;
  y: number;
  /** Coordenadas en píxeles del último evento, para efectos locales (CTA magnético). */
  px: number;
  py: number;
  /** true mientras hay un puntero activo sobre la página (ratón dentro o dedo apoyado). */
  active: boolean;
  coarse: boolean;
}

export function createPointer(signal: AbortSignal, attractSelector = '[data-attract]'): PointerTarget {
  const coarseQuery = window.matchMedia('(pointer: coarse)');
  const state: PointerTarget = { x: 0, y: 0, px: -1e4, py: -1e4, active: false, coarse: coarseQuery.matches };

  const setFromClient = (cx: number, cy: number) => {
    state.px = cx;
    state.py = cy;
    state.x = clamp((cx / window.innerWidth) * 2 - 1);
    state.y = clamp(1 - (cy / window.innerHeight) * 2);
  };
  const rest = () => {
    state.x = 0;
    state.y = 0;
    state.px = state.py = -1e4;
    state.active = false;
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      // En táctil solo hay pointermove mientras el dedo está apoyado; no bloqueamos el scroll.
      setFromClient(e.clientX, e.clientY);
      state.active = true;
    },
    { passive: true, signal },
  );
  window.addEventListener('pointerdown', (e) => setFromClient(e.clientX, e.clientY), { passive: true, signal });
  // Táctil: al levantar el dedo o cuando el navegador toma el gesto para hacer scroll, volver al reposo.
  const touchRest = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') rest();
  };
  window.addEventListener('pointerup', touchRest, { passive: true, signal });
  window.addEventListener('pointercancel', rest, { passive: true, signal });
  // Ratón sale de la ventana.
  document.documentElement.addEventListener('pointerleave', rest, { passive: true, signal });
  window.addEventListener('blur', rest, { signal });

  // Teclado: enfocar un control atrae la escena hacia él, sin depender del hover.
  document.addEventListener(
    'focusin',
    (e) => {
      const el = e.target instanceof Element ? e.target.closest(attractSelector) : null;
      if (!el || !el.matches(':focus-visible')) return;
      const r = el.getBoundingClientRect();
      setFromClient(r.left + r.width / 2, r.top + r.height / 2);
      state.active = true;
    },
    { signal },
  );
  document.addEventListener(
    'focusout',
    (e) => {
      if (e.target instanceof Element && e.target.closest(attractSelector)) rest();
    },
    { signal },
  );

  coarseQuery.addEventListener('change', (e) => (state.coarse = e.matches), { signal });
  return state;
}
