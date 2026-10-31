@AGENTS.md

## Equipo de agentes
Los 12 roles de `team/registry.md` están disponibles como subagentes en `.claude/agents/`. Para trabajo multirrol, coordinarse en el chat del equipo (`team/chat/README.md`) firmando como `claude/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

Índice completo en INDEX.md. En Claude Code: `/equipo <encargo>` reparte trabajo, `/chat-<rol> <mensaje>` habla con un agente, `/repos <necesidad>` consulta repositorios de referencia y cada skill de `skills/` está disponible como `/<nombre>` (las asignadas a un agente también se cargan solas). `.claude/skills/` e INDEX.md se generan con `npm run agents:build`; no editarlos a mano.

## Expansión audiovisual
Antes de tareas de Blender, Adobe, motion, VFX, anuncios o video programático, leer [Visual Studio](creative/visual-studio/README.md) y [router visual](creative/visual-studio/ROUTER.md). Se trata de una capa de orquestación que utiliza las skills existentes. La presencia de repositorios externos no implica instalación, capacidades de editor ni permisos de render.

## Skill operativa V2 (compartida con Gemini y Codex)
Si la intención del usuario contiene **motion graphics, After Effects, Premiere, Photoshop, Blender, VFX, cinematic, shaders, web 3D o anuncios**, cargar [protocolo](creative/visual-studio/AGENT-PORTABILITY.md), [matriz](creative/visual-studio/PRODUCTION-MATRIX.md) y el [playbook correspondiente](creative/visual-studio/playbooks/README.md). Delegar a los agentes existentes solo las skills pertinentes, sin instalar servidores MCP de terceros por defecto.
