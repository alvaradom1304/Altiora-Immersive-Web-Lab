# Propuesta: equipo de IA de Altiora

Fecha: 2026-11-01. Estado: **propuesta; nada instalado ni configurado**. Cada bloque de la sección 4 necesita aprobación explícita del dueño antes de implementarse.

Insumos:
- Inventario de esta sesión (sección 1).
- [Auditoría de agentes y skills](auditoria-infraestructura-agentes-2026-10-31.md).
- [Investigación de repos](../research/repos-equipo-ia-2026-10-31.md), hecha por `altiora-research`. No leyó el código de los candidatos y no ejecutó SkillSpector.
- Investigación de Orca (sección 3).

## 1. Inventario (verificado el 2026-10-31/11-01)

| Elemento | Estado | Hallazgo |
|---|---|---|
| Skills del repo | 263; 51 visibles para el modelo (`references/skill-core.json`) | Auditadas ayer |
| Skills globales (`~/.claude/skills`) | 30 | 28 repiten nombres del repo. 12 están en reserva en el repo pero siguen visibles por la copia global: ab-testing, cybersecurity-owasp, emails, events, financial-forecasting, lead-magnets, modular-docs-architect, offers, referrals, spin-selling, vercel-composition-patterns, vercel-react-best-practices. `immersive-interaction-lab` difiere de la copia del repo. Solo `altiora-interaction-guard` y `altiora-project-operations` son exclusivas |
| Agentes | 21 en el repo; 1 global (`audio-specialist`, distinto a la copia del repo) | Los `immersive-*` se fusionaron ayer |
| MCP del proyecto (`.mcp.json`, con cambios sin commitear del dueño) | `altiora-after-effects` (stdio local) y `metricool` (http remoto) | Solo se leyó |
| Conectores de la sesión | Gmail, Notion, Slack, Vercel, Canva, Figma, HubSpot, Ahrefs, Supermetrics; plugins `marketing`, `windsor-ai`, `searchfit-seo`, `adobe-for-creativity` | Varios piden autorización en `/mcp`. **HubSpot no está autorizado** |
| Hooks | 0 en proyecto y usuario | Nada se comprueba automáticamente |
| Comandos | Solo `/chat-*`, `/equipo`, `/repos` | — |
| Scripts npm | 38 | `security:scan` necesita NVIDIA SkillSpector, **que no está instalado**: el gate bloquea cualquier importación externa hasta instalarlo |
| Instrucciones | `~/.claude/CLAUDE.md` pide seguir `team/ROUTING.md`, **que no existe** en este checkout | Referencia rota |

**Huecos frente a lo que vende Altiora:**
1. **Ventas del primer cliente de USD 10.000:** sobran skills de método (unas 14), pero falta un CRM conectado y una rutina de seguimiento.
2. **Operación y QA:** no hay hooks, ni revisión automática de PR, ni evaluación de skills más allá de `routing:eval`.
3. **Web inmersiva:** cubierta con skills propias; faltan herramientas de medición en navegador.

## 2. Candidatos externos (resumen del informe)

| Elemento | Tipo | Superpoder para Altiora | Fuente y licencia | Riesgo | Esfuerzo | Prioridad |
|---|---|---|---|---|---|---|
| Conector HubSpot | MCP remoto oficial | CRM: pipeline, contactos, actividades | HubSpot (CRM gratuito) | Lee y escribe en el CRM; empezar en solo lectura | Bajo: autorizar en `/mcp` | **Ahora** |
| Plugin `sales` (4–6 skills: account-research, call-prep, draft-outreach…) | Skills | Preparar llamadas, investigar cuentas, redactar contacto | anthropics/knowledge-work-plugins, Apache-2.0 | Bajo sin su `.mcp.json` (que activaría conectores de pago) | Medio: copia selectiva y gate | **Ahora**, tras SkillSpector |
| `cold-email`, `sales-enablement`, `revops` | Skills | Correo en frío, material de ventas, proceso comercial | coreyhaines31/marketingskills, MIT (fuente ya auditada) | Bajo. Revisar la ley 8968 de protección de datos de Costa Rica para el correo en frío | Bajo | **Ahora**, tras SkillSpector |
| `claude-md-management`, `hookify` | Plugins | Unificar `CLAUDE.md`; crear hooks desde reglas | anthropics/claude-plugins-official, Apache-2.0 | Bajo; los hooks ejecutan comandos locales | Bajo | **Ahora** |
| Hook de verificación | Hook propio | Ejecutar `node scripts/build-agents.mjs --check` antes de cada `git commit` | Propio | Bajo; solo lectura | Bajo | **Ahora** |
| Orca (stablyai) | App de escritorio | Varios agentes en paralelo con worktrees y comparación de diffs | stablyai/orca, MIT | Medio: telemetría anónima desactivable; relay móvil sin documentar | Bajo: lo instala el dueño | **Ahora** (ver sección 3) |
| gsap-skills | Skills | GSAP oficial: timeline, ScrollTrigger, React | greensock/gsap-skills, MIT | Bajo; contenido no leído aún | Bajo | Después |
| chrome-devtools-mcp | MCP local | Trazas LCP/INP, consola y red para la QA inmersiva | ChromeDevTools, Apache-2.0 | Medio: controla un navegador | Medio | Después |
| playwright-mcp | MCP local | Navegación automatizada para QA | microsoft, Apache-2.0 | Medio: su README dice que no es un límite de seguridad | Medio | Después |
| promptfoo | Herramienta CLI | Evaluación reproducible de skills y enrutamiento | MIT | Llama a la API del modelo (costo); telemetría sin verificar | Medio | Después |
| claude-code-action | GitHub Action | Revisión automática de PR | MIT | Necesita `ANTHROPIC_API_KEY` en GitHub (costo) | Medio | Después |
| n8n-mcp / n8n | MCP / motor | Automatizar WhatsApp, CRM y pedidos para clientes | MIT / Sustainable Use License | n8n alojado para clientes requiere revisión legal | Alto | Después |
| Conector Figma | MCP remoto oficial | Diseño a código | Figma | Bajo | Bajo: autorizar en `/mcp` | Después |
| twenty (CRM autoalojado) | Herramienta | Alternativa a HubSpot | Licencia **sin verificar** | Alto hasta verificarla | Alto | **No** por ahora |
| `ralph-loop`, wshobson/agents, VoltAgent | Plugin / agentes | — | — | Bucle sin fin; duplican roles | — | **No** |

## 3. Orca (stablyai/orca) — confirmado por el dueño

- **Qué es:** app de escritorio gratuita y MIT para correr en paralelo Claude Code, Codex y otros agentes, cada uno en su propio worktree de Git, con terminales, diffs y comparación de resultados. Funciona en Windows. Usa tus propias cuentas de Claude y Codex; no revende acceso a modelos. Fuentes: [repo](https://github.com/stablyai/orca), [sitio](https://onorca.dev), [privacidad](https://onorca.dev/privacy).
- **Privacidad:** dice recopilar métricas de uso anonimizadas, no el código fuente; la exclusión es «posible» sin precisar dónde. No aclara si se recopilan los prompts ni qué pasa por el relay de la app móvil.
- **Sin verificar:** la cifra de estrellas (la página muestra unas 111.800; artículos citan entre 13.800 y 43.000), la fecha de la última versión y el canal oficial de descarga para Windows.
- **Encaje con Altiora:** sirve para lanzar la misma tarea con varios agentes y elegir el mejor resultado, por ejemplo tres variantes de una escena GSAP o de una propuesta. **Solapamiento:** esta app de Claude ya abre sesiones paralelas con worktrees; Orca añade comparar diffs entre agentes distintos (Claude y Codex) en una sola vista.
- **Pasos propuestos (los hace el dueño; no se descarga ni instala nada desde aquí):**
  1. Descargar el instalador de Windows desde la página de descargas de onorca.dev o de GitHub Releases de stablyai/orca, y comprobar que el enlace sale del sitio oficial.
  2. Instalar y, en los ajustes, desactivar la telemetría. No activar la app móvil ni su relay hasta que se documente.
  3. Abrir este repositorio. Usar una rama por tarea y no dejar que dos agentes editen los mismos archivos.
  4. Antes de fusionar el trabajo de cualquier agente, ejecutar `npm run check`.

## 4. Bloques para aprobar (uno por uno)

| Bloque | Qué incluye | Quién actúa | Requiere |
|---|---|---|---|
| **A. Higiene global** | Respaldar y retirar de `~/.claude/skills` las 28 copias que repiten skills del repo; dejar las 2 exclusivas. Copiar el `audio-specialist` del repo sobre el global. Corregir la referencia a `team/ROUTING.md` en `~/.claude/CLAUDE.md` | Claude | Tu aprobación. **Afecta a La Central del Queso**: perdería las 12 skills hoy visibles por la copia global (seguirían disponibles leyendo el repo) |
| **B. Ventas** | 1) Autorizar HubSpot en `/mcp`, en solo lectura. 2) Instalar SkillSpector fijado. 3) Pasar por el gate e importar 4–6 skills de `sales` y 3 de marketingskills, adaptadas al español con fuente y licencia | 1) y 2) tú; 3) Claude | Aprobación de cada paso. SkillSpector es una instalación |
| **C. Operación** | Instalar los plugins `claude-md-management` y `hookify`; crear un hook que ejecute `build-agents --check` antes de cada commit; unificar las secciones repetidas de `CLAUDE.md` | Claude | Aprobación. Para editar `CLAUDE.md` primero hay que commitear o descartar tus cambios pendientes |
| **D. Orca** | Pasos de la sección 3 | Tú | Instalación en tu PC |
| **E. Después** | gsap-skills, chrome-devtools-mcp, playwright-mcp, promptfoo, claude-code-action, n8n, Figma | — | Revisión cuando haya un proyecto que lo necesite |

Implementación: rama nueva, un commit por bloque, `npm run check` y una prueba real de cada elemento. Sin push ni PR sin preguntar.

## 5. Diseño del equipo

**Roles que quedan (21):** sin cambios respecto a la fusión de ayer. Siguen pendientes los 4 adaptadores `altiora-*` y la reducción de direcciones ([auditoría §6](auditoria-infraestructura-agentes-2026-10-31.md)).

**Enrutamiento por intención (propuesta para un nuevo `team/ROUTING.md`, que repararía la referencia rota):**

| Intención | Agente | Skills principales |
|---|---|---|
| Diagnóstico o estrategia de un cliente | business-strategist | aem-company-builder, business-decision-gates |
| Marca | brand-strategist | premium-branding |
| Ventas y captación (primer cliente) | commerce-growth-director | high-ticket-offer, skills `sales` importadas, HubSpot (bloque B) |
| Web inmersiva | creative-director → web-engineer → qa-reviewer | immersive-commerce, immersive-interaction-lab, threejs-experience, gsap-animation |
| Anuncios y video | creative-ads-director | ai-video-direction, advertising-concept |
| Audio | audio-specialist | audio-production |
| Medición | growth-analyst | analytics, cro |
| Coordinación de varios roles | experience-director | altiora-agent-orchestrator; Orca para paralelizar (bloque D) |

**Cambios propuestos en las instrucciones (no aplicados):**
- `CLAUDE.md`: fusionar las cuatro secciones de After Effects en una; añadir una línea sobre el núcleo (`skill-core.json`) y otra sobre Orca.
- `AGENTS.md`: enlazar `team/ROUTING.md` como punto de entrada del enrutamiento.
- `INDEX.md`: es generado; cambia solo al ejecutar `npm run agents:build`.

## 6. Límites

- No se leyó el código de ningún candidato ni se ejecutó SkillSpector.
- Las estrellas y fechas vienen de la API de GitHub o de las páginas, el 2026-10-31/11-01. Las de Orca no cuadran entre fuentes.
- «Ahora» es prioridad de evaluación, no permiso de instalación.
