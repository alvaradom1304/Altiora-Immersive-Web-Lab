import { damp } from './damp';
import type { PointerTarget } from './pointer';

/**
 * Tipografía y CTA que responden al puntero escribiendo `transform` directamente.
 * Propiedad única: este módulo es el único dueño del transform de `.kinetic__line` y de `.cta`;
 * la entrada con GSAP anima `.kinetic__inner`, así nunca compiten.
 */
export interface Kinetic {
  update(dt: number, p: PointerTarget, motion: boolean): void;
  /** Recalcula posiciones en reposo (resize/scroll), nunca dentro del tick. */
  measure(): void;
  reset(): void;
}

const MAX_SHIFT = 22; // px: el titular se mueve sin salirse de su columna
const MAGNET_RADIUS = 120; // px alrededor del CTA
const MAGNET_PULL = 0.28;

export function createKinetic(root: HTMLElement): Kinetic {
  const lines = [...root.querySelectorAll<HTMLElement>('.kinetic__line')].map((el) => ({
    el,
    depth: Number(el.dataset.depth ?? 1),
    x: 0,
    y: 0,
  }));
  const cta = root.querySelector<HTMLElement>('.cta');
  const magnet = { x: 0, y: 0, cx: 0, cy: 0 };

  const measure = () => {
    if (!cta) return;
    const r = cta.getBoundingClientRect();
    // Restar el desplazamiento actual para obtener el centro en reposo.
    magnet.cx = r.left + r.width / 2 - magnet.x;
    magnet.cy = r.top + r.height / 2 - magnet.y;
  };

  return {
    measure,
    update(dt, p, motion) {
      // Puntero grueso: menos amplitud para no estorbar la lectura en móvil.
      const amp = motion ? (p.coarse ? 0.5 : 1) * MAX_SHIFT : 0;
      for (const l of lines) {
        l.x = damp(l.x, p.x * amp * l.depth, 6, dt);
        l.y = damp(l.y, -p.y * amp * 0.5 * l.depth, 6, dt);
        l.el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0)`;
      }

      if (!cta) return;
      let tx = 0;
      let ty = 0;
      if (motion && !p.coarse && p.active) {
        const dx = p.px - magnet.cx;
        const dy = p.py - magnet.cy;
        if (Math.hypot(dx, dy) < MAGNET_RADIUS) {
          tx = dx * MAGNET_PULL;
          ty = dy * MAGNET_PULL;
        }
      }
      magnet.x = damp(magnet.x, tx, 10, dt);
      magnet.y = damp(magnet.y, ty, 10, dt);
      cta.style.transform = `translate3d(${magnet.x.toFixed(2)}px, ${magnet.y.toFixed(2)}px, 0)`;
    },
    reset() {
      for (const l of lines) {
        l.x = l.y = 0;
        l.el.style.removeProperty('transform');
      }
      magnet.x = magnet.y = 0;
      cta?.style.removeProperty('transform');
    },
  };
}
