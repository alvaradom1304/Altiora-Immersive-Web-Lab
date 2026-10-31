# Gemini en Altiora

Seguir [AGENTS.md](AGENTS.md). Para trabajar como un rol del equipo, cargar su prompt en `team/agents/<rol>.md` y coordinarse en el [chat del equipo](team/chat/README.md) firmando como `gemini/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

## Expansión audiovisual
Para Antigravity/Gemini: leer [Visual Studio](creative/visual-studio/README.md), [router visual](creative/visual-studio/ROUTER.md) y [workflow multi-IA](docs/workflows/visual-production-multi-ai.md). Seguir el mismo brief, manifiesto de activos, gates y estados de QA usados por Claude y ChatGPT/Codex. La integración con Blender, Adobe y MCP requiere configuración y permisos locales reales.

## Skill operativa V2 (compartida con Claude y Codex)
Si la intención del usuario requiere **motion graphics, After Effects, Premiere, Photoshop, Blender, VFX, cinematic, shaders, web 3D o anuncios**, seguir [protocolo portable](creative/visual-studio/AGENT-PORTABILITY.md), [matriz profesional](creative/visual-studio/PRODUCTION-MATRIX.md) y [playbooks](creative/visual-studio/playbooks/README.md). Cada tool access se registra como UNKNOWN hasta comprobar conexión, versión y permisos; cualquier MCP externo se audita antes de ejecutar.

## Reanudación sin reconstruir el chat
Antes de continuar en Antigravity/Gemini, leer [checkpoint](continuity/checkpoint.json) y [recovery runbook](continuity/README.md), ejecutar `npm run resume` si hay checkout y verificar PRs/CI. Diferenciar documentación, CI probado y apps realmente conectadas.

## Visual Tech Scout — actualización periódica
Al solicitar mejora continua, leer el [rol de vigilancia](creative/visual-studio/agents/visual-tech-scout.md), el [reporte GitHub](continuity/visual-watch/README.md) y el [preflight](scripts/visual-preflight.mjs). Registrar la fuente, cambios técnicos, seguridad, licencias y evidencia de QA. GitHub Actions programa la revisión; Gemini/Antigravity no queda ejecutándose constantemente por existir este archivo.

## Punto de entrada audiovisual automático
Para cualquier intención visual, actuar primero como [Director de Experiencia Audiovisual](creative/visual-studio/agents/audiovisual-experience-director.md) y coordinar sus agentes especializados. La decisión sobre Blender, Adobe, Motion, Remotion, shaders o WebGL corresponde al director según resultado, acceso real y costo: no trasladar esa selección al usuario. El workflow no instala software por sí solo.

## Visual Studio V3 y skills actualizables
El Director Audiovisual consulta [SCOUT-V3](creative/visual-studio/SCOUT-V3.md) para nuevas versiones y selecciona por objetivo [CGI-color](creative/visual-studio/playbooks/advanced-cgi-color.md) o [2D-motion-artístico](creative/visual-studio/playbooks/illustration-particles.md). Las referencias externas no constituyen conexiones verificadas.

## Adobe After Effects
Leer [guía del puente AE](creative/visual-studio/after-effects/README.md) para comprobar `aerender`, preparar un `.aep` y ejecutar un render cuando el usuario lo permita. No dar por conectado Adobe por leer un archivo; elegir alternativa segura si falla el preflight.

## MCP local After Effects para Gemini/Antigravity
Consultar [registro multi-cliente](creative/visual-studio/after-effects/MCP-SETUP.md) y el archivo de proyecto `.agents/mcp_config.json` generado desde la laptop. Para Gemini CLI usar `gemini mcp list`; para Antigravity revisar su panel MCP. Los renders requieren autorización expresa por proyecto.

## After Effects en PC — Gemini / Antigravity
El servidor local `altiora-after-effects` se prepara mediante `npm run after-effects:setup -- --apply` desde el repositorio de la computadora. Gemini CLI usa `.gemini/settings.json`; Antigravity IDE/CLI usa `.agents/mcp_config.json` generado localmente. Revisar [guía MCP](creative/visual-studio/after-effects/MCP-SETUP.md) y confirmar herramientas desde el cliente antes de declarar acceso. El Director determina cuándo usar AE; no conectar apps desconocidas ni ejecutar renders sin autorización del PC.

<!-- ALTIORA_BIBLIOTECARIO_START -->
## Selección y contexto
En cada mensaje conserva el objetivo activo y elige entre las capacidades realmente disponibles. Usa la skill más específica y carga sus referencias solo cuando hagan falta; si nada aporta, resuelve directamente. Para selección ambigua consulta [Bibliotecario](skills/altiora-bibliotecario/SKILL.md). En trabajos pequeños evita equipos; delega solo con autorización y capacidad real. Reutiliza evidencia vigente y responde con resultado, comprobación y límite material, sin repetir historia ni omitir requisitos para ahorrar. No presupongas ahorro medido, modelos cambiados o conexiones por existir un archivo.
<!-- ALTIORA_BIBLIOTECARIO_END -->

<!-- ALTIORA_AUDIO_SPECIALIST -->
Para sonido, voz, música, restauración, mezcla o masterización, usar [audio-specialist](team/agents/audio-specialist.md) y [audio-production](skills/audio-production/SKILL.md). Cargar solo la modalidad necesaria; separar medición, escucha y aprobación.
