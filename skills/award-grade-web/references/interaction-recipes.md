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

## Humo de fluido

Fluido estable (Stam) en WebGL2: splat → vorticidad → divergencia → presión (Jacobi, 12–16 iteraciones) → resta del gradiente → advección de velocidad y densidad. Texturas RGBA16F con filtrado lineal; exige `EXT_color_buffer_float` (o `EXT_color_buffer_half_float`): si falta, devolver null y usar neblina CSS.

- Simulación ~112 px en el lado corto, densidad 320–448; el humo es blando y no necesita DPR.
- El cursor inyecta velocidad (pantallas/s, con tope) y densidad proporcional a la rapidez; emisores ambientales para que el humo exista también en táctil.
- Disipación por escena (neblina se va antes, vapor permanece).
- Mismo reloj único; pausa fuera de pantalla; `clear()` al activar movimiento reducido o pausa.
- Sin `loseContext()` al desmontar si el mismo lienzo puede volver a montarse (StrictMode).

Referencia de implementación: `components/award/smokeFluid.ts` y `FincaIntro.tsx` en La Central del Queso (rama feat/award-grade-home).

## Secuencia de fotogramas con scroll

Un «video» que avanza con el scroll: fotogramas WebP dibujados en un canvas 2D con ajuste cover.

- Carga progresiva: primero cada 30, luego 10, 5, 2, 1; se dibuja el fotograma cargado más cercano. Con `saveData`, uno de cada tres.
- Variante vertical u horizontal según el aspecto; al cambiar, recargar.
- Progreso de ScrollTrigger sin tween propio, suavizado con `damp` en el reloj único; sólo se dibuja cuando cambia el índice.
- Póster `<img>` debajo (sin JS se ve igual) y textos en DOM, en una lista ordenada.
- Movimiento reducido: un fotograma fijo por tramo, sin interpolación.
- Puertas o telones de entrada: decorativos (`aria-hidden`, `pointer-events: none`), con apertura automática, y abiertos al instante si la página carga ya desplazada.
