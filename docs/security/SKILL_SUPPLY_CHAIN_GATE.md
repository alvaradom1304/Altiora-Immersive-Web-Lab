# Altiora: ingeniería de video y seguridad de skills externas
Fecha de revisión: 2026-10-30. **Evaluación documental. Ningún proyecto externo se instala automáticamente.**

## Comparación: valor nuevo respecto a Altiora
Las skills existentes `ai-video-direction`, `cinematic-direction`, `motion-design`, `storyboarding`, `creative-quality-assurance` y el agente `creative-ads-director` ya cubren estrategia, guion, dirección y QA. Faltaba una política ejecutable para terceros, una selección de herramientas y un mecanismo comprobable de aceptación de informes.

| Repositorio canónico | Contribución efectiva | Integración decidida | Límites |
|---|---|---|---|
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | Animaciones React, composición y render programático | EVALUAR en proyecto de edición, no añadir dependencia al catálogo base | Licencia comercial/versión y recursos a verificar |
| [remotion-dev/claude-code-plugin](https://github.com/remotion-dev/claude-code-plugin) | Skills oficiales de Remotion para Claude Code | CANDIDATO preferido, instalar por canal oficial tras revisión de permisos y dependencias | Plugin no equivale a editor instalado ni a video renderizado |
| [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | Montaje, normalización, códecs, QC con ffprobe | PREFERIDO cuando está disponible en la máquina del editor | Licencia LGPL/GPL según compilación, verificar binario |
| [WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor) | Detección de silencios y pre-cortes; exportar a editores | OPCIONAL para voz y tomas conversacionales; nunca borrar masters | Sus cortes son propuestas, no edición narrativa final |
| [openai/whisper](https://github.com/openai/whisper) | Transcripción local y subtítulos | OPCIONAL según idioma, privacidad y recursos del equipo | Revisar alucinaciones y texto manualmente |
| [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) | Análisis estático de skills, exfiltración, inyección, supply chain | GUARDIAN previo a importar skills/plugins; reporte obligatorio | Escáner no es sandbox, tiene falsos negativos |
| [mifi/editly](https://github.com/mifi/editly) | Montajes en código y transiciones | RESERVA: se solapa con FFmpeg/Remotion | Evitar nueva dependencia sin caso concreto |

**Criterios de preferencia:** mantenedor oficial, mantenimiento, licencia, documentación, integración local, historial de uso y pruebas reales. Popularidad en estrellas no demuestra conversiones comerciales. No se importan binarios ni fuentes externas en esta fase.

## Política de confianza previa a importar
1. Registrar URL oficial y SHA completo inmutable de revisión. Comprobar licencia, historial, mantenimiento y superficie de ejecución.
2. Mantener código ajeno en carpeta de cuarentena fuera de `skills/` y `.claude/`; no ejecutarlo, no instalar paquetes y no usar scripts tipo `curl | bash`.
3. Obtener informe de SkillSpector en modo estático `--no-llm` para no enviar contenidos a proveedores de LLM. **Precaución:** la comprobación de CVE puede consultar OSV.dev y transmitir nombres/versiones de dependencias, incluso con `--no-llm`.
4. Revisar manualmente cualquier salida, especialmente acceso a `.env`, credenciales, tokens, `~/.ssh`, subprocess, conexiones salientes, instrucciones para desactivar controles y cambios de configuración MCP.
5. Exportar reporte JSON y registrar si la cobertura fue completa. No usar `--ack-review` sin que el equipo revise el contenido y la procedencia. Si el reporte real usa otro formato, actualizar **con tests** el parser; no inventar campos para forzar aprobación.
6. Gate: `npm run security:gate -- --report reporte.json --source https://github.com/owner/repo --revision SHA40 --ack-review`. Bloquea score alto, CAUTION, DO_NOT_INSTALL, HIGH, cobertura desconocida y falta de revisión.
7. Gate superado **no instala nada**. Integrar cambios fuente en PR revisable, bloquear secretos, analizar dependencias y permisos, tests en sandbox con accesos limitados, CI y aprobación humana de merge.
8. Ejecutar herramientas de edición locales con mínimos permisos y aisladas de claves y cuentas de clientes. Nunca colocar grabaciones privadas ni tokens en un repositorio público.

## Guía de primera prueba audiovisual
- Transferir originales del iPhone sin comprimir a `01_CRUDOS/` fuera de Git.
- Ejecutar `ffprobe` antes de editar; revisar audio real y hacer selects.
- Producir dos narrativas para El Tilichero: humor y producto premium.
- Usar FFmpeg para montaje; Remotion para tipografía, packshot, animaciones, música con licencia y CTA. Auto-Editor puede preparar cortes en voz, Whisper preparar SRT.
- Conservar fuentes editables y renders 1080x1920; QA visual, audio, técnico y claims. No atribuir AirPods de Apple a earbuds genéricos.
- Sin archivos locales, herramientas validadas y revisión humana: `NOT_RUN`, no `SUCCESS`.

## Referencias directas
- https://docs.nvidia.com/skills/scanning-agent-skills
- https://github.com/NVIDIA/SkillSpector
- https://www.remotion.dev/docs/ai/claude-code-plugin
- https://github.com/WyattBlue/auto-editor
