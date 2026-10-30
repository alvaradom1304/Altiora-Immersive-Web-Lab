# Gemini en Altiora

Seguir [AGENTS.md](AGENTS.md). Para trabajar como un rol del equipo, cargar su prompt en `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

## Antigravity — Agentes, skills y reglas compartidos
- `.agents/agents/` contiene subagentes, `.agents/skills/` las mismas skills del catálogo Altiora y `.agents/rules/` las reglas de selección de roles.
- Para marketing, branding, videos y anuncios leer `creative-ads-os/WORK_ROUTER.md`, e invocar solo los roles y skills pertinentes.
- Las fuentes están en `team/` y `skills/`. Usar `npm run agents:build` para sincronizar Claude Code y Antigravity y `npm run check` para verificar diferencias.
- Mantener los límites comerciales, de propiedad intelectual y autorización definidos en AGENTS.md.

## Activación automática por intención
Leer docs/operations/autonomous-capability-routing.md y con terminal ejecutar npm run route -- "encargo". Contrastar con skills/, brief y reglas del proyecto. Si falta capacidad evaluar REUSE/IMPROVE/CREATE_DRAFT/DEFER; usar la fábrica de skills solo para propuestas revisables. No instalar repositorios externos sin gate ni afirmar sincronización automática de sesiones Gemini, ChatGPT o Claude.
