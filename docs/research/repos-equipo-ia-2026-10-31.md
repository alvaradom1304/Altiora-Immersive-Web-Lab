# Repositorios y skills para el equipo de IA de Altiora

Fecha: 2026-10-31. Autor: `claude/altiora-research`. Estado: **investigación documental**. No se instaló, descargó ni ejecutó nada, y no se pasó ningún candidato por SkillSpector (`NOT_RUN`). Toda importación sigue el [gate de seguridad](../security/third-party-skill-gate.md).

## Qué ya existe (y no se recomienda otra vez)

- **Ventas:** el repo ya tiene skills de método comercial: `prospecting`, `fanatical-prospecting`, `cold-outbound-system`, `lead-qualification`, `sales-discovery`, `sales-proposal`, `sales-follow-up`, `sales-objection-analysis`, `meddicc`, `spin-selling`, `gap-selling`, `challenger-selling`, `negotiation` y `high-ticket-offer` (esta última en el núcleo). Lo que falta para cerrar el primer cliente de USD 10.000 **no es más método**: falta un CRM conectado, un registro de pipeline y rutinas de seguimiento que se ejecuten.
- **Operación de agentes:** `altiora-agent-orchestrator`, `altiora-quality-review`, `verification-before-completion`, `ai-evaluation`, `skill-creator` (anthropics/skills), `npm run routing:eval` y el chat del equipo. Este entorno de Claude Code también trae `code-review`, `simplify` y `security-review` integrados.
- **Web, diseño y automatización:** Three.js, R3F, Drei y GSAP ya están en `adopt` en `references/repositories.json`. `figma/plugin-samples` aparece en `visual-libraries-2026.json`. Ya existen las skills `gsap-animation`, `threejs-experience`, `react-three-fiber`, `n8n-webhook-architect` y `mcp-integration`.
- **Ya descartado** (`considered_not_imported`): `frontend-design` de anthropics, `react-best-practices` de vercel y `test-driven-development` y `brainstorming` de superpowers.
- **Conectores presentes en esta sesión:** HubSpot, Figma y Notion aparecen como conectores MCP, pero piden autorización con `/mcp`. Que estén configurados **no prueba** que haya una sesión autenticada.

## Candidatos recomendados (13)

Estrellas y fecha tomadas de `api.github.com/repos/<repo>` el 2026-10-31/11-01 (UTC). `pushed_at` es el último push a **cualquier rama**, no necesariamente un commit en `main`.

| # | Candidato | Estrellas · último push | Licencia | Hueco | Riesgo de seguridad | Esfuerzo | Decisión |
|---|---|---|---|---|---|---|---|
| 1 | [Conector HubSpot MCP](https://developers.hubspot.com/mcp) (remoto oficial; ya aparece en la sesión) | No aplica (servicio) | Términos de HubSpot; CRM gratuito | 1. CRM, pipeline, registro de actividades | Lee y **escribe** contactos y negocios. Los datos de prospectos viven en HubSpot (EE. UU.). OAuth por usuario; empezar en solo lectura y confirmar cada escritura | Bajo: autorizar en `/mcp`, definir etapas del pipeline | **Ahora** |
| 2 | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins), plugin `sales` | 34.213 · 2026-10-31 | Apache-2.0 | 1. 36 skills operativas: `account-research`, `call-prep`, `draft-outreach`, `pipeline-review`, `crm-hygiene-check`, `close-plan`, `win-loss-review`, `daily-briefing`… | Las skills son texto. El plugin trae un `.mcp.json` con conectores remotos (HubSpot, Close, Clay, ZoomInfo, Slack…). **No** instalar el plugin completo: copiar solo las skills elegidas y descartar su `.mcp.json` | Medio: escoger 4–6, adaptarlas a CR y español, comparar con `sales-*` | **Ahora** (piloto selectivo) |
| 3 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills): `cold-email`, `sales-enablement`, `revops` | 57.705 · 2026-10-31 | MIT | 1. Correo en frío, material de ventas y proceso de ingresos | Texto. La fuente ya está auditada en `skill-sources.json` (revisión `365b412`). `cold-email` faltaba y otras skills lo citan | Bajo: misma fuente, nueva revisión fijada y diff | **Ahora** |
| 4 | [twentyhq/twenty](https://github.com/twentyhq/twenty) | 60.223 · 2026-11-01 | La API devuelve `NOASSERTION`. Por conocimiento previo, AGPL-3.0 con partes comerciales: **verificar** | 1. CRM open source autoalojable si HubSpot se queda corto o se exige soberanía de datos | Autoalojarlo implica un servidor, una base de datos y sus parches. Su MCP nativo solo consta en artículos de terceros (folk.app, competidor); no se verificó en docs.twenty.com. Los MCP comunitarios quedan fuera | Alto: infraestructura y mantenimiento | **Después** |
| 5 | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official): `claude-md-management`, `hookify`, `pr-review-toolkit`, `session-report` | 45.589 · 2026-10-31 | Apache-2.0 | 2. Unificar `CLAUDE.md` (pendiente en la auditoría), crear hooks sin editar JSON a mano, revisión de PR con varios agentes, informe de sesión | Los hooks ejecutan comandos de shell en cada evento: revisar cada hook antes de activarlo. No duplicar `code-review` y `simplify`, que ya vienen integrados | Bajo–medio | **Ahora** (`claude-md-management` y `hookify`). El resto, **después** |
| 6 | [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action) | 9.733 · 2026-10-31 | MIT | 2. Revisión automática de PR y QA en GitHub Actions | Necesita el secreto `ANTHROPIC_API_KEY` en GitHub. Cada ejecución consume API (gasto). Se puede disparar desde comentarios: limitar quién la activa y sus permisos | Medio | **Después** (cuando haya gasto aprobado) |
| 7 | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | 26.680 · 2026-11-01 | MIT | 2. Evaluación reproducible de prompts, skills y enrutamiento (complementa `routing:eval`) | CLI local. Llama a la API del modelo, con su costo. La telemetría por defecto **no se verificó**: comprobar la variable de exclusión antes de usarlo | Medio | **Después** |
| 8 | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | 54.570 · 2026-11-01 | Apache-2.0 | 3 y 2. Trazas de rendimiento (LCP, INP), consola y red para la QA de webs inmersivas | Controla un Chrome real, con acceso a las sesiones abiertas si se conecta a tu perfil. Posible envío de estadísticas de uso a Google (no verificado). Usar un perfil aislado | Bajo–medio | **Después** (piloto para La Central) |
| 9 | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | 38.919 · 2026-10-31 | Apache-2.0 | 2 y 3. Navegación automatizada para la QA | Su README dice que **no es un límite de seguridad**. `browser_run_code_unsafe` equivale a RCE y el perfil persistente guarda cookies. Usar `--isolated`. Se solapa con `webapp-testing` y el panel de navegador de Claude | Bajo | **Después**, solo si `webapp-testing` no alcanza |
| 10 | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 17.648 · 2026-07-29 | MIT | 3. Skills oficiales de GSAP (core, timeline, ScrollTrigger, React, performance), según un buscador; el árbol no se abrió | Texto. Su instalador recomendado (`npx skills add`) está **prohibido** por el gate: copiar a mano una revisión fijada | Bajo: comparar con `gsap-animation` y fusionar o sustituir | **Ahora** |
| 11 | [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) | 23.186 · 2026-10-27 | MIT | 3. Documentación de 3.143 nodos de n8n y gestión de workflows | Sin clave solo consulta documentación. Con `N8N_API_KEY` crea y borra workflows y credenciales: usar `DISABLED_TOOLS` y una clave de solo lectura. **No** usar su panel alojado (envía datos a un tercero). Tiene telemetría con opción de desactivarla (documento no leído) | Medio | **Después** (cuando exista una instancia de n8n y un caso real) |
| 12 | [n8n-io/n8n](https://github.com/n8n-io/n8n) | 209.223 · 2026-11-01 | `Other`: Sustainable Use License (fair-code), según conocimiento previo | 3. Motor de automatización para clientes (WhatsApp, CRM, pedidos) | Autoalojado: secretos de clientes en tu servidor. **Licencia:** permite uso interno; ofrecerlo alojado como servicio de pago a clientes requiere revisar la licencia o un acuerdo comercial | Alto | **Después** (revisión legal antes de venderlo) |
| 13 | [Conector Figma MCP](https://github.com/figma/mcp-server-guide) (remoto oficial; ya aparece en la sesión) | La guía tiene 2.137 estrellas · 2026-10-28 | La guía **no tiene licencia** (solo lectura). Servicio sujeto a los términos de Figma | 3. Pasar de diseño a código con tokens y variables reales | Lee archivos de Figma del usuario. Algunas herramientas escriben (`use_figma`, `send_code_to_figma`). Autorizar por cuenta | Bajo | **Después** (cuando haya un archivo de Figma del proyecto) |

### Solo para consultar (no importar)

| Fuente | Estrellas · último push | Licencia | Uso |
|---|---|---|---|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 57.000 · 2026-11-01 | `NOASSERTION` | Índice para descubrir hooks, comandos y flujos. No copiar contenido |
| [wshobson/agents](https://github.com/wshobson/agents) | 42.055 · 2026-10-30 | MIT | Ejemplos de subagentes y plugins. Importarlos duplicaría los 21 agentes |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 26.240 · 2026-10-30 | MIT | Ídem. Sirve para comparar los prompts de rol de `qa-reviewer` y `business-strategist` |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | 91.722 · 2026-10-29 | `NOASSERTION` (mixta) | Servidores de referencia. El de sistema de archivos ya opera como `altiora-shared` |

## Orden propuesto para el hueco 1 (ventas)

1. Autorizar HubSpot en `/mcp` (decisión del dueño). Crear un pipeline de 5 etapas y probarlo primero en solo lectura.
2. Copiar `cold-email`, `sales-enablement` y `revops` (#3) y 4–6 skills de #2 (`account-research`, `call-prep`, `draft-outreach`, `pipeline-review`, `crm-hygiene-check`, `win-loss-review`) en cuarentena. Pasarlas por `npm run security:scan` y por una revisión humana. Después, decidir cuáles sustituyen a las `sales-*` de reserva para no inflar el catálogo.
3. Criterio de aceptación: una lista de 20–30 cuentas objetivo en HubSpot, con una propuesta generada por `high-ticket-offer` y un seguimiento registrado. Esto no promete ventas; mide actividad y avance.

## Descartados

| Candidato | Motivo |
|---|---|
| [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | **Sin licencia** (`license: null`). Último push 2026-03-04. Se puede leer como idea; no se copia |
| [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) (como contenido importable) | Sin licencia. Se usa el conector oficial, no el texto de la guía |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) (para importar) | `license: null` (términos comerciales de Anthropic). La carpeta `plugins/` solo contiene un README: los plugins se movieron a `claude-plugins-official` |
| Plugin `ralph-loop` (claude-plugins-official) | Bucle autónomo que repite la tarea: choca con las reglas de control de consumo |
| Plugin `sales` completo con su `.mcp.json` | Activaría conectores remotos (Clay, ZoomInfo, Close…) que no se usan y que tienen costo o acceso a datos |
| Panel alojado de n8n-mcp (dashboard.n8n-mcp.com) | Envía las operaciones a un servicio de terceros; su tratamiento de datos no está documentado en la página |
| Servidores MCP comunitarios de Twenty (p. ej., realboost) | De terceros, sin auditar, con una clave de API con escritura sobre el CRM |
| Importar wshobson/agents o VoltAgent como agentes | Duplican roles existentes. Contradice la auditoría del 2026-10-31 (sobran agentes, no faltan) |
| Revisitar `frontend-design`, `test-driven-development`, `brainstorming` | Ya están en `considered_not_imported`. No hay motivo nuevo |

Ningún candidato serio resultó abandonado (todos tienen push en 2026). El más antiguo es gsap-skills (2026-07-29), dentro del límite de 12 meses.

## Límites de esta investigación

- **Evidencia:** las estrellas, `pushed_at`, la licencia y `archived` vienen de la API pública de GitHub. Las listas de skills de `knowledge-work-plugins/sales`, `marketingskills` y `claude-plugins-official` salen del endpoint `contents`. No se leyó el código ni los `SKILL.md` de ningún candidato.
- **Sin verificar:** el contenido de gsap-skills (viene de buscadores y agregadores), las licencias de Twenty y n8n (la API devuelve `NOASSERTION`/`Other`; el texto sale de conocimiento previo), la telemetría de promptfoo, n8n-mcp y chrome-devtools-mcp, el MCP nativo de Twenty y el `.mcp.json` del plugin `sales`.
- **No cubierto:** fuentes de datos de prospección de pago (Apollo, Clay, ZoomInfo), firma electrónica (Documenso, por ejemplo) y agenda (Cal.com). También queda fuera la adecuación legal de enviar correo en frío desde Costa Rica (Ley 8968 de protección de datos) o hacia otros países.
- **Sin pruebas:** nada se instaló ni se ejecutó. Las decisiones «Ahora» son de **prioridad de evaluación**, no de instalación: cada una pasa antes por cuarentena, `security:scan`, revisión humana, `npm run agents:build` y `npm run check`.
- **Conteo:** no se midió el consumo de tokens ni el beneficio. Añadir skills aumenta el catálogo; promover al núcleo solo lo que una tarea real use (`references/skill-core.json`).
