# Gemini en Altiora

Seguir [AGENTS.md](AGENTS.md). Para trabajar como un rol del equipo, cargar su prompt en `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

## Antigravity — Agentes, skills y reglas compartidos
- `.agents/agents/` contiene subagentes, `.agents/skills/` las mismas skills del catálogo Altiora y `.agents/rules/` las reglas de selección de roles.
- Para marketing, branding, videos y anuncios leer `creative-ads-os/WORK_ROUTER.md`, e invocar solo los roles y skills pertinentes.
- Las fuentes están en `team/` y `skills/`. Usar `npm run agents:build` para sincronizar Claude Code y Antigravity y `npm run check` para verificar diferencias.
- Mantener los límites comerciales, de propiedad intelectual y autorización definidos en AGENTS.md.

## Orquestación por intención
Leer `docs/operations/universal-capability-router.md` y, si hay terminal, ejecutar `npm run route -- --json "descripción concreta"`. Activar las skills y los subagentes disponibles pertinentes; para brechas de capacidad crear propuesta revisable y ejecutar la auditoría de seguridad antes de importar recursos externos. Los roles descritos en Markdown no implican agentes corriendo.
