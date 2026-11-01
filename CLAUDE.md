<!-- ALTIORA_AUTOMATIC_CAPABILITIES_START -->
## Uso automático de capacidades de Altiora

El usuario autoriza seleccionar y aplicar automáticamente skills y agentes pertinentes a cada solicitud. No debe mencionar nombres, comandos ni pedir expresamente que se use una capacidad instalada. Esta regla incluye capacidades añadidas en el futuro; no mantener una lista cerrada de nombres.

- Al recibir una tarea, usar primero los nombres y descripciones que el cliente ya haya descubierto. Si falta una capacidad pertinente en ese inventario, inspeccionar los metadatos de las carpetas locales de skills del proyecto (.claude/skills en Claude; .agents/skills en Antigravity; skills/ para la biblioteca existente). Leer el cuerpo y referencias únicamente de las seleccionadas. No cargar toda la biblioteca.
- Resolver directamente trabajos pequeños. Para varias especialidades, elegir el coordinador pertinente por descripción y repartir responsabilidades cuando aporte valor. Esta autorización incluye delegación pertinente dentro del alcance de la tarea, siempre que el cliente disponga de subagentes reales. En Claude descubrir roles en .claude/agents; en Antigravity consultar altiora-os/agents como instrucciones cuando no exista delegación nativa. No afirmar que esos archivos crean agentes activos.
- No pedir al usuario que invoque una skill o agente por nombre ni que repita esta preferencia. Ante capacidades equivalentes, elegir una variante adecuada y conservar las demás. Respetar una elección explícita del usuario.
- Al añadir una capacidad, incluir nombre y descripción claros, instalarla en la ruta de descubrimiento del cliente, conservar sus recursos y verificar su descubrimiento cuando sea posible. No marcarla como exclusivamente manual salvo petición expresa. Tras una incorporación, indicar si el cliente necesita reabrir el proyecto para actualizar su inventario.
- La selección automática no autoriza acciones externas, gasto, publicación, cambios fuera del alcance ni ejecución de código no revisado. Los permisos reales del host y las instrucciones del proyecto siguen vigentes. No inventar herramientas, conexiones ni revisiones independientes.

No hace falta usar siempre el mismo agente: escoger la capacidad mínima que resuelva el encargo. Informar brevemente de las capacidades aplicadas cuando ayude a verificar una entrega, sin convertirlo en un paso que deba realizar el usuario.
<!-- ALTIORA_AUTOMATIC_CAPABILITIES_END -->

<!-- ALTIORA_AGENT_SYSTEM_START -->
## Altiora Agent System 1.3.0
Leer `.altiora/system/core/constitution.md` al empezar trabajo en este proyecto. Usar `.altiora/project.json` como contexto y `.altiora/handoff.json` si existe, contrastando siempre con el encargo vigente. Seleccionar skills por descripcion. Las instrucciones propias del proyecto y las del usuario siguen aplicando.
<!-- ALTIORA_AGENT_SYSTEM_END -->

<!-- ALTIORA_INDEX_ROUTING_START -->
## Índice maestro y verificación rápida
Consultar [`INDEX.md`](INDEX.md) y [`docs/altiora-toolkit/MAPA-CAPACIDADES.md`](docs/altiora-toolkit/MAPA-CAPACIDADES.md) para el mapa de coordinadores, los 12 subagentes especialistas, las 86 skills en `.claude/skills` (incluyendo Web 3D/R3F/GSAP, ciclo comercial de US$10.000 y `orca-cli`/`orca-orchestration`) y los conectores de [`.mcp.json`](.mcp.json). Ejecutar `npm run check` en la raíz para validar doctor, handoff, catálogo y pruebas.
<!-- ALTIORA_INDEX_ROUTING_END -->

<!-- ALTIORA_VALUE_BUSINESS_START -->
## Negocio de Altiora · contexto bajo demanda
Para estrategia, oferta, clientes, precios, finanzas u operación de Altiora, consultar docs/altiora-business/INICIO.md y solo la sección necesaria. Objetivo confirmado: US$10.000 por proyecto, con mantenimiento mensual opcional separado; cero clientes de pago confirmados. Reutilizar capacidades disponibles y conservar tareas técnicas anteriores. No cargar toda la biblioteca, inventar resultados, atribuir habilitación profesional a roles IA, contactar, contratar o gastar por efecto lateral. Esta guía no concede nuevos permisos ni crea ejecución persistente.
<!-- ALTIORA_VALUE_BUSINESS_END -->

<!-- ALTIORA_CLAUDE_MASTER_START -->
## Contexto de Altiora bajo demanda
Contexto actual único, cargado automáticamente en cada sesión de Claude Code:
@docs/altiora-business/CLAUDE-ALTIORA-UNIFICADO.md

Abrir fuentes extensas solo cuando la tarea lo exija. Cargar `docs/altiora-business/ALTIORA-MAESTRO-PROYECTOS.md` solo al dirigir un proyecto integral o resolver una decisión material; consultar secciones pertinentes, no todo por cada mensaje. El prompt anterior `docs/altiora-toolkit/CLAUDE-MASTER.md` queda como referencia histórica: su tarea de revisión de calculadora no se activa automáticamente. Respetar accesos y permisos reales.
<!-- ALTIORA_CLAUDE_MASTER_END -->

<!-- ALTIORA_COORDINATOR_MODE_START -->
## Coordinación de Altiora · Enrutamiento Automático Multi-IA con Orca
Ante un mensaje único del usuario que abarque múltiples especialidades, se puede ejecutar `npm run orca:dispatch -- "mensaje"` (`scripts/orca-dispatch.py`) solo para ver un plan de reparto (flujos, IA sugerida y esfuerzo). Desde el 01/11/2026 el despachador está en modo solo plan: no registra tareas ni lanza agentes, y no se reactiva (`ALTIORA_DISPATCH_EXECUTE=1`) sin autorización expresa del usuario. La delegación la decide el usuario en Orca eligiendo la IA (`orca worktree create --agent ...`). Consultar `docs/altiora-toolkit/FLUJO-DELEGACION.md`. Resolver directamente cambios pequeños de un solo dominio.
<!-- ALTIORA_COORDINATOR_MODE_END -->

<!-- ALTIORA_META_ADS_GROWTH_START -->
## Meta Ads · estrategia y medición
Para auditoría, plan o análisis de Meta Ads, leer bajo demanda `docs/altiora-toolkit/skills/meta-ads-growth/SKILL.md`. Para conceptos y guiones, reutilizar `meta-ads-creator` si está disponible. Esta referencia no conecta cuentas ni autoriza gasto, edición de campañas o publicación.
<!-- ALTIORA_META_ADS_GROWTH_END -->

<!-- ALTIORA_PROJECT_DIRECTOR_START -->
## Dirección de proyectos integrales
Para un proyecto multidisciplinar de Altiora, leer bajo demanda `docs/altiora-business/ALTIORA-MAESTRO-PROYECTOS.md` y aplicar la Parte III (Director de Experiencia y Resultados), junto con la propuesta y el estándar incluidos en el mismo archivo. No cargarlo para cambios pequeños. El rol no crea una sesión, garantiza resultados ni amplía permisos.
<!-- ALTIORA_PROJECT_DIRECTOR_END -->
