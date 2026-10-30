@AGENTS.md

## Equipo de agentes
Los roles canónicos de `team/registry.md` y los adaptadores locales de `team/local-agents.json` están disponibles como subagentes en `.claude/agents/`. Para trabajo multirrol, coordinarse en el chat del equipo (`team/chat/README.md`) firmando como `claude/<rol>`: reclamar la tarea antes de editar y cerrar con evidencia.

Índice completo en INDEX.md. En Claude Code: `/equipo <encargo>` reparte trabajo, `/chat-<rol> <mensaje>` habla con un agente, `/repos <necesidad>` consulta repositorios de referencia y cada skill de `skills/` está disponible como `/<nombre>` (todas son seleccionables por pertinencia salvo restricción explícita en la fuente). `.claude/skills/` e INDEX.md se generan con `npm run agents:build`; no editarlos a mano.

## Descubrimiento verificable
Consultar `references/discovery-manifest.json` para reconciliar fuentes, agentes y comandos auxiliares. No contar `/chat-*`, `/equipo` o `/repos` como skills del catálogo. Los roles y subagentes son las mismas identidades; no sumarlos dos veces. Si falta una capacidad, leer `docs/operations/claude-discovery.md`. Abrir esta raíz y la rama actualizada; no confundir el catálogo con una sesión activa.

## Orquestación autónoma por pertinencia
Ante una tarea multietapa, consultar `docs/operations/universal-capability-router.md` y ejecutar `npm run route -- --json "descripción concreta"` cuando exista terminal. Elegir los roles/skills propuestos solo si realmente se ajustan al brief; coordinar mediante `team/chat`. No pedir al usuario nombres de skills que ya figuran en el catálogo. Si falta capacidad, `--draft` crea una propuesta revisable, no una instalación.
