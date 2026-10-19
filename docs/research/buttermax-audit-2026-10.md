# Auditoría Buttermax y comparables Awwwards (octubre 2026)

Fecha de inspección: 18 oct 2026. Herramienta: Chromium del panel de Claude (viewport 1024×768, GPU AMD Vega 3, WebGL 2). Se cargó la página, se rechazaron cookies no esenciales y se leyeron red, globales de `window` y cadenas de los bundles servidos. No se descargó ni ejecutó código fuera de la página.

Etiquetas: **OBSERVADO** (visto en red, bundle, DOM o fuente pública), **INFERIDO** (deducción sin prueba directa), **PROPUESTO** (recomendación Altiora).

## Arquitectura de buttermax.net

| Capa | Evidencia | Lectura |
|---|---|---|
| Páginas | OBSERVADO: `/_next/static/chunks/pages/_app-*.js`, `__BUILD_MANIFEST`, `_next/data/*/index.json` | Next.js pages router con contenido del CMS (`storage.googleapis.com/bx-site-cms`). |
| Motor 3D | OBSERVADO: globales `Hydra`, `Renderer`, `RenderManager`, `GLUI`, `GLText`, `HydraBloom`, `MouseFluid`; `window.THREE` indefinido; WebGL 2, `antialias:false`, `powerPreference:"high-performance"` | Motor propietario, no Three.js. |
| Editor | OBSERVADO: `UIL_ID="at-buttermax-pf"`, `/assets/data/uil.*.json` (209 kB) | Escenas, cámaras, shaders y toggles de física exportados desde un editor. |
| Autoría | OBSERVADO: Awwwards acredita a Active Theory (`/sites/buttermax`, SOTD 5 ene 2024) | INFERIDO: el prefijo `at-` coincide. Sin documentación pública de Hydra. |
| Hilos | OBSERVADO: 4 × `hydra-thread.js`, `DracoThread`, `OffscreenCanvas` | Descodificación en workers. |
| Animación DOM | OBSERVADO: `gsapVersions=["3.12.1"]`, Lenis (`data-lenis-prevent`), framer-motion, Lottie | Tres sistemas de animación conviven. |
| Sin WebGL | OBSERVADO: `NoGLPolyfill` (contexto con funciones vacías) | INFERIDO: evita errores pero el texto visible depende de GL. |

## Sistema de interacción

- OBSERVADO: `Mouse` expone `normal` (0–1), `tilt` (−1…1), `delta` y `velocity`.
- OBSERVADO: lerp normalizado por refresco: `framerateNormalizeLerpAlpha(t) = 1 − exp(log(1 − t) · FRAME_HZ_MULTIPLIER)`. Bucle global `Render` con `REFRESH_RATE`, `capFPS`, `setTimeScale`.
- OBSERVADO: objeto 3D del hero inclinado hacia el cursor; `MouseFluid` inyecta la velocidad del ratón en un FBO de fluido leído por los shaders (`tFluid`). Menor tamaño en móvil.
- OBSERVADO: `Interaction3D` hace raycast y cambia el cursor a `pointer` sobre mallas clicables.
- OBSERVADO: scroll propio con inercia ×0.9 por frame, además de Lenis.
- OBSERVADO: texto MSDF en GPU (`/fonts/Decagram-SmBd.json`, `MSDFTextureShader`), utilidades `SplitText`, `FitText`, `BalanceText`.
- OBSERVADO: el motor trae `Physics.instance().createFromShapes()` y tweens con `spring`/`damping`. INFERIDO: en la portada lo visible se explica con lerp, muelles y fluido; no se verificaron cuerpos rígidos activos.

## Accesibilidad y carga

- OBSERVADO: 193/193 nodos de texto de `<main>` con `visibility:hidden` (el texto visible se pinta en GL). Sin `h1`–`h3`. Botón de menú y logo sin nombre accesible. Títulos duplicados por el hover.
- INFERIDO: con `visibility:hidden` el texto sale del árbol de accesibilidad de Chromium; pendiente de confirmar con lector de pantalla. Awwwards Dev Award: Accesibilidad 6.60.
- OBSERVADO: manifiesto de 754 ficheros con 324 `.ktx2` junto a sus `.jpg`/`.png` y variantes `-high`/`-low`.
- OBSERVADO: ~8 MB transferidos en el hilo principal; `app.js` 217 kB (1.08 MB sin comprimir); vídeo `reel_desktop.mp4` de 7.4 MB como textura. INFERIDO: geometría y texturas se piden desde workers y no se midieron.

## Comparables

| Sitio | Awwwards | Dev Award | Stack observado |
|---|---|---|---|
| Buttermax (Active Theory) | SOTD 5 ene 2024 · 7.49 | 7.41 · Accesib. 6.60 · Anim. 8.60 | Next.js + Hydra, GSAP 3.12.1, Lenis, Lottie, framer-motion |
| Lusion v3 (Lusion) | SOTD 2 oct 2023 · 8.25 | 8.41 · Accesib. 7.40 · Anim. 10 | Astro + three.js r158, un `h1`, sin GSAP/Lenis en el bundle principal |
| Igloo Inc (abeto, Bureaux) | SOTD 23 jul 2024 · 7.92 | 7.66 · Accesib. 6.60 · Anim. 9.60 | Svelte en la entrada; resto no verificado |

INFERIDO: en los tres la accesibilidad es la nota más baja y la animación la más alta. PROPUESTO: Altiora compite con el mismo impacto y contenido DOM accesible.

## Qué se replica y qué no

PROPUESTO, replicar: reloj único con interpolación dependiente del tiempo, un objeto protagonista que responde al gesto, tipografía enorme como material gráfico, un gesto memorable (no diez), texturas KTX2 con variantes por dispositivo, descodificación en workers, carga progresiva.

No copiar: el amarillo #FFD600, la pareja grotesca + script del logotipo, los dispositivos modelados, la composición del hero, assets ni código.

## Fuentes

- https://buttermax.net/ (inspección directa)
- https://www.awwwards.com/sites/buttermax
- https://www.awwwards.com/inspiration/contact-page-buttermax
- https://www.awwwards.com/sites/lusion-v3 y https://lusion.co/
- https://www.awwwards.com/sites/igloo-inc y https://www.igloo.inc/
