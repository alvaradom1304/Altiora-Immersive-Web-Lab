# Gemini en Altiora

Seguir [AGENTS.md](AGENTS.md). Para trabajar como un rol del equipo, cargar su prompt en `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

## Antigravity — Agentes, skills y reglas compartidos
- `.agents/agents/` contiene subagentes, `.agents/skills/` las mismas skills del catálogo Altiora y `.agents/rules/` las reglas de selección de roles.
- Para marketing, branding, videos y anuncios leer `creative-ads-os/WORK_ROUTER.md`, e invocar solo los roles y skills pertinentes.
- Las fuentes están en `team/` y `skills/`. Usar `npm run agents:build` para sincronizar Claude Code y Antigravity y `npm run check` para verificar diferencias.
- Mantener los límites comerciales, de propiedad intelectual y autorización definidos en AGENTS.md.

## Postproducción de clientes
Para editar desde Antigravity leer `docs/video/VIDEO_WORKSPACES.md`, iniciar campaña mediante `npm run video:project` y consultar la skill `.agents/skills/ai-video-direction/SKILL.md`. No inventar renders ni exponer crudos.

## Regla universal de creación
Toda nueva skill, agente, subagente o superagente solicitado para Altiora debe implementarse para **Antigravity, Claude Code y Codex** sin que el usuario tenga que repetirlo. Leer `docs/operations/UNIVERSAL_CAPABILITIES.md`; trabajar en fuentes canónicas y ejecutar `npm run capability:sync` en el mismo encargo. No confundir adaptadores creados con carga efectiva en un IDE.
