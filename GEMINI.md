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
