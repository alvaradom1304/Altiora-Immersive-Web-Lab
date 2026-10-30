@AGENTS.md

## Equipo de agentes
Los roles canónicos de `team/registry.md` y los adaptadores locales de `team/local-agents.json` están disponibles como subagentes en `.claude/agents/`. Para trabajo multirrol, coordinarse en el chat del equipo (`team/chat/README.md`) firmando como `claude/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

Índice completo en INDEX.md. En Claude Code: `/equipo <encargo>` reparte trabajo, `/chat-<rol> <mensaje>` habla con un agente, `/repos <necesidad>` consulta repositorios de referencia y cada skill de `skills/` está disponible como `/<nombre>` (todas son seleccionables por pertinencia salvo restricción explícita en la fuente). `.claude/skills/` e INDEX.md se generan con `npm run agents:build`; no editarlos a mano.

## Descubrimiento verificable
Consultar `references/discovery-manifest.json` para reconciliar fuentes, agentes y comandos auxiliares. No contar `/chat-*`, `/equipo` o `/repos` como skills del catálogo. Los roles y subagentes son las mismas identidades; no sumarlos dos veces. Si falta una capacidad, leer `docs/operations/claude-discovery.md`. Abrir esta raíz y la rama actualizada; no confundir el catálogo con una sesión activa.

## Activación automática por intención
Ante peticiones en lenguaje natural aplicar docs/operations/autonomous-capability-routing.md y, si Bash está disponible, npm run route -- "encargo". Elegir 1–3 skills por pertinencia, delegar solo tareas separables y mantener evidencia. Ante brechas genuinas, consultar la fábrica de skills y crear un borrador revisable, no instalar automáticamente. Revisar seguridad y checkpoints humanos.
