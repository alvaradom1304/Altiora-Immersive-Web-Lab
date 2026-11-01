# Flujo de delegación multi-IA con esfuerzo automático

Versión: 2 · 01/11/2026. Complementa a [ORQUESTADOR.md](ORQUESTADOR.md) y [ORCA-ALTIORA.md](ORCA-ALTIORA.md).

## Qué hace

Ante un único mensaje del usuario, `scripts/orca-dispatch.py`:

1. **Estudia el encargo con un modelo de alto rendimiento** (Claude Opus por defecto, vía `claude -p` sin herramientas). El modelo escribe un análisis: qué se pide, qué riesgo tiene y cómo dividirlo.
2. **Decide los flujos**: el mínimo necesario, cada uno con un objetivo verificable y sus dependencias (`depends_on`).
3. **Elige la IA de cada flujo**: `codex`, `claude` o `antigravity`, sin asignar ninguna que esté sin créditos.
4. **Elige el esfuerzo de razonamiento de cada flujo**: `low`, `medium`, `high`, `xhigh` o `max`.
5. **Valida el plan** contra las reglas locales: dominios, IA y niveles válidos, y skills existentes en el catálogo. Si el modelo falla o devuelve algo inválido, usa la heurística por palabras clave.
6. **Registra y lanza** en Orca (con `--execute` / `--launch-workers`). Los flujos con dependencias se registran pero esperan.
7. **Cambia de IA automáticamente** si un worker se queda sin créditos o cuota.

## Delegación por IA

| IA | Fortaleza | Respaldo si se queda sin créditos |
|---|---|---|
| **codex** | Finanzas, pricing, backend, n8n, Python, seguridad, validación | antigravity → claude |
| **claude** | Marca, copy, propuestas, Meta Ads, UX, React/Next.js | antigravity → codex |
| **antigravity** | 3D/WebGL, GSAP/scroll, auditoría visual en Orca Browser; respaldo general con cuota independiente | claude → codex |

- Un solo flujo → worktree actual (`current`). Varios → worktrees separados y un escritor por archivo.
- El modelo puede apartarse de la IA habitual de un dominio si lo justifica (por ejemplo, Codex sin créditos → Claude para una oferta de alto ticket).

## Esfuerzo de razonamiento

Lo decide el enrutador por flujo con esta rúbrica (la misma se usa como respaldo heurístico en `choose_effort()`):

| Nivel | Cuándo |
|---|---|
| `low` | Tarea mecánica, corta y sin riesgo |
| `medium` | Encargo concreto y acotado |
| `high` | Diseño, arquitectura, auditoría, investigación o 3D |
| `xhigh` | Consecuencias económicas, de datos, seguridad, producción o legales |
| `max` | Profundidad pedida explícitamente o riesgo crítico |

Cómo llega a cada worker (solo formas verificadas en esta PC):
- **Claude**: `claude --effort <level>`.
- **Codex**: `codex -c model_reasoning_effort=<level>` (no tiene `max`; se envía `xhigh`).
- **Antigravity**: no tiene flag verificado; el nivel va como instrucción en el encargo.

## Cambio automático por falta de créditos

- El estado vive en `.altiora/orchestration.json` → `ai_status` (`exhausted_until`, `reason`).
- Antes de repartir, el enrutador recibe qué IA están agotadas y no las asigna. Si aun así se asigna una, `apply_availability()` la reemplaza siguiendo la cadena de respaldo.
- Después de lanzar un worker, el script vigila su terminal (`--watch-seconds`, 60 por defecto). Si aparece un aviso de cuota del proveedor, marca la IA como agotada (24 h si el aviso no trae fecha) y relanza el flujo en la siguiente IA.
- El detector usa frases específicas de los proveedores (por ejemplo, "You've hit your usage limit"). Las frases genéricas se retiraron tras un falso positivo el 01/11/2026.

## Uso

```powershell
# Ver el plan sin registrar nada (llama a Opus: ~US$0,08–0,12 por consulta)
npm run orca:dispatch -- "mensaje del usuario"

# Plan sin coste de modelo (heurística por palabras clave)
npm run orca:dispatch -- --router heuristic "mensaje del usuario"

# Registrar y lanzar: desactivado (modo solo plan). Solo con autorización expresa del usuario:
#   $env:ALTIORA_DISPATCH_EXECUTE = "1"; npm run orca:dispatch -- --execute --launch-workers "mensaje"

# Cambiar el modelo o el esfuerzo del propio enrutador
npm run orca:dispatch -- --router-model opus --router-effort xhigh "mensaje"
```

## Límites

- **Modo solo plan (01/11/2026)**: `--execute` y `--launch-workers` salen con código 2 antes de llamar al modelo, salvo `ALTIORA_DISPATCH_EXECUTE=1`. Motivo: el enrutado automático cuesta, varía entre ejecuciones y producía cambios sin revisión; la IA de cada encargo la elige el usuario en Orca.

- **Coste**: cada enrutado con Opus cuesta dinero (medido: US$0,08–0,12 por consulta con esfuerzo `high`).
- **Variabilidad**: el modelo no es determinista; dos ejecuciones del mismo mensaje pueden diferir en dependencias o skills. La validación local acota el resultado, pero no lo fija.
- **Dependencias**: los flujos que esperan no se lanzan solos al terminar sus dependencias; hay que relanzarlos con un nuevo dispatch.
- **Vigilancia**: solo durante `--watch-seconds` tras el lanzamiento. Si la cuota se agota más tarde, no se detecta.
- **Orca**: un Run solo se reutiliza si su terminal coordinadora sigue viva (`terminal show`); si no, se crea uno nuevo desde una terminal conectada del worktree actual. Corregido el 01/11/2026 tras el `consumer_fenced` del Run `run_c4e4ac292801`.
- **Heurística**: el respaldo por palabras clave enruta mal encargos triviales (prueba del 01/11/2026: "corrige un typo en el README" → dominio de finanzas con skills de pricing). Usarla solo para ver un plan sin coste, no para lanzar.
- No se han medido ahorros de tokens ni de tiempo.

## Estado verificado (01/11/2026)

- Enrutador por modelo: probado con `claude-opus-5-5` en tres consultas (trivial, multidisciplinar ×2). Planes válidos, con dependencias y esfuerzo por flujo.
- Cambio automático: probado. Codex está marcado como agotado hasta el 05/11/2026 y sus flujos se reasignan.
- Worker de Antigravity lanzado en Orca (`term_646e44c0…`) con la prueba de revisión de la oferta.
- Run activo: `run_b9a2a9d932fd`, coordinado desde la terminal del worktree `altiora-enterprise-os` (repo Altiora-Immersive-Web-Lab). Registro de tareas probado con `--router heuristic --execute`.
- Pendiente: revisar el resultado del worker de Antigravity en `docs/altiora-business/`.
