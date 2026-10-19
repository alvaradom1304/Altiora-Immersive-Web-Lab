# Recetas de interacción

Código probado en la plantilla [immersive-cursor-lab](../../../templates/immersive-cursor-lab/README.md) (build y navegador, 18 oct 2026).

## Interpolación dependiente del tiempo

```ts
export const MAX_DT = 0.05;
export function damp(current: number, target: number, lambda: number, dt: number) {
  const alpha = 1 - Math.exp(-lambda * Math.min(dt, MAX_DT));
  return current + (target - current) * alpha;
}
```

`lambda` orientativo: 3–4 para objetos pesados, 6 para tipografía, 10 para un CTA magnético. Buttermax usa la forma equivalente `1 − exp(log(1 − t) · hzMultiplier)`.

## Reloj único con GSAP

```ts
const tick = (_t: number, deltaMs: number) => {
  const dt = deltaMs / 1000;
  kinetic.update(dt, pointer);
  scene.update(dt, pointer.x, pointer.y);
  scene.render();
};
gsap.ticker.add(tick);             // y gsap.ticker.remove(tick) al pausar o desmontar
// Lenis opcional: new Lenis({ autoRaf: false }); dentro del tick: lenis.raf(performance.now())
```

Con R3F, `useFrame` ya es el reloj: GSAP debe usar `gsap.ticker.remove(gsap.updateRoot)` y llamarse desde `useFrame` si se quiere un solo rAF, o aceptarse dos relojes sincronizados documentándolo.

## Puntero

- Normalizar respecto al viewport o al contenedor real: `x = clientX / innerWidth * 2 − 1`, `y = 1 − clientY / innerHeight * 2`.
- Reposo en `pointerleave` del documento, `blur`, `pointercancel` y `pointerup` táctil.
- `pointer: coarse` → amplitud 0.5 y sin efectos magnéticos.
- `focusin` en `[data-attract]` con `:focus-visible` → la escena mira al control.

## Pausa y presupuesto

```ts
const shouldRun = !reduced && inView && !document.hidden;
```

`IntersectionObserver` sobre el escenario, `visibilitychange`, `matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', …)`.

## WebGL progresivo y alternativa

```ts
const { createScene } = await import('./scene');   // three.js fuera del bundle inicial
new WebGLRenderer({ canvas, alpha: true, failIfMajorPerformanceCaveat: true });
canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); showPoster(); });
```

El póster es CSS o una imagen AVIF en el HTML, visible hasta el primer frame.

## Teardown

```ts
gsap.ticker.remove(tick); ac.abort(); ro.disconnect(); io.disconnect();
ctx.revert(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
```

No liberar recursos compartidos que otra escena siga usando.

## Seguro de entrada

```ts
// fromTo con destino explícito, nunca from() en componentes que pueden montarse dos veces.
const intro = gsap.fromTo('.line__inner', { yPercent: 110 }, { yPercent: 0, stagger: 0.08 });
setTimeout(() => intro.progress(1), 2500);  // pestaña en segundo plano o pocos fps
```

Observado en La Central del Queso (Next.js, React StrictMode): `gsap.from()` tras el montaje doble tomó como destino el estado oculto; dos líneas del titular quedaron invisibles incluso después de `progress(1)`. `fromTo` lo resuelve.

En la plantilla Vite (sin StrictMode) también se observó una entrada incompleta con el panel del navegador oculto (~5 fps); la causa (throttling o `lagSmoothing`) es una inferencia no comprobada. El seguro `progress(1)` la resolvió en la prueba siguiente.

## Física

Interpolación y muelles bastan para inclinación y parallax. Verlet o un motor físico sólo para tela, cuerdas, colisiones o lanzar objetos; integrar con paso fijo y subpasos.
