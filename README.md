# Altiora Immersive Web Lab

Laboratorio de experiencias web inmersivas y comerciales. Primer caso: **La Central del Queso**, un recorrido de la finca a la mesa.

La base de investigación reúne **16 repositorios** con una función, una decisión y una revisión concreta. La selección inicial favorece Three.js + React Three Fiber + Drei + GSAP; glTF Transform prepara los modelos. Lenis se evalúa después de comparar con el scroll nativo.

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

## Catálogo de Skills Integradas (`skills/`)

El repositorio cuenta con un catálogo de **237 skills especializadas** categorizadas en:
1. **Brand & Creative Intelligence**: Art direction, brand architecture, storytelling, color system, typography direction.
2. **Premium Web Experience**: Three.js, React Three Fiber, GSAP animation, motion design, responsive design, conversion UX.
3. **Business & Financial Intelligence**: Unit economics, pricing strategy, margin analysis, cash flow, financial forecasting.
4. **AI & Automation**: Agent design, orchestration, evaluation, n8n webhook architecture, RAG architecture.
5. **Cybersecurity & QA**: OWASP review, frontend/backend security, API security, vulnerability triage.

Las skills mejoran por ciclos PDCA medidos: `npm run skills:audit` puntúa cada una y bloquea regresiones. Ver [mejora continua de skills](docs/workflows/skill-improvement.md), el [informe actual](quality/skills-report.md) y el [registro de ciclos](quality/skills-improvement-log.md).

## Fuentes y uso

Las estrellas y fechas son una fotografía de investigación, no una garantía de calidad. La licencia de código no acredita automáticamente modelos, imágenes, sonidos o fuentes tipográficas. Registrar la procedencia de cada recurso utilizado y conservar avisos cuando se reutilice código.

GSAP usa su licencia propia Standard No Charge. El catálogo señala una discrepancia MIT/ISC en r3f-scroll-rig; ese candidato queda en espera.
