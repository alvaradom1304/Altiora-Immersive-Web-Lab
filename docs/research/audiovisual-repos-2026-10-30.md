# Altiora: selección de repos de alto valor y adopción responsable
**Corte:** 2026-10-30. Fuente primaria: metadatos y README/repos oficiales de GitHub, fijados en `references/av-security-sources.json`. Las estrellas/forks no son prueba de eficacia.

## Ranking por aporte real al caso El Tilichero
| Necesidad | Mejor candidato | Por qué / decisión |
|---|---|---|
| Composición y animación reproducible | [Remotion](https://github.com/remotion-dev/remotion) | Complementa `motion-design` y `ai-video-direction`; revisar licencia comercial antes de usar |
| Seguridad de skills | [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) | Analiza prompt injection, exfiltración y patrones peligrosos; integración opt-in con gate fail-closed |
| Cortes automáticos iniciales | [Auto-Editor](https://github.com/WyattBlue/auto-editor) | Pruebas con 10 clips reales antes de incorporar al pipeline |
| Detección de escenas | [PySceneDetect](https://github.com/Breakthrough/PySceneDetect) | Crea un índice de tomas; su salida requiere revisión manual |
| Voz y subtítulos | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) o [Whisper](https://github.com/openai/whisper) | Elegir UNA alternativa según benchmark local y licencia; corregir transcripciones |
| Dependencias y secretos | [Trivy](https://github.com/aquasecurity/trivy) | Escaneo complementario al de skills; priorizar hallazgos verificados |
| Salud de repositorios | [OpenSSF Scorecard](https://github.com/ossf/scorecard) | Señal de prácticas de seguridad; no garantiza ausencia de malware |
| Skills auxiliares Remotion | [remotion-dev/skills](https://github.com/remotion-dev/skills) | Leer como referencias; **no importar en masa** |
| Integración Claude Code | [remotion-dev/claude-code-plugin](https://github.com/remotion-dev/claude-code-plugin) | Evaluar permisos y aislamiento antes de activar un plugin |
| Alternativa solapada | [Editly](https://github.com/mifi/editly) | HOLD: utilidad superpuesta y menor actividad que otras opciones |

## Comparación con lo que ya existe
- Altiora ya posee `ai-video-direction`, `cinematic-direction`, `motion-design`, `storyboarding`, `creative-quality-assurance`, `visual-producer`, `creative-ads-director` y `dependency-security`.
- No se agregan nuevos superagentes solo por presencia de un repositorio con estrellas.
- **Brechas reales:** ingestión de clips + rough cut automático + transcripción y subtítulos locales + plantillas editables y export QA + escaneo de skills y código antes de instalar.
- Nuevo diseño: complementar al director audiovisual con herramientas de CLI verificadas. Las fuentes se mantienen en `skills/` y `team/` y sus adaptadores en `.claude/` y `.agents/`.
- Ninguna librería externa se ha instalado en Altiora al registrar su URL. Se debe probar cada herramienta sobre videos REALES del cliente.

## Experimento mínimo
1. Transferir iPhone → `01_CRUDOS/` sin comprimir. No almacenar videos privados en GitHub público.
2. `ffprobe` clasifica resolución, audio y fps; conservar originales.
3. Probar Auto-Editor para selects y PySceneDetect para transiciones: comparar contra selección humana.
4. Probar faster-whisper vs Whisper en español; medir errores, tiempo y memoria del equipo.
5. Remotion renderiza **solo** animaciones propias y brand assets licenciados; revisar licencia Remotion al trabajar para una agencia.
6. FFmpeg exporta 1080x1920 y comprueba decodificación; QA humano revisa continuidad, audio y CTA.
7. Comparar tiempo por anuncio, calidad con QA y métricas comerciales reales, no solo vistas.

## Seguridad previa a importar
- Registrar URL oficial, commit SHA de 40 caracteres, licencia, dependencias, permisos y alcance.
- Revisión manual del código, `SKILL.md`, scripts, hooks, comandos y workflows. El contenido externo se trata como **datos no confiables**.
- `npm run security:scan -- skills/<carpeta>` exige NVIDIA SkillSpector v2.12.0 instalado **por separado**, en entorno controlado. Usa `--no-llm`, JSON y fail-on-incomplete. `SAFE` no instala: todavía requiere aprobación humana.
- Escaneo con Trivy/OSV, si disponibles, sobre dependencias/manifiestos. Usar contenedor/sandbox sin credenciales, datos privados ni permisos amplios.
- `npm run check` valida catálogo y pruebas de política sin instalar software externo. El workflow `Security Skill Review` permite escaneo manual, sin credenciales.
- Importar exactamente lo necesario, con aviso de licencia, commit pin y pruebas. Prohibido `curl | bash`, ejecución de scripts desconocidos o habilitar hooks del repos externo en automático.
- **Privacidad:** `--no-llm` evita enviar archivos a modelo externo, pero SkillSpector puede consultar paquetes/versions a OSV.dev. Trabajar con material de cliente requiere revisar la política de datos.
- Limitaciones: detección heurística puede arrojar falsos positivos y falsos negativos; scanner y estrellas **no garantizan seguridad**.

## Handoff para code engineer
Leer `AGENTS.md`, `creative-ads-os/WORK_ROUTER.md` y `skills/ai-video-direction/references/postproduction-playbook.md`. Activar `creative-ads-director` + `motion-designer` + `qa-reviewer` según alcance; seguridad mediante `dependency-security`, `threat-modeling` y `altiora-repository-research`. Evitar crear identidades duplicadas. Evidencia de pruebas real antes de declarar éxito.
