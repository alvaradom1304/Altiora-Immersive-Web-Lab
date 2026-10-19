# Checklist award-grade

Cada punto se marca con evidencia (captura, comando, URL o línea de código). Lo no comprobado queda como pendiente, nunca como hecho.

## Diseño (Awwwards: Design)

- [ ] Concepto propio en una frase, derivado de la marca, no de la referencia.
- [ ] Pareja tipográfica con carácter; escala definida; `text-wrap: balance` en titulares.
- [ ] Paleta de 2 tintas + 1 acento; contraste medido (4.5:1 texto pequeño, 3:1 grande).
- [ ] Rejilla y márgenes coherentes en 375, 768, 1280 y 1920 px.
- [ ] Ningún texto recortado ni desbordado en ningún ancho.

## Usabilidad (Usability)

- [ ] CTA principal visible sin esperar animaciones ni scroll largo.
- [ ] Navegación y acciones funcionan con WebGL desactivado.
- [ ] Teclado: orden lógico, foco visible, enlace de salto.
- [ ] Táctil: sin `touch-action: none` global; el scroll nunca se secuestra.
- [ ] Carga: primer contenido útil sin esperar al 3D.

## Creatividad (Creativity)

- [ ] Un gesto memorable que sólo tiene sentido para esta marca.
- [ ] Transiciones con continuidad (objeto o color que viaja entre secciones).
- [ ] Microinteracciones en los controles (hover, foco, pulsación) coherentes con el gesto.

## Contenido (Content)

- [ ] Copy real y verificado; nada inventado (testimonios, cifras, premios).
- [ ] Imágenes reales de la marca o recreaciones identificadas como tales.
- [ ] Jerarquía: un `h1`, secciones con `h2`, landmarks.

## Desarrollo (Dev Award)

- [ ] Semántica/SEO: metadatos, Open Graph, `lang`, títulos únicos, datos estructurados si aplica.
- [ ] Animación: reloj único, `damp` dependiente del tiempo, un dueño por propiedad; entradas con `fromTo` y destino explícito (no `from` en componentes React).
- [ ] Accesibilidad: canvas decorativo `aria-hidden` y `pointer-events: none`; contenido DOM visible a lectores; `prefers-reduced-motion` respetado y escuchado en vivo.
- [ ] WPO: three.js diferido; DPR ≤ 1.5 de partida; KTX2/Draco/Meshopt; pausa fuera de vista y con pestaña oculta.
- [ ] Responsive: composición específica por proporción (no sólo escalar).
- [ ] Markup: HTML válido, sin errores ni avisos en consola.
- [ ] Teardown: tras desmontar, 0 frames, listeners retirados, recursos liberados.
- [ ] Pérdida de contexto WebGL gestionada (alternativa visible).

## Presupuesto (acordar y medir; no son garantías)

| Métrica | Punto de partida |
|---|---|
| JS antes de interacción | ≤ 300 kB gzip |
| Escena inicial | ≤ 2–3 MB |
| Draw calls | decenas |
| Texturas en móvil | ≤ 64–128 MB |
| Frame time | p95 < 16.7 ms a 60 Hz en el dispositivo objetivo |

## Puntuación del jurado interno

Escala 1–10 por criterio, como Awwwards: Diseño 40 %, Usabilidad 30 %, Creatividad 20 %, Contenido 10 %. Aparte, Dev: Semántica, Animación, Accesibilidad, WPO, Responsive, Markup. Cada nota cita evidencia. Debajo de 7 en cualquier criterio bloquea el gate M4 y produce una mejora priorizada.
