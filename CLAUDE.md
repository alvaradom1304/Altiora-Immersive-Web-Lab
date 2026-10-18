@AGENTS.md

## Equipo de agentes
Los 12 roles de `team/registry.md` están disponibles como subagentes en `.claude/agents/`. Para trabajo multirrol, coordinarse en el chat del equipo (`team/chat/README.md`) firmando como `claude/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

Índice completo en INDEX.md. En Claude Code: `/equipo <encargo>` reparte trabajo, `/chat-<rol> <mensaje>` habla con un agente, `/repos <necesidad>` consulta repositorios de referencia y cada skill de `skills/` está disponible como `/<nombre>` (las asignadas a un agente también se cargan solas). `.claude/skills/` e INDEX.md se generan con `npm run agents:build`; no editarlos a mano.
