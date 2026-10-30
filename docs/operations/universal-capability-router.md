# Altiora Universal Capability Router (operativo, no servicio residente)

## Regla multi-IA
Claude Code, Codex/ChatGPT Work, Gemini CLI y Antigravity deben leer AGENTS.md y el brief. Ejecutar desde la raíz del proyecto `npm run route -- --json "descripción de la tarea"` cuando dispongan de terminal. Si el cliente no tiene terminal, aplicar manualmente el mismo criterio y registrar que no se ejecutó el enrutador.
El script es un **clasificador determinista** y emite un **plan**, no invoca modelos, agentes, APIs ni herramientas externas. No garantiza detección semántica completa: el coordinador valida cada resultado contra el objetivo.

## Cadena de decisión
1. Comprender alcance, objetivo empresarial, evidencia, derechos, presupuesto, plazo y definición de listo. No forzar los mismos efectos visuales en todos los clientes.
2. Consultar skills existentes de `skills/` y roles de `team/agents.json` y `team/local-agents.json`. Preferir REUSE; elegir un director y 1-3 skills pertinentes; no cargar las 261 a la vez.
3. Si requiere varias disciplinas, asignar subtareas acotadas en `team/chat` (una tarea/un dueño/archivos) y QA independiente. Solo invocar subagentes reales si el entorno ofrece esa función; no fingir delegación paralela.
4. Si falta capacidad, auditar solapamiento con `altiora-agent-orchestrator`, `aem-skill-factory` y `skill-creator`. Ejecutar `npm run route -- --draft "tarea"` para generar propuesta de capacidad, **no** una skill instalada. Con investigación, ejemplos, pruebas semánticas, licencia y revisión, crear la skill fuente en `skills/<nombre>/SKILL.md` y luego generar puentes `npm run agents:build`.
5. Para repositorios externos comparar utilidad, mantenimiento, demostraciones en trabajo propio, compatibilidad, coste total y licencia. No basarse solo en estrellas. Registrar SHA fijo y aplicar `docs/security/third-party-skill-gate.md`; nunca instalar, descargar scripts ejecutables o conectar credenciales en automático.
6. QA: pruebas funcionales, calidad visual original, accesibilidad, rendimiento, derechos y efecto comercial medible. El agente coordinador puede rechazar resultados y devolver iteraciones verificables.
7. Publicar métricas: tiempo, tasa de entregables aceptados, retrabajo, originalidad percibida, velocidad de carga, consultas cualificadas y conversiones solo cuando existan datos reales. Ninguna cifra debe inventarse.

## Ejemplo — El Tilichero
`npm run route -- --json "Editá los videos de earbuds, motion graphics y MP4"` propone `creative-ads-director`, `motion-designer`, `visual-producer`, `qa-reviewer` y las skills `ai-video-direction`, `motion-design`, `creative-quality-assurance`. Consultar `creative-ads-os/WORK_ROUTER.md` y el playbook de postproducción. Los repositorios en `source_candidates` son **candidatos**, no dependencias instaladas.
Para usar videos originales, deben estar disponibles en la computadora con Claude Code/Antigravity (sin subir medios privados a GitHub). Revisión y exportación reales requieren material y runtime.

## Límites por superficie
- **Claude Code**: `CLAUDE.md`, `.claude/agents/` y `.claude/skills/` generadas.
- **Antigravity y Gemini**: `GEMINI.md`, `.agents/skills/` y `.agents/agents/`, o cargar los prompts de `team/agents/` cuando proceda.
- **Codex**: `AGENTS.md`, `.agents/skills/` y roles en `team/agents/` según herramientas disponibles.
- **ChatGPT en chat sin workspace**: no lee automáticamente esta carpeta ni inicia procesos locales; requiere acceso al repo mediante conector, Work o archivos aportados y permisos de ejecución. Una cuenta distinta o sesión web no queda sincronizada por GitHub automáticamente.

## Garantía de seguridad
Cada herramienta mantiene sus permisos y límites propios. El router no pide credenciales, no ejecuta dependencias externas y no evita por sí solo ataques ni valida calidad creativa. El protocolo es compartido; la ejecución real depende de la sesión conectada.

## Pruebas
`npm run check` incluye el router y casos de regresión. `npm run route -- --json "tarea"` imprime el plan. `--draft` crea una propuesta fuera de `skills/` **solo si falta una capacidad**; jamás activa ni publica la propuesta.

## Referencias oficiales de interoperabilidad
- https://antigravity.google/docs/skills
- https://learn.chatgpt.com/docs/customization/overview
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/using-agent-skills.md
