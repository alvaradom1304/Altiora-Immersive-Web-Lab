---
name: award-grade-web
description: Estándar Altiora para webs de nivel Awwwards (SOTD) con contenido accesible. Usar cuando se diseñe, construya, revise o puntúe una web inmersiva, un hero 3D, tipografía cinética, cursor interactivo o scrollytelling, o cuando haya que decidir si un proyecto merece ese nivel. Define gates por milestone, recetas técnicas y la puntuación del jurado interno.
---

# Award-grade web

Versión **1.1.0** · Altiora · basada en la [auditoría de Buttermax y comparables](../../docs/research/buttermax-audit-2026-10.md).

Objetivo: el impacto y la artesanía de los sitios premiados, sin su deuda habitual en accesibilidad. En los tres comparables auditados la accesibilidad fue la nota más baja del Dev Award; aquí es requisito de salida.

## Cuándo aplica y cuándo no

Hacer siempre el fit check antes de producir:

- **Inmersión completa**: estudios creativos, moda, cultura, lanzamientos con narrativa, marcas premium que venden una experiencia.
- **Acento**: comercio de producto, alimentación, artesanía. Hero u objeto tocable inmersivo; catálogo, carrito y pedido en interfaz convencional.
- **No aplicar**: SaaS B2B de tarea, checkout, dashboards. Con requisito AAA, evaluar criterio por criterio (2.3.3, 2.2.2) y ofrecer control para desactivar movimiento.

Si no encaja, decirlo y proponer la versión convencional de alta calidad.

## Los seis pilares

1. **Una idea, un gesto.** Un concepto propio derivado de la marca y un gesto memorable (inclinar, empujar, verter, revelar). Diez efectos sueltos restan.
2. **Tipografía como material.** Escala dramática, una pareja tipográfica con carácter, texto real en DOM. La animación nunca oculta contenido si falla.
3. **Objeto protagonista.** Un elemento 3D o 2D que responde al puntero y al scroll con inercia; jamás tapa texto de lectura ni controles.
4. **Ritmo.** Alternar planos llenos y respiro. Cada sección tiene una sola intención visual.
5. **Contraste alto y paleta corta.** Dos tintas dominantes y un acento. 4.5:1 en texto pequeño, 3:1 en texto grande.
6. **Artesanía medible.** Reloj único, limpieza de recursos, presupuesto de rendimiento acordado y medido, alternativas reales.

## Gates por milestone

Se integran con [producción por milestones](../../workflow/production.md) y el [flujo award-grade](../../workflow/award-grade.md).

| Gate | Pregunta | Evidencia mínima |
|---|---|---|
| M0 Fit | ¿Este proyecto merece inmersión, acento o nada? | Fit check escrito con tarea principal y acceso directo al CTA. |
| M1 Concepto | ¿Cuál es la idea y el gesto? | Concepto en una frase, moodboard propio, pareja tipográfica, paleta con contraste medido. |
| M2 Prototipo | ¿Se entiende y se usa sin el efecto? | Flujo navegable con WebGL desactivado y con teclado. |
| M3 Producción | ¿La técnica es sólida? | Checklist técnico de [checklist.md](references/checklist.md) completo; guardián sin errores. |
| M4 Jurado | ¿Lo premiaría Awwwards? | Puntuación del rol award-jury con evidencia y lista de mejoras priorizada. |

## Recetas técnicas

Detalle y código en [interaction-recipes.md](references/interaction-recipes.md). Plantilla ejecutable: [immersive-cursor-lab](../../templates/immersive-cursor-lab/README.md).

- `damp(current, target, lambda, dt)` con `alpha = 1 − exp(−lambda · min(dt, 0.05))`. Nunca un factor fijo por frame.
- Un solo `requestAnimationFrame`: `gsap.ticker` (o `useFrame` de R3F). Lenis con `autoRaf:false`.
- Un dueño por propiedad animada: GSAP para entradas y scroll, el tick para lo que sigue al puntero.
- Pointer normalizado a [−1, 1], reposo al salir, amplitud acotada, mitad en `pointer: coarse`.
- Foco de teclado como fuente de atención equivalente al hover.
- three.js con import dinámico tras el primer pintado; póster estático en el HTML.
- `prefers-reduced-motion`: sin seguimiento ni entradas; un frame estático. Escuchar el cambio en vivo.
- Pausar con pestaña oculta y fuera de vista; DPR ≤ 1.5 de partida; pérdida de contexto gestionada.
- Teardown completo: ticker, listeners (`AbortController`), observers, `gsap.context().revert()`, `dispose()` de lo propio.
- Seguro de entrada: ningún titular depende de que una animación termine (completar a los 2–3 s) y las entradas usan `fromTo` con destino explícito: con montaje doble `from()` puede fijar el estado oculto.

## Assets

glTF/GLB con Draco o Meshopt (medir descodificación, en worker); texturas KTX2 con variantes alta/baja; AVIF/WebP en DOM; vídeo por dispositivo y diferido. Precargar la siguiente escena, no todas. Derechos y procedencia en manifiesto.

## Entregable

Según la fase: fit check, concepto con gesto, mapa de interacción, código con comandos, informe de verificación (build, consola, mouse, reposo, resize, teclado, táctil, reduced motion, sin WebGL, teardown) y puntuación del jurado. Separar siempre OBSERVADO, INFERIDO y PROPUESTO. No prometer FPS, Lighthouse ni premios.

## Herramientas de control

- `npm run guard -- <carpeta>`: [immersive-guard](../../scripts/immersive-guard.mjs) detecta patrones de riesgo (canvas sin `aria-hidden`, varios rAF, recursos sin `dispose`, falta de reduced motion, `setState` por frame).
- En Claude Code el guardián corre como hook tras cada edición de código web y avisa sin bloquear.
