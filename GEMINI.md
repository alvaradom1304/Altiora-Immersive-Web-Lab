# Gemini en Altiora

Seguir [AGENTS.md](AGENTS.md) y sus límites comerciales, de propiedad intelectual y autorización. Para trabajar como un rol, cargar `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia. Los archivos y tests no prueban conexiones de la sesión ni aprobación comercial.

## Antigravity — carga ligera
- `.agents/agents/` tiene los subagentes, `.agents/skills/` el catálogo de skills y `.agents/rules/` las reglas de selección. Elegir solo los roles y skills del encargo; no recorrer el catálogo completo.
- Cargar una skill solo cuando se va a usar, y sus `references/` solo si el paso lo exige. Los documentos enlazados abajo se leen bajo demanda, nunca por adelantado.
- Las fuentes están en `team/` y `skills/`. `npm run agents:build` sincroniza Claude Code y Antigravity; `npm run check` verifica diferencias.
- Para reanudar: leer [checkpoint](continuity/checkpoint.json) y [recovery runbook](continuity/README.md), ejecutar `npm run resume` si hay checkout y verificar PRs/CI.
- Para diagnóstico, recuperación de skills o QA: [operación compartida](docs/operations/SHARED-OPERATIONS.md).

## Índice bajo demanda (leer solo si el encargo lo pide)
| Intención | Leer |
|---|---|
| Marketing, branding, videos, anuncios | `creative-ads-os/WORK_ROUTER.md` |
| Cualquier intención visual (motion, 3D, VFX, cinematic, shaders, Blender, Adobe) | [Director Audiovisual](creative/visual-studio/agents/audiovisual-experience-director.md), que decide la herramienta según resultado, acceso real y costo; después [protocolo portable](creative/visual-studio/AGENT-PORTABILITY.md) |
| Producción visual entre IAs | [Visual Studio](creative/visual-studio/README.md), [router](creative/visual-studio/ROUTER.md), [workflow multi-IA](docs/workflows/visual-production-multi-ai.md) |
| After Effects y su MCP local | [guía AE](creative/visual-studio/after-effects/README.md) y [MCP-SETUP](creative/visual-studio/after-effects/MCP-SETUP.md); Gemini CLI usa `.gemini/settings.json`, Antigravity `.agents/mcp_config.json` |
| Mejora continua y nuevas versiones | [visual-tech-scout](creative/visual-studio/agents/visual-tech-scout.md), [SCOUT-V3](creative/visual-studio/SCOUT-V3.md) |

Toda herramienta externa (Blender, Adobe, MCP) queda como UNKNOWN hasta comprobar conexión, versión y permisos desde el cliente. No instalar software, ejecutar renders ni conectar apps sin autorización expresa.

<!-- ALTIORA_BIBLIOTECARIO_START -->
## Selección y contexto
En cada mensaje conserva el objetivo activo y elige entre las capacidades realmente disponibles. Usa la skill más específica y carga sus referencias solo cuando hagan falta; si nada aporta, resuelve directamente. Para selección ambigua consulta [Bibliotecario](skills/altiora-bibliotecario/SKILL.md). En trabajos pequeños evita equipos; delega solo con autorización y capacidad real. Reutiliza evidencia vigente y responde con resultado, comprobación y límite material, sin repetir historia ni omitir requisitos para ahorrar. No presupongas ahorro medido, modelos cambiados o conexiones por existir un archivo.
<!-- ALTIORA_BIBLIOTECARIO_END -->

<!-- ALTIORA_AUDIO_SPECIALIST -->
Para sonido, voz, música, restauración, mezcla o masterización, usar [audio-specialist](team/agents/audio-specialist.md) y [audio-production](skills/audio-production/SKILL.md). Cargar solo la modalidad necesaria; separar medición, escucha y aprobación.
