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

- [La Central del Queso](https://github.com/alvaradom1304/la-central-del-queso): la web existente vive en `src/web`. Mantener allí el catálogo, pedidos, WhatsApp y ubicaciones mientras los experimentos se validan en Altiora.
- Primer experimento definido: [umbral de la finca → mesa](projects/la-central-del-queso/experiments/001-umbral-a-mesa.md), estado **diseñado, pendiente de implementación**.

## Fuentes y uso

Las estrellas y fechas son una fotografía de investigación, no una garantía de calidad. La licencia de código no acredita automáticamente modelos, imágenes, sonidos o fuentes tipográficas. Registrar la procedencia de cada recurso utilizado y conservar avisos cuando se reutilice código.

GSAP usa su licencia propia Standard No Charge. El catálogo señala una discrepancia MIT/ISC en r3f-scroll-rig; ese candidato queda en espera.
