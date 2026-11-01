# Altiora — Selección de repositorios para producción audiovisual
Fecha de auditoría documental: 2026-10-30. Destino: Claude Code + Antigravity; El Tilichero como primer caso práctico.

Comparación con Altiora: `ai-video-direction` cubre planificación y SOP de postproducción; `cinematic-direction` cámara/continuidad; `motion-design` movimiento; `creative-ads-director` coordina; `visual-producer` y `qa-reviewer` revisan. La brecha no es de agentes: es de herramientas ejecutables para subtítulos, cortes, animaciones, renders y validación de repositorios externos.

| Repositorio (revisión fijada) | Aporte no duplicado | Decisión | Riesgo / condición |
|---|---|---|---|
| [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector/commit/54921c8c7c23008c8af2328d5ab492a904b6ece4) | Scanner estático de skills, prompt injection, exfiltración, dependencias y MCP. | Integrar gate CLI, instalación local pendiente | Apache-2.0; Python >=3.12,<3.16. Un SAFE no es garantía ni permiso de instalación. |
| [remotion-dev/skills](https://github.com/remotion-dev/skills/tree/30d4553ecd46fbc5212fd0ff006ae43af522158b) | Guías oficiales `remotion-render`, `remotion-captions`, `remotion-markup` para IA. | Adoptar como REFERENCIA, sin copiar ni ejecutar instalador | Revisar licencia de material importado y contexto de la versión; no aumentar artificialmente el conteo de skills. |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion/commit/3b7e7008a495094424859e9cf4f66f4844d2dfd9) | Composición React, tipografía animada, transiciones y render. | Candidato core al existir video real y Node | Licenciamiento comercial de Remotion por verificar según uso; instalar paquetes versionados en proyecto audiovisual, no en el OS raíz. |
| [WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor/commit/2e46bc706bfac15532fea2fa5fa7cd0183001dc1) | Primer corte sugerido por silencio o movimiento; exporta a editores. | Opción para edición preliminar | Unlicense según metadata; los recortes propuestos requieren revisión narrativa para no cortar humor/pausas. |
| [openai/whisper](https://github.com/openai/whisper/commit/86098128c0b4f24f0e2aa2994de830614b474227) | Transcripción y marcas de tiempo para captions. | Opción para diálogo real | MIT; elegir ejecución local según hardware, no subir voces privadas sin autorización. |
| [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Alternativa de transcripción optimizada. | Evaluar SOLO como alternativa a Whisper | MIT; no instalar dos motores por defecto. |
| [mifi/editly](https://github.com/mifi/editly/commit/dc46674052eacd15ef6e0f563a58eb378b3804ad) | Edición declarativa programática. | HOLD | Mayor solapamiento con Remotion + FFmpeg; última revisión de referencia de 2025. |
| [ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) | Edición FFmpeg dentro de navegador. | HOLD | No mejora automáticamente el flujo local de Claude Code; evaluar si se crea un editor web. |

## Orden de uso — sin superagente nuevo
1. `creative-ads-director` examina material: guion, cortes y criterios comerciales.
2. `visual-producer` + `ai-video-direction` extraen selects con FFmpeg/ffprobe; Auto-Editor puede SUGERIR cortes, no aprobarlos.
3. Whisper o faster-whisper transcribe solo audio autorizado; contrastar cada subtítulo con voz real.
4. `motion-designer` usa Remotion, siguiendo sus guías oficiales según versión, para tipografía, composición y audio.
5. `qa-reviewer` prueba el MP4 final con ffprobe y visionado humano; ninguna skill o repo sustituye la reproducción del render.

Toda nueva importación que introduzca SKILL.md, agentes, scripts, instaladores o plugins pasa primero por [control de seguridad](../security/third-party-skill-gate.md). No ejecutar scripts de repositorios consultados por el simple hecho de estar en esta lista. Herramientas incluidas aquí son **seleccionadas y documentadas**, no instaladas ni probadas en la laptop. No se subieron crudos, no se compraron créditos ni se publicaron anuncios.
