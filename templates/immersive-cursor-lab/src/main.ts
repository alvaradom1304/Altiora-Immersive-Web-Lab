import { gsap } from 'gsap';
import './style.css';
import { createKinetic } from './kinetic';
import { createPointer } from './pointer';
import type { LabScene } from './scene';

type Mode = 'pending' | 'webgl' | 'no-webgl' | 'context-lost';

export interface Lab {
  destroy(): void;
  state(): Record<string, unknown>;
}

const params = new URLSearchParams(location.search);
/** Solo para pruebas: ignora prefers-reduced-motion. Exige ?debug o modo dev. */
const forceMotion = params.has('forcemotion') && (import.meta.env.DEV || params.has('debug'));

/**
 * Monta la experiencia sobre un contenedor `[data-stage]` ya renderizado en HTML.
 * El contenido nunca depende de este código: si falla, queda el póster y el DOM.
 */
export function mount(stage: HTMLElement): Lab {
  const html = document.documentElement;
  const canvas = stage.querySelector<HTMLCanvasElement>('.hero__gl');
  const status = stage.querySelector<HTMLElement>('[data-status]');
  const ac = new AbortController();
  const { signal } = ac;

  const pointer = createPointer(signal);
  const kinetic = createKinetic(stage);
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedQuery.matches && !forceMotion;
  let inView = true;
  let running = false;
  let frames = 0;

  // --- WebGL con alternativa -------------------------------------------------
  let scene: LabScene | null = null;
  let mode: Mode = 'pending';
  let destroyed = false;
  const setMode = (next: Mode) => {
    mode = next;
    html.classList.toggle('gl-ready', next === 'webgl');
    // 'pending' no añade clases: el póster se ve hasta que el primer frame 3D está listo.
    html.classList.toggle('no-webgl', next === 'no-webgl' || next === 'context-lost');
    const fallback = next === 'no-webgl' || next === 'context-lost';
    if (status) status.textContent = fallback ? 'Vista estática: WebGL no disponible' : '';
  };

  /** three.js se carga aparte: el HTML, la tipografía y el CTA no esperan al 3D. */
  const initGL = async () => {
    if (!canvas || params.has('nowebgl')) return setMode('no-webgl');
    try {
      const { createScene } = await import('./scene');
      if (destroyed) return;
      scene = createScene(canvas, {
        maxDpr: 1.5,
        onContextLost: () => setMode('context-lost'),
        onContextRestored: () => {
          setMode('webgl');
          renderOnce();
        },
      });
      scene.resize(stage.clientWidth, stage.clientHeight);
      setMode('webgl');
      renderOnce();
    } catch (err) {
      console.info('[lab] WebGL no disponible, se usa el póster estático.', err);
      scene = null;
      setMode('no-webgl');
    }
  };

  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    scene?.resize(w, h);
    kinetic.measure();
    if (!running) renderOnce();
  };

  // --- Reloj único -----------------------------------------------------------
  // gsap.ticker es el único requestAnimationFrame: lo comparten la entrada de GSAP,
  // la tipografía y el render 3D. Si se añade Lenis, conectarlo aquí con autoRaf: false.
  const tick = (_time: number, deltaMs: number) => {
    const dt = deltaMs / 1000; // damp() limita a 0.05 s
    kinetic.update(dt, pointer, true);
    if (scene && mode === 'webgl') {
      scene.update(dt, pointer.x * (pointer.coarse ? 0.5 : 1), pointer.y * (pointer.coarse ? 0.5 : 1), true);
      scene.render();
    }
    frames++;
  };

  /** Pose de reposo para movimiento reducido, resize en pausa o contexto restaurado. */
  const renderOnce = () => {
    if (scene && mode === 'webgl') {
      scene.update(0, 0, 0, false);
      scene.render();
    }
  };

  const sync = () => {
    const shouldRun = !reduced && inView && !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
    if (!running && reduced) kinetic.reset();
  };

  // --- Entrada tipográfica (GSAP solo anima .kinetic__inner) ------------------
  let introSafety = 0;
  const ctx = gsap.context(() => {
    if (reduced) return;
    // fromTo con destino explícito: si mount() se monta dos veces (StrictMode, HMR), from() puede
    // tomar como destino un estado intermedio y dejar el titular oculto.
    const intro = gsap.fromTo('.kinetic__inner', { yPercent: 110 }, {
      yPercent: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.1,
    });
    // Seguro: con la pestaña en segundo plano o a muy pocos fps, lagSmoothing puede congelar
    // la entrada. El titular nunca debe depender de que una animación termine.
    introSafety = window.setTimeout(() => intro.progress(1), 2500);
  }, stage);

  // --- Observadores y listeners ----------------------------------------------
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  io.observe(stage);
  document.addEventListener('visibilitychange', sync, { signal });
  window.addEventListener('scroll', () => kinetic.measure(), { passive: true, signal });
  reducedQuery.addEventListener(
    'change',
    (e) => {
      reduced = e.matches && !forceMotion;
      if (reduced) {
        renderOnce();
        kinetic.reset();
      }
      sync();
    },
    { signal },
  );

  setMode('pending');
  resize();
  sync();
  void initGL();

  return {
    destroy() {
      destroyed = true;
      gsap.ticker.remove(tick);
      running = false;
      ac.abort();
      clearTimeout(introSafety);
      ro.disconnect();
      io.disconnect();
      ctx.revert();
      kinetic.reset();
      scene?.dispose();
      scene = null;
      html.classList.remove('gl-ready', 'no-webgl');
    },
    state() {
      return {
        mode,
        running,
        reduced,
        inView,
        frames,
        coarse: pointer.coarse,
        pointer: { x: pointer.x, y: pointer.y },
        gl: scene?.info() ?? null,
      };
    },
  };
}

const stage = document.querySelector<HTMLElement>('[data-stage]');
if (stage) {
  const lab = mount(stage);
  // Gancho de inspección para pruebas manuales/automatizadas.
  if (import.meta.env.DEV || params.has('debug')) {
    (window as unknown as { __lab: Lab }).__lab = lab;
  }
  // HMR de Vite: desmontar antes de volver a montar evita loops y contextos duplicados.
  import.meta.hot?.dispose(() => lab.destroy());
}
