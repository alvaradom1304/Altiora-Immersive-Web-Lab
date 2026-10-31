@AGENTS.md

## Equipo de agentes
Los 12 roles de `team/registry.md` están disponibles como subagentes en `.claude/agents/`. Para trabajo multirrol, coordinarse en el chat del equipo (`team/chat/README.md`) firmando como `claude/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

Índice completo en INDEX.md. En Claude Code: `/equipo <encargo>` reparte trabajo, `/chat-<rol> <mensaje>` habla con un agente, `/repos <necesidad>` consulta repositorios de referencia y cada skill de `skills/` está disponible como `/<nombre>` (las asignadas a un agente también se cargan solas). `.claude/skills/` e INDEX.md se generan con `npm run agents:build`; no editarlos a mano.

## Expansión audiovisual
Antes de tareas de Blender, Adobe, motion, VFX, anuncios o video programático, leer [Visual Studio](creative/visual-studio/README.md) y [router visual](creative/visual-studio/ROUTER.md). Se trata de una capa de orquestación que utiliza las skills existentes. La presencia de repositorios externos no implica instalación, capacidades de editor ni permisos de render.

## Skill operativa V2 (compartida con Gemini y Codex)
Si la intención del usuario contiene **motion graphics, After Effects, Premiere, Photoshop, Blender, VFX, cinematic, shaders, web 3D o anuncios**, cargar [protocolo](creative/visual-studio/AGENT-PORTABILITY.md), [matriz](creative/visual-studio/PRODUCTION-MATRIX.md) y el [playbook correspondiente](creative/visual-studio/playbooks/README.md). Delegar a los agentes existentes solo las skills pertinentes, sin instalar servidores MCP de terceros por defecto.

## Reanudación sin reconstruir el chat
Antes de continuar una tarea de Altiora, leer [checkpoint](continuity/checkpoint.json) y [recovery runbook](continuity/README.md), ejecutar `npm run resume` si hay checkout y verificar PRs/CI. Si el usuario dice «sigue», priorizar siguiente paso desbloqueado; no duplicar milestones completados ni pedir de nuevo el brief existente.

## Visual Tech Scout — actualización periódica
Para decidir nuevas librerías o actualizar pipelines consultar el [rol de vigilancia](creative/visual-studio/agents/visual-tech-scout.md), el [reporte semanal de GitHub Actions](continuity/visual-watch/README.md) y el [preflight real](scripts/visual-preflight.mjs). Priorizar cambios de licencia, seguridad y P0; proponer PR/piloto y registrar QA, nunca auto-instalar o fusionar sin revisión. El workflow es el monitor programado; el subagente Claude solo interviene cuando se ejecuta/autoriza.

## Punto de entrada audiovisual automático
Cuando haya petición visual activar el subagente `audiovisual-experience-director` antes de repartir el trabajo. Leer su [contrato de decisiones](creative/visual-studio/agents/audiovisual-experience-director.md). Este director escoge Blender/Adobe/Remotion/Three u otras opciones sin hacer elegir tecnología al usuario; delega a creative-director, visual-producer, motion-designer, web-engineer y QA. `/chat-audiovisual-experience-director` abre su bandeja; las ejecuciones dependen del acceso real al repositorio y herramientas.

## Visual Studio V3 y skills actualizables
El Director Audiovisual consulta [SCOUT-V3](creative/visual-studio/SCOUT-V3.md) para nuevas versiones y activa por intención [CGI-color](creative/visual-studio/playbooks/advanced-cgi-color.md) o [2D-motion-artístico](creative/visual-studio/playbooks/illustration-particles.md). Las nuevas herramientas son referencias, no dependencias ya instaladas.

## Adobe After Effects
El [puente local AE](creative/visual-studio/after-effects/README.md) permite comprobar `aerender`, planear un render y, con permiso explícito y archivo .aep local, ejecutarlo en una computadora con After Effects instalado. Si no hay acceso, delegar alternativa. El conector Adobe de ChatGPT es una integración distinta.

## MCP local After Effects para Claude Code
Consultar [registro multi-cliente](creative/visual-studio/after-effects/MCP-SETUP.md): `npm run ae:clients:plan` y, solo desde la laptop con permiso, `npm run ae:clients:connect`. Comprobar con `claude mcp list`. El Director Audiovisual puede entonces elegir AE si `aerender` funciona; nunca afirmar acceso del ChatGPT remoto.
