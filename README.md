# Altiora Immersive Web Lab

Laboratorio de experiencias web inmersivas y comerciales. Primer caso: **La Central del Queso**, un recorrido de la finca a la mesa.

La base de investigación reúne **25 repositorios** con una función, una decisión y una revisión concreta. La selección inicial favorece Three.js + React Three Fiber + Drei + GSAP; glTF Transform prepara los modelos. Lenis se evalúa después de comparar con el scroll nativo.

## Altiora Visual Studio — Motion, Blender, Adobe y producción multi-IA

Nuevo: [sistema visual compartido](creative/visual-studio/README.md), [router para Claude, Gemini/Antigravity y ChatGPT/Codex](creative/visual-studio/ROUTER.md), [56 referencias visuales evaluables](references/visual-libraries-2026.json) y [workflow de producción](docs/workflows/visual-production-multi-ai.md). Son extensiones documentales; no se han instalado programas, addons ni servidores MCP.

La expansión avanzada agrega [matriz técnica](creative/visual-studio/PRODUCTION-MATRIX.md), [playbooks portables](creative/visual-studio/playbooks/README.md) y [protocolo común para Claude, Gemini/Antigravity y ChatGPT/Codex](creative/visual-studio/AGENT-PORTABILITY.md), sin ejecutar 56 paquetes ni instalar aplicaciones Adobe.

## Experimento audiovisual ejecutable (código)

[Tilicheros · Cinematic Motion Pilot](experiments/tilicheros-motion-lab/README.md) contiene una plantilla Remotion 15s vertical, un diseño conceptual original y un script Blender para generar CGI reproducible. Los archivos están versionados y cuentan con validación automatizada, pero **no** representan un anuncio final ni un render certificado.

## Empezar

1. Leer la [comparación de repositorios](docs/research/repository-review.md).
2. Consultar el [catálogo reproducible](references/repositories.json).
3. Seguir la [decisión de arquitectura](docs/decisions/0001-immersive-foundation.md).
4. Abrir el [caso La Central del Queso](projects/la-central-del-queso/BRIEF.md).
5. Trabajar con el [proceso de experimentos](docs/workflows/immersive-project.md) y la [plantilla](templates/experiment.md).

La [validación](docs/research/VALIDATION.md) distingue lo comprobado de lo pendiente.

## Qué contiene esta primera entrega

- Evaluación documental a fecha 2026-10-18: utilidad, actividad, compatibilidad y licencias.
- Revisiones de origen fijadas por commit para estudiar ejemplos reproducibles.
- Criterios de aceptación visual, accesibilidad, rendimiento y pedidos.
- Herramienta para traer una referencia a una carpeta local ignorada, sin instalar ni ejecutar su código.

El catálogo registra fuentes; no instala dependencias en la web ni incorpora copias de los proyectos externos. Aún no existe una escena ejecutable o una medición de rendimiento de Altiora.

## Comprobar el laboratorio

Requiere Node.js 20 o posterior y Git para descargar referencias. No necesita instalar paquetes.

~~~sh
npm run check
npm run reference -- codrops/OneElementScroll
~~~

La segunda orden descarga únicamente esa revisión en `.references/`. No ejecuta instrucciones del README externo. No es necesario descargar todos los repositorios.

## Proyectos

- [La Central del Queso](https://github.com/alvaradom1304/la-central-del-queso): la web existente vive en `src/web` (rama `hito2-exterior-realista`). Mantener allí el catálogo, pedidos, WhatsApp y ubicaciones mientras los experimentos se validan en Altiora.
- Primer experimento definido: [umbral de la finca → mesa](projects/la-central-del-queso/experiments/001-umbral-a-mesa.md).

## Equipo y Roles de Agentes (`team/`)

El laboratorio define 12 roles operativos y directrices de orquestación en [team/registry.md](team/registry.md):
- **Director de experiencia**: Integración de estrategia, dirección de arte y gates de calidad.
- **Director creativo & Motion designer**: Concepto visual, narrativa de cámara, animaciones y fallbacks.
- **Ingeniero web & Shader artist**: Implementación WebGL, Three.js, React Three Fiber y shaders GLSL.
- **UX researcher & Diseñador UI**: Flujos de compra, accesibilidad WCAG y componentes táctiles.
- **Estratega de negocio & Analista de conversión**: Unit economics, calculadoras de feria y pasaporte VIP.
- **QA & Accessibility reviewer**: Control independiente de calidad, métricas de rendimiento y regresiones.

El [índice](INDEX.md) reúne agentes, chats, skills y repositorios. Los roles funcionan como agentes reales: subagentes de Claude Code en `.claude/agents/` y prompts portables para Codex, Gemini o ChatGPT en `team/agents/`. Las IAs se reparten el trabajo en el [chat del equipo](team/chat/README.md) (`npm run chat -- board`).

## Catálogo de Skills Integradas (`skills/`)

El repositorio cuenta con un catálogo de **251 skills especializadas** (18 de ellas de terceros, con licencia y procedencia en [skill-sources.json](references/skill-sources.json)) categorizadas en:
1. **Brand & Creative Intelligence**: Art direction, brand architecture, storytelling, color system, typography direction.
2. **Premium Web Experience**: Three.js, React Three Fiber, GSAP animation, motion design, responsive design, conversion UX.
3. **Business & Financial Intelligence**: Unit economics, pricing strategy, margin analysis, cash flow, financial forecasting.
4. **AI & Automation**: Agent design, orchestration, evaluation, n8n webhook architecture, RAG architecture.
5. **Cybersecurity & QA**: OWASP review, frontend/backend security, API security, vulnerability triage.

Las skills mejoran por ciclos PDCA medidos: `npm run skills:audit` puntúa cada una y bloquea regresiones. Ver [mejora continua de skills](docs/workflows/skill-improvement.md), el [informe actual](quality/skills-report.md) y el [registro de ciclos](quality/skills-improvement-log.md).

## Fuentes y uso

Las estrellas y fechas son una fotografía de investigación, no una garantía de calidad. La licencia de código no acredita automáticamente modelos, imágenes, sonidos o fuentes tipográficas. Registrar la procedencia de cada recurso utilizado y conservar avisos cuando se reutilice código.

GSAP usa su licencia propia Standard No Charge. El catálogo señala una discrepancia MIT/ISC en r3f-scroll-rig; ese candidato queda en espera.
