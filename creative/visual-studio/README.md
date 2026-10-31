# Altiora Visual Studio · Arquitectura de expansión

> Estado: diseño y catálogo en revisión. Esta carpeta **no** instala Blender, Adobe, plugins ni servidores MCP. Primero elegir la herramienta adecuada; después implementar una escena o anuncio demostrable.

## Expansión profesional de referencias (V2)

El [catálogo visual](../../references/visual-libraries-2026.json) contiene **56 repositorios evaluables**, entre ellos 33 nuevas referencias de OpenColorIO, MaterialX, OpenUSD, OpenVDB, FFmpeg, Blender, shaders y motores web. [Matriz de producción](PRODUCTION-MATRIX.md), [protocolo para todas las IAs](AGENT-PORTABILITY.md) y [playbooks de ejecución](playbooks/README.md). Son **referencias documentales, no 56 instalaciones**.

## Dirección audiovisual de Altiora

El [Director de Experiencia Audiovisual](agents/audiovisual-experience-director.md) es la entrada por defecto de cualquier tarea visual: transforma objetivos en decisiones de herramientas, encarga escenas y anuncios a los especialistas, orquesta revisiones y evita que el usuario tenga que elegir tecnologías. Su asesor [Visual Tech Scout](agents/visual-tech-scout.md) identifica cambios; el Director solo propone una adopción tras pruebas y revisión de licencias.

## Mejora continua — Visual Tech Scout

[Rol compartido por las IAs](agents/visual-tech-scout.md) y [monitor programado en GitHub Actions](../../continuity/visual-watch/README.md): semanalmente revisa estado de repositorios y propone cambios que requieren aceptación, licencias, seguridad y pruebas. [Preflight local](../../scripts/visual-preflight.mjs) distingue herramientas que responden en cada máquina de integraciones aún no habilitadas. No es un agente IA permanente ni se fusionan automáticamente los cambios.

## Objetivo

Producir sistemas visuales reutilizables para (1) anuncios cortos de alto impacto, (2) experiencias web inmersivas y (3) escenas cinematográficas 3D. El resultado debe servir al negocio y permanecer editable, accesible, mantenible y verificable.

## Las seis capas

| Capa | Responsabilidad | Herramientas a evaluar |
|---|---|---|
| 1. Estrategia y dirección | Hook, idea, narrativa, audiencia, CTA, storyboard | Figma, creatividad humana y agentes existentes |
| 2. Activos visuales | Fotografía real, modelado, materiales, UV, texturas, iluminación | Blender, Photoshop UXP, herramientas aprobadas de imagen |
| 3. Escena y VFX | Composición, física visual, postprocesado, cámara, partículas | Three.js, R3F, postprocessing, PixiJS |
| 4. Motion y vídeo | Timelines, tipografía cinética, composición y subtítulos | GSAP (ya catalogado), Motion, Remotion, Motion Canvas |
| 5. Interactividad web | Estado, scroll y señales accesibles | Rive, dotLottie, React, glTF/model-viewer |
| 6. Entrega, QA y archivo | Formatos, derechos, medición, performance, variantes | glTF Transform (ya catalogado), FFmpeg WASM, QA |

## Decisiones de arquitectura

1. **Sin apilar librerías por moda**: GSAP y Motion son alternativas o capas delimitadas, no dos controladores sobre el mismo elemento/timeline. Para Rive/Lottie usar solo el runtime necesario.
2. **Videos y webs son pipelines distintos**: Remotion genera composiciones de video; Three/R3F sirve escenas interactivas. Un video renderizado puede alimentar la web, pero no es un mundo 3D navegable.
3. **Blender es la fuente 3D**: salida FBX/GLB según el destino, normal maps, PBR, compresión y comparación visual antes/después.
4. **Adobe requiere software y permisos reales**: ejemplos UXP y guías no establecen conexión automática con Photoshop, Premiere o After Effects.
5. **MCP es zona sensible**: servidores de terceros en estado HOLD hasta auditoría de permisos, acceso de red, operaciones y secretos; ejecutar aislados.
6. **Estándar Altiora**: estética original de alto nivel, respeto al cliente, assets con derechos verificados, CTA legible, fallback estático y criterio claro de aceptación.

## Cómo se activa en cada IA

Todos los agentes deben leer [el router común](ROUTER.md) y aplicar [el workflow de producción](../../docs/workflows/visual-production-multi-ai.md).

- **Claude / Claude Code**: partir de `CLAUDE.md`, `AGENTS.md` y el rol apropiado en `team/agents/`; cargar este router como contexto antes de usar motion, video o 3D. No instalar skills de terceros sin revisión.
- **Gemini / Antigravity**: partir de `GEMINI.md` y `AGENTS.md`; leer las mismas referencias. Un prompt no implica acceso a Blender/Adobe local.
- **ChatGPT / Codex**: partir de `AGENTS.md` y los prompts portables en `team/agents/`. Si el agente tiene acceso al repositorio, puede leer el router y producir entregables; permisos de ejecución se comprueban aparte.
- **Otras IAs**: leer `AGENTS.md`, este README, router y workflow; respetar el mismo contrato y los gates.

## Catálogo

[Ver repositorios visuales, decisiones y riesgos](../../references/visual-libraries-2026.json). Es **complementario** a [references/repositories.json](../../references/repositories.json). No es un archivo `package.json`, no incluye código de terceros y no demuestra que una integración esté instalada.

## Primer piloto implementado

[Experimento Tilicheros Gaming](../../experiments/tilicheros-motion-lab/README.md): código fuente de un spot 9:16, artwork conceptual propio, generador Blender y pruebas estructurales/TypeScript. Se mantiene aislado del sitio comercial; no contiene assets o productos auténticos de Tilicheros, y no declara render de video concluido.

## Plantillas

- [Brief audiovisual y de experiencia](BRIEF.template.md)
- [Router por intención](ROUTER.md)

## Definition of Done

Un trabajo se considera terminado solo con: brief aprobado, storyboard/beat sheet o estados UX, archivos fuentes, export finales o artefactos ejecutables, inventario de licencias/assets, pruebas según destino, fallback, presupuesto y checklist de QA con resultados reales (PASS / FAIL / NOT_RUN). Ninguna referencia externa es evidencia de un render propio.
