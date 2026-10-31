# Matriz de producción audiovisual profesional · Altiora V2

**Última revisión documental:** 2026-10-30. Los repositorios se catalogan, no se instalan automáticamente. La web, el vídeo y las escenas 3D exigen pipelines distintos.

## Seleccionar el pipeline más pequeño que resuelve el brief

| Entregable | Pipeline recomendado a evaluar | Evitar | Criterios de aceptación |
|---|---|---|---|
| Reel o anuncio 9:16 con variantes | Storyboard → producto real → Remotion (existente) → FFmpeg export → revisión humana | Simular stock, logos o características | 1080×1920 master, safe area, CTA, audio/subtítulos, legibilidad y licencias |
| Hero 3D para ecommerce | Fotografía/product CAD → Blender → glTF Validator → glTF Transform/Draco o meshoptimizer → Three/R3F | Volver a modelar cada frame en React | GLB validado, PBR inspeccionado, WebGL fallback, peso medido, accesibilidad |
| Finca cinematográfica con scroll | Discovery → blocking Blender → texturas/MaterialX solo si compatible → glTF → R3F/GSAP → QA móvil | USD/VDB sin necesidad y shaders duplicados | cámara sin saltos, paisaje creíble, FPS medido, scroll reducido, compra operativa |
| Motion gráfico para explicar un proceso | Storyboard → Manim o Motion Canvas o Remotion → FFmpeg | Usar un motor 3D para texto 2D | precisión del contenido, subtítulos, claridad en móvil |
| VFX atmosféricos offline | Blender Cycles/Eevee o OpenVDB → pases EXR → Natron/AE/Premiere → OCIO → export | Mandar volúmenes masivos al navegador | AOVs reproducibles, color consistente, coste de render, derechos |
| Motion interactivo SVG | SVG/CSS → Rive o dotLottie (según estados) | Añadir Three.js por animar un icono | accesibilidad, tamaño de archivo, fallback, reduced motion |
| Video editorial en Adobe | Assets → After Effects/Premiere (si conectados) → OpenTimelineIO cuando el adaptador sea adecuado → FFmpeg | Creer que OTIO equivale al proyecto .prproj completo | roundtrip, audio sync, codec, reel timeline, permisos |
| Escena 3D empresarial compleja | Blender/USD/MaterialX (opcional) → validación de geometría → export para destino | Convertir USD directo a GLB sin revisión | unidades, instancias, materiales, animaciones, derechos |

## Capas compatibles y alternativas

- **Blender + glTF 2.0** es la ruta prioritaria para 3D en la web. OpenUSD se usa solo cuando hay múltiples escenas/variantes o un pipeline de DCC que lo justifique.
- **Three.js/R3F, Babylon.js y PlayCanvas** son *opciones de motor*, no dependencias para instalar simultáneamente.
- **GSAP, Motion, Anime.js, React Spring** compiten o asumen responsabilidades delimitadas; una escena tiene un solo reloj principal.
- **Rive y Lottie/dotLottie** son opciones para ilustraciones vectoriales. Rive sirve para máquinas de estados; Lottie para animaciones de exportación.
- **Remotion, Manim, Motion Canvas** sirven diferentes perfiles de producción por código, no son garantía de calidad artística por sí mismos.
- **OCIO** exige conocer espacio de entrada, espacio de trabajo y conversión final; el color no debe cambiar arbitrariamente entre Blender y video.
- **Adobe UXP** (Photoshop y Premiere) requiere apps, herramientas del desarrollador y versiones compatibles. CEP queda en HOLD para proyectos nuevos.
- **Kdenlive, Natron, OpenToonz y OBS** son alternativas o referencias de desktop, no puentes MCP configurados.

## Escala de decisión

Cada candidato se califica 0–5 en: valor visual, mantenimiento/soporte, licencia comercial, compatibilidad, rendimiento/seguridad, portabilidad a otras IAs. Anotar evidencia y versión. Una licencia desconocida = revisión obligatoria antes de adopción. Un servidor MCP no revisado = HOLD.

## Hitos y gates

1. Brief y derechos comprobables — **G0**.
2. Prueba mínima con assets originales y referencias — **G1**.
3. Producción fuente editable (blend, TSX, AE, SVG) — **G2**.
4. Export / evaluación visual / rendimiento / compatibilidad — **G3**.
5. Aprobación del cliente, legalidad comercial y publicación — **G4**.

**No confundir:** catálogo incorporado ≠ librería instalada ≠ aplicación conectada ≠ pipeline renderizado ≠ producto comercial aprobado.

## Fuentes internas

- [Catálogo visual de GitHub](../../references/visual-libraries-2026.json)
- [Catálogo fundacional Three/R3F](../../references/repositories.json)
- [Router y contrato de handoff](ROUTER.md)
- [Workflow multi-IA](../../docs/workflows/visual-production-multi-ai.md)
