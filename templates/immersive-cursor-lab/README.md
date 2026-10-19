# Immersive Cursor Lab (boilerplate Altiora)

Viewport 3D (three.js) y titular cinético que siguen al puntero con interpolación dependiente del tiempo.
Todo el contenido (titular, texto, navegación, CTA) es HTML semántico; el canvas es decorativo.

Inspirado en principios observados en estudios como Buttermax (cursor que inclina la escena, tipografía
expresiva, contraste alto), **sin** reutilizar su composición, assets, paleta ni código.

## Comandos

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build a dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

Parámetros de prueba: `?nowebgl` fuerza la alternativa estática; `?debug` expone `window.__lab`
(`state()`, `destroy()`) también en el build de producción; `?debug&forcemotion` ignora `prefers-reduced-motion` solo para pruebas.

## Arquitectura

| Archivo | Responsabilidad |
| --- | --- |
| `src/damp.ts` | `damp()`: `alpha = 1 - exp(-lambda * min(dt, 0.05))`. Igual a 60 y 120 Hz. |
| `src/pointer.ts` | Objetivo del puntero en [-1, 1]; reposo al salir/levantar el dedo; atracción por foco de teclado. |
| `src/scene.ts` | Escena three.js: 1 malla protagonista + 3 `InstancedMesh` (4 draw calls), DPR ≤ 1.5, pérdida de contexto, `dispose()`. |
| `src/kinetic.ts` | Desplaza `.kinetic__line` y el CTA magnético. Único dueño de esos `transform`. |
| `src/main.ts` | `mount()`/`destroy()`: reloj único (`gsap.ticker`), reduced motion, observers, fallback, HMR. |

### Reglas que el código cumple
- **Un solo reloj**: `gsap.ticker` mueve la entrada de GSAP, la tipografía y el render. Si se añade Lenis,
  usar `autoRaf: false` y llamar a `lenis.raf()` desde el mismo ticker.
- **Un dueño por propiedad**: GSAP anima `.kinetic__inner` (entrada); el tick escribe `.kinetic__line`.
- **Sin estado por frame en frameworks**: nada de `setState` en el loop (si se porta a React/R3F, usar refs).
- **Pausa**: el ticker se retira con la pestaña oculta, el hero fuera de vista o `prefers-reduced-motion`.
- **Movimiento reducido**: sin entrada animada ni seguimiento; un frame estático en reposo. Cambia en vivo.
- **Táctil / puntero grueso**: mitad de amplitud, sin imán en el CTA, sin `touch-action: none` (no se bloquea el scroll).
- **Teclado**: enfocar un elemento `[data-attract]` orienta la escena hacia él.
- **Sin WebGL** (o solo por software, `failIfMajorPerformanceCaveat`): póster CSS y el mismo DOM.
- **Limpieza**: `destroy()` retira el ticker, aborta listeners (`AbortController`), desconecta observers,
  revierte el contexto GSAP y libera geometrías, materiales, instancias y renderer.

## Siguiente paso al usarlo en un proyecto real
1. Sustituir primitivas por un GLB propio (Draco o Meshopt para geometría, KTX2 para texturas) cargado tras el primer pintado.
2. Definir presupuesto por escena (peso, draw calls, memoria, frame time p95) y medirlo en el dispositivo objetivo.
3. Portar a React Three Fiber solo si el producto ya es React; a Next.js si necesita rutas/SSR de contenido.
