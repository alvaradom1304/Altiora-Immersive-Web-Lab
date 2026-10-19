# Chat del equipo: dividir tareas entre IAs

Claude, Codex, Gemini, ChatGPT y las personas del equipo trabajan sobre el mismo tablero y el mismo hilo de mensajes. Cada participante firma como `<ia>/<rol>`: `claude/web-engineer`, `gemini/business-strategist`, `humano/experience-director`. Los roles son los 12 del [registro](../registry.md); los agentes están en `.claude/agents/` (Claude Code) y en [team/agents](../agents/experience-director.md) (cualquier otra IA).

## Flujo

1. **Dividir.** El Director de experiencia (persona o IA) parte el encargo en tareas pequeñas, una por rol, con criterio de aceptación, dependencias y archivos:
   ```sh
   npm run chat -- add "Charter de negocio" --role business-strategist --ai gemini --reviewer experience-director --files docs/charter.md --accept "objetivos, KPIs e hipótesis" --as humano/experience-director
   ```
   `--ai` es una sugerencia según fortalezas (ver abajo); cualquier IA puede tomar una tarea libre de su rol.
2. **Reclamar.** Antes de tocar archivos: `npm run chat -- claim <id> --as codex/web-engineer`. Si otra IA ya la tiene, el comando lo impide; también si dependencias siguen abiertas.
3. **Hablar.** Preguntas y entregas entre roles: `npm run chat -- post --as codex/web-engineer --to ui-designer --task <id> "¿Estados de error del formulario?"`. Destinatario: un rol, una IA, `ia/rol` o `todos`.
4. **Cerrar.** `done <id> --note "resultado y evidencia"` avisa al revisor. `block <id> --note "motivo"` avisa al director. `release <id>` devuelve la tarea.
5. **Consultar.** `npm run chat -- board`, `inbox <ia/rol>`, `read`, `show <id>`.

Regla de oro: **una tarea, un dueño, sus archivos**. Dos IAs nunca editan los mismos archivos a la vez; lo que pertenece a otro rol se pide por el chat.

## Dónde viven los datos

- Por defecto en esta carpeta: `messages.jsonl` (Git lo fusiona por unión, ver `.gitattributes`) y `tasks/<id>.json` (un archivo por tarea para evitar conflictos). Cada IA hace commit y pull de su rama como siempre.
- Para coordinarse en tiempo real en la misma máquina sin commits, apuntar todas las IAs a una carpeta compartida: `ALTIORA_CHAT_DIR=/ruta/compartida npm run chat -- board`.

## Cómo participa cada IA

| IA | Cómo se conecta | Fortalezas habituales para repartir |
|---|---|---|
| Claude Code | Lee `CLAUDE.md`; los 12 roles son subagentes (`.claude/agents/`). `/chat-<rol> <mensaje>` abre el chat de un agente con su bandeja ya cargada; `/equipo` muestra el tablero. Ver [INDEX.md](../../INDEX.md). | Orquestación, código con muchos archivos, revisión, redacción en español |
| Codex (CLI/IDE) | Lee `AGENTS.md`. Indicarle: «Actúa como el rol de `team/agents/<rol>.md`». | Implementación y pruebas acotadas |
| Gemini CLI | Lee `GEMINI.md`. Mismo uso que Codex. | Investigación con contexto largo, análisis de documentos |
| ChatGPT, Gemini web u otra IA sin terminal | Pegar `team/agents/<rol>.md` y la salida de `npm run chat -- show <id>`. Una persona registra la respuesta con `post` y `done`. | Ideación, copy, imágenes |

Las fortalezas son orientativas: comprobar resultados en cada proyecto y anotar en el chat qué IA funcionó mejor para qué tarea, para repartir mejor en el siguiente ciclo.
