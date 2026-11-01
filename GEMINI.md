# Gemini en Altiora

Para diagnóstico, evaluación de recuperación o QA audiovisual, seguir bajo demanda [operación compartida](docs/operations/SHARED-OPERATIONS.md), también en Antigravity. Los archivos y tests no prueban conexiones de la sesión ni aprobación comercial.

Seguir [AGENTS.md](AGENTS.md). Para trabajar como un rol del equipo, cargar su prompt en `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

## Antigravity — Agentes, skills y reglas compartidos
- `.agents/agents/` contiene subagentes, `.agents/skills/` las mismas skills del catálogo Altiora y `.agents/rules/` las reglas de selección de roles.
- Para marketing, branding, videos y anuncios leer `creative-ads-os/WORK_ROUTER.md`, e invocar solo los roles y skills pertinentes.
- Las fuentes están en `team/` y `skills/`. Usar `npm run agents:build` para sincronizar Claude Code y Antigravity y `npm run check` para verificar diferencias.
- Mantener los límites comerciales, de propiedad intelectual y autorización definidos en AGENTS.md.

## Expansión audiovisual
Para Antigravity/Gemini: leer [Visual Studio](creative/visual-studio/README.md), [router visual](creative/visual-studio/ROUTER.md) y [workflow multi-IA](docs/workflows/visual-production-multi-ai.md). Seguir el mismo brief, manifiesto de activos, gates y estados de QA usados por Claude y ChatGPT/Codex. La integración con Blender, Adobe y MCP requiere configuración y permisos locales reales.

## Skill operativa V2 (compartida con Claude y Codex)
Si la intención del usuario requiere **motion graphics, After Effects, Premiere, Photoshop, Blender, VFX, cinematic, shaders, web 3D o anuncios**, seguir [protocolo portable](creative/visual-studio/AGENT-PORTABILITY.md), [matriz profesional](creative/visual-studio/PRODUCTION-MATRIX.md) y [playbooks](creative/visual-studio/playbooks/README.md). Cada tool access se registra como UNKNOWN hasta comprobar conexión, versión y permisos; cualquier MCP externo se audita antes de ejecutar.

## Reanudación sin reconstruir el chat
Antes de continuar en Antigravity/Gemini, leer [checkpoint](continuity/checkpoint.json) y [recovery runbook](continuity/README.md), ejecutar `npm run resume` si hay checkout y verificar PRs/CI. Diferenciar documentación, CI probado y apps realmente conectadas.

## Visual Tech Scout — actualización periódica
Al solicitar mejora continua, leer el [rol de vigilancia](creative/visual-studio/agents/visual-tech-scout.md), el [reporte GitHub](continuity/visual-watch/README.md) y el [preflight](scripts/visual-preflight.mjs). Registrar la fuente, cambios técnicos, seguridad, licencias y evidencia de QA. GitHub Actions programa la revisión; Gemini/Antigravity no queda ejecutándose constantemente por existir este archivo.

## Punto de entrada audiovisual automático
Para cualquier intención visual, actuar primero como [Director de Experiencia Audiovisual](creative/visual-studio/agents/audiovisual-experience-director.md) y coordinar sus agentes especializados. La decisión sobre Blender, Adobe, Motion, Remotion, shaders o WebGL corresponde al director según resultado, acceso real y costo: no trasladar esa selección al usuario. El workflow no instala software por sí solo.

## Visual Studio V3 y skills actualizables
El Director Audiovisual consulta [SCOUT-V3](creative/visual-studio/SCOUT-V3.md) para nuevas versiones y selecciona por objetivo [CGI-color](creative/visual-studio/playbooks/advanced-cgi-color.md) o [2D-motion-artístico](creative/visual-studio/playbooks/illustration-particles.md). Las referencias externas no constituyen conexiones verificadas.

## Adobe After Effects
Leer [guía del puente AE](creative/visual-studio/after-effects/README.md) para comprobar `aerender`, preparar un `.aep` y ejecutar un render cuando el usuario lo permita. No dar por conectado Adobe por leer un archivo; elegir alternativa segura si falla el preflight.

## MCP local After Effects para Gemini/Antigravity
Consultar [registro multi-cliente](creative/visual-studio/after-effects/MCP-SETUP.md) y el archivo de proyecto `.agents/mcp_config.json` generado desde la laptop. Para Gemini CLI usar `gemini mcp list`; para Antigravity revisar su panel MCP. Los renders requieren autorización expresa por proyecto.

## After Effects en PC — Gemini / Antigravity
El servidor local `altiora-after-effects` se prepara mediante `npm run after-effects:setup -- --apply` desde el repositorio de la computadora. Gemini CLI usa `.gemini/settings.json`; Antigravity IDE/CLI usa `.agents/mcp_config.json` generado localmente. Revisar [guía MCP](creative/visual-studio/after-effects/MCP-SETUP.md) y confirmar herramientas desde el cliente antes de declarar acceso. El Director determina cuándo usar AE; no conectar apps desconocidas ni ejecutar renders sin autorización del PC.

<!-- ALTIORA_BIBLIOTECARIO_START -->
## Selección y contexto
En cada mensaje conserva el objetivo activo y elige entre las capacidades realmente disponibles. Usa la skill más específica y carga sus referencias solo cuando hagan falta; si nada aporta, resuelve directamente. Para selección ambigua consulta [Bibliotecario](skills/altiora-bibliotecario/SKILL.md). En trabajos pequeños evita equipos; delega solo con autorización y capacidad real. Reutiliza evidencia vigente y responde con resultado, comprobación y límite material, sin repetir historia ni omitir requisitos para ahorrar. No presupongas ahorro medido, modelos cambiados o conexiones por existir un archivo.
<!-- ALTIORA_BIBLIOTECARIO_END -->

<!-- ALTIORA_AUDIO_SPECIALIST -->
Para sonido, voz, música, restauración, mezcla o masterización, usar [audio-specialist](team/agents/audio-specialist.md) y [audio-production](skills/audio-production/SKILL.md). Cargar solo la modalidad necesaria; separar medición, escucha y aprobación.

---

# Altiora Enterprise OS (integrado el 01/11/2026)

<!-- ALTIORA_SKILLS_ON_DEMAND_START -->
## Selección automática de skills según la tarea

El usuario quiere que las skills se utilicen automáticamente cuando aporten valor real, sin invocarlas manualmente ni cargar toda la biblioteca.

1. Entender la solicitud y revisar primero los nombres y descripciones disponibles. Leer el SKILL.md completo solo de las capacidades pertinentes a la tarea actual. Consultar sus referencias únicamente cuando sean necesarias.
2. Elegir el conjunto mínimo suficiente; empezar normalmente con una o dos especialidades y añadir otra solo si aparece una necesidad concreta. Si ninguna aporta valor, resolver directamente. No activar capacidades por coincidencias superficiales ni leer los 237 archivos al iniciar cada conversación.
3. Para una corrección pequeña, responder o editar directamente con la especialidad pertinente. Usar altiora-agent-orchestrator para trabajo de varias áreas o coordinación solicitada, no para cada mensaje. No lanzar agentes en paralelo salvo que estén autorizados, disponibles y aporten una ventaja concreta.
4. Orientación: diseño visual → frontend-design; experiencia web completa → elite-web-experience-os; investigación de repositorios → altiora-repository-research; revisión de entrega → altiora-quality-review; costes de IA → altiora-ai-economy. Para otras tareas, elegir por su descripción entre las demás skills instaladas, incluidas las capacidades AEM creadas por el usuario.
5. Ante versiones duplicadas, preferir la capacidad del proyecto cuando corresponda al encargo; no ejecutar ambas por defecto. Respetar las instrucciones del usuario y las reglas de mayor prioridad.
6. Indicar brevemente las skills que realmente se leyeron y aplicaron, sin inventar ejecuciones. Distinguir disponible, aplicada, probada y servicio conectado. No prometer ahorros o calidad sin evidencia.
7. Una skill es una instrucción: no cambia por sí sola el modelo, no conecta APIs, no habilita herramientas ausentes y no inicia servicios. No instalar dependencias, conectar cuentas o activar gasto solo porque una skill las mencione.
8. Si falta una capacidad necesaria, identificar la carencia y avanzar con las herramientas disponibles; no cargar especialidades ajenas para simular cobertura.
<!-- ALTIORA_SKILLS_ON_DEMAND_END -->

<!-- ALTIORA_CONTINUOUS_IMPROVEMENT_START -->
## Debate y mejora continua solicitados por el usuario
- Ante solicitudes de más animación, realismo 3D, inmersión o rechazo de un resultado básico/repetitivo, aplicar [el protocolo de mejora visual](docs/altiora-improvement/visual-improvement.md). Diagnosticar, buscar una técnica pertinente si hace falta, probarla, integrarla y comparar antes/después. No entregar una lista de repositorios como sustituto de la mejora solicitada.
- Ante un tribunal de ideas o una decisión importante con objeciones materiales, consultar [el protocolo de debate](docs/altiora-improvement/idea-tribunal.md). Defensor y crítico pueden trabajar en paralelo si hay delegación real autorizada; el juez evalúa después. No inventar agentes o certeza.
- Usar las fuentes de [repositories.json](docs/altiora-improvement/repositories.json) bajo demanda. Un repositorio descargado no es un servicio activo; comprobar versiones, licencias y herramientas antes de integrarlo.
- Resolver mejoras reversibles dentro del alcance autorizado sin pedir confirmación repetida. Las conexiones de cuentas, gasto o publicación requieren la autorización correspondiente. Registrar resultados y aprendizajes comprobables, sin iniciar bucles o tareas periódicas por defecto.
<!-- ALTIORA_CONTINUOUS_IMPROVEMENT_END -->


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
Consultar [`INDEX.md`](INDEX.md) y [`docs/altiora-toolkit/MAPA-CAPACIDADES.md`](docs/altiora-toolkit/MAPA-CAPACIDADES.md) para coordinadores, especialistas y skills. Desde la unificación del 01/11/2026 la fuente única de skills es `skills/`; `.claude/skills` y `.agents/skills` se generan con `npm run agents:build`. El índice anterior del Enterprise OS está en [`docs/altiora-toolkit/INDICE-ENTERPRISE-OS.md`](docs/altiora-toolkit/INDICE-ENTERPRISE-OS.md). `npm run check` valida el Lab y el sistema Enterprise (doctor y traspaso).
<!-- ALTIORA_INDEX_ROUTING_END -->

<!-- ALTIORA_VALUE_BUSINESS_START -->
## Negocio de Altiora · contexto bajo demanda
Para estrategia, oferta, clientes, precios, finanzas u operación de Altiora, consultar docs/altiora-business/INICIO.md y solo la sección necesaria. Objetivo confirmado: US$10.000 por proyecto, con mantenimiento mensual opcional separado; cero clientes de pago confirmados. Reutilizar capacidades disponibles y conservar tareas técnicas anteriores. No cargar toda la biblioteca, inventar resultados, atribuir habilitación profesional a roles IA, contactar, contratar o gastar por efecto lateral. Esta guía no concede nuevos permisos ni crea ejecución persistente.
<!-- ALTIORA_VALUE_BUSINESS_END -->

<!-- ALTIORA_COORDINATOR_MODE_START -->
## Coordinación de Altiora · Enrutamiento Automático Multi-IA con Orca
Antes de un encargo con varias partes, largo o multidisciplinar, consultar al especialista `altiora-os-delegation` (`altiora-os/agents/altiora-os-delegation.md`): dice al usuario si conviene repartirlo en Orca o hacerlo en un solo chat, sin lanzar nada. Ante un mensaje único del usuario que abarque múltiples especialidades, se puede ejecutar `npm run orca:dispatch -- "mensaje"` (`scripts/orca-dispatch.py`) solo para ver un plan de reparto (flujos, IA sugerida y esfuerzo). Desde el 01/11/2026 el despachador está en modo solo plan: no registra tareas ni lanza agentes, y no se reactiva (`ALTIORA_DISPATCH_EXECUTE=1`) sin autorización expresa del usuario. La delegación la decide el usuario en Orca eligiendo la IA (`orca worktree create --agent ...`). Consultar `docs/altiora-toolkit/FLUJO-DELEGACION.md`. Resolver directamente cambios pequeños de un solo dominio.
<!-- ALTIORA_COORDINATOR_MODE_END -->

<!-- ALTIORA_META_ADS_GROWTH_START -->
## Meta Ads · estrategia y medición
Para auditoría, plan o análisis de Meta Ads, leer bajo demanda `docs/altiora-toolkit/skills/meta-ads-growth/SKILL.md`. Para conceptos y guiones, reutilizar `meta-ads-creator` si está disponible. Esta referencia no conecta cuentas ni autoriza gasto, edición de campañas o publicación.
<!-- ALTIORA_META_ADS_GROWTH_END -->

<!-- ALTIORA_PROJECT_DIRECTOR_START -->
## Dirección de proyectos integrales
Para un proyecto multidisciplinar de Altiora, leer bajo demanda `docs/altiora-business/ALTIORA-MAESTRO-PROYECTOS.md` y aplicar la Parte III (Director de Experiencia y Resultados), junto con la propuesta y el estándar incluidos en el mismo archivo. No cargarlo para cambios pequeños. El rol no crea una sesión, garantiza resultados ni amplía permisos.
<!-- ALTIORA_PROJECT_DIRECTOR_END -->
