# Altiora — Política de capacidades universales

**Versión:** 1.0 · 2026-10-30
**Alcance:** Todas las empresas, campañas y proyectos de Altiora en este repositorio.

## Contrato por defecto
Cada vez que alguien pida "creá/agregá/mejorá una skill, agente, subagente o superagente", el responsable de la tarea debe tratar la capacidad como **multiplataforma por defecto**. El usuario no tiene que repetir "para Claude Code, Antigravity y Codex".

1. Antes de crear, buscar equivalentes en `skills/`, `team/agents.json`, `team/local-agents.json` y `team/roles/`. Ampliar una capacidad existente si cubre la misión; no inflar el catálogo.
2. Crear o editar únicamente la **fuente canónica**: `skills/<slug>/SKILL.md` y archivos asociados para skills; `team/agents.json` o `team/local-agents.json` más `team/roles/<id>.md` para agentes. Un "superagente" es un rol orquestador que puede delegar según la herramienta, no un nuevo runtime o producto garantizado.
3. Reutilizar la misma misión, criterios de aceptación, evaluación y límites de seguridad; adaptar solo el formato de integración a cada herramienta.
4. **En el mismo encargo**, ejecutar `npm run capability:sync` tras cambiar fuentes. Esta orden regenera adaptadores para los tres clientes y después ejecuta `npm run check`. No entregar el cambio como completado si falta sincronización o algún check falla.
5. Comprobar que Claude Code usa `.claude/skills/` y `.claude/agents/`; Antigravity `.agents/skills/` y `.agents/agents/`; Codex descubre skills de `.agents/skills/` y recibe agentes configurados en `.codex/agents/`. Las reglas generales están en `AGENTS.md`, referenciadas desde `CLAUDE.md` y `GEMINI.md`.
6. Indicar qué se añadió, qué archivo es fuente, qué adaptadores se generaron y el resultado de pruebas. **Configurado** no implica que cada IDE lo haya cargado ni que un subagente se esté ejecutando.

## Definición de terminado
Una skill o agente nuevo no se declara integrado hasta que existan la fuente, los adaptadores generados, las verificaciones correctas y la documentación de uso. Una capacidad que dependa de software externo solo se declara operativa tras probarla en el entorno real.

## Límites de confianza y privacidad
Para importar herramientas o prompts de terceros, pasar primero por `docs/security/third-party-skill-gate.md`: procedencia y licencia, revisión fijada, inspección, escaneo cuando proceda y aprobación humana. No ejecutar código desconocido ni filtrar credenciales, medios de clientes o datos internos.

## Entorno y despliegue
La sincronización es **por repositorio y rama**, no una instalación mágica en todas las aplicaciones o máquinas. Las tres IAs deben abrir esta raíz de proyecto en una rama actualizada. Si se trabaja en otra carpeta o clon, hay que traer estos cambios. Las pull requests no cambian `main` hasta fusionarlas.

## Casos de aceptación
- Al añadir una skill válida, `npm run capability:sync` crea ambas exposiciones de skill (Claude y `.agents/`, reutilizada por Codex).
- Al añadir un agente a un registro y definir su rol, la orden crea los tres adaptadores correspondientes.
- Si se modifica una fuente y se omite la regeneración, `npm run check` falla en vez de declarar la sincronización exitosa.
- Si se propone un repositorio o skill externa no aprobada, se detiene la incorporación ejecutable hasta pasar el gate.
- Si un IDE no descubre la capacidad al abrir el proyecto, reportar esa limitación y probar su configuración local antes de decir que funciona.

**Regla operativa:** No preguntar si la capacidad es para Claude, Antigravity o Codex: lo es para los tres, a menos que el usuario excluya expresamente alguno.
