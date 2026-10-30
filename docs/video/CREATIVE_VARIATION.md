# Altiora Creative Variation — uso para Claude Code, Antigravity y Codex

**Meta:** dejar de producir siempre «el mismo edit». Fuente normativa: [Creative Variation Director](../../skills/ai-video-direction/references/creative-variation-playbook.md); activación a través de `ai-video-direction` y `creative-ads-director`.

## Activación por campaña
1. Abrir la rama de Altiora que contiene este cambio y ejecutar `npm run agents:build && npm run check` en la laptop; Claude Code debe abrir la raíz del repo. No basta con tener una PR en GitHub.
2. Preparar `media-workspaces/<cliente>/<campaña>/01_CRUDOS` y `02_REFERENCIAS`, junto con `00_BRIEF.md`. Si no hay media accesible, solo se puede planear; no inventar cortes.
3. Dar a Claude Code esta orden:
   > Actuá como Creative Ads Director y activá el módulo Creative Variation Director de ai-video-direction. Leé el brief, visioná cada clip en 01_CRUDOS y analizá los ejemplos de 02_REFERENCIAS sin copiarlos. Construí tres conceptos diferentes basados en evidencia y comparalos con las últimas cinco campañas del mismo cliente en _creative-history.json. Completá creative-proposal.json, ejecutá video:variation, elegí por ajuste real a las tomas, no por aleatoriedad; luego editá, renderizá MP4, revisá visualmente y guardá resultado en 03_RESULTADOS, editables en 04_EDITABLES y QA en 05_QA. Si los tres conceptos se parecen o el montaje repite la fórmula anterior, volvé a la dirección creativa antes de entregar.
4. Rellenar `04_EDITABLES/creative-proposal.json` con evidencia del metraje. El auditor no genera ideas: evalúa tres opciones creadas **después de inspeccionar el video**.
5. Ejecutar `npm run video:variation -- --proposal media-workspaces/<cliente>/<campaña>/04_EDITABLES/creative-proposal.json --history media-workspaces/<cliente>/_creative-history.json`. Si no existe historial, inicia sin comparables. `PASS` confirma diversidad **de las declaraciones**, no calidad del video; `NEEDS_REVIEW` exige criterio humano, `FAIL` obliga a revisar el brief/conceptos.
6. Solo después de render y QA, añadir un registro `approved: true` al historial privado del cliente. No registrar historias de otros clientes ni subirlo a GitHub.

## Esquema: creative-proposal.json
Ejemplo **sintético** para mostrar la forma, NO evidencia real ni material grabado de El Tilichero:

```json
{
  "schema_version": 1,
  "client": "el-tilichero",
  "campaign": "earbuds-2026",
  "objective": "Mostrar el producto con material grabado y afirmaciones comprobables",
  "footage_reviewed": true,
  "brand_invariants": ["No inventar autonomía ni marca", "CTA a WhatsApp aprobado"],
  "evidence": [{
    "id": "clipA",
    "file": "ejemplo.mov",
    "in_seconds": 0,
    "out_seconds": 4,
    "observation": "Descripción comprobable del contenido visto; reemplazar por evidencia real"
  }],
  "candidates": [
    {
      "id": "detalle",
      "concept": "Del gesto al objeto: una microhistoria de descubrimiento",
      "why_this": "El gesto de apertura sostiene una revelación sin afirmaciones falsas",
      "footage_ids": ["clipA"],
      "grammar": {
        "hook": "Entrada con mano acercándose a la caja",
        "narrative": "Descubrimiento físico de una sola acción",
        "pacing": "Pausa inicial, aceleración breve, reposo final",
        "camera": "Primeros planos y corte por gesto",
        "motion": "Resaltar movimiento real sin entradas prefabricadas",
        "sound": "Foley de cartón y silencio de anticipación",
        "typography": "Una sola frase pequeña al final",
        "ending": "Producto sostenido en mano con CTA discreto"
      },
      "scores": {"footage_fit": 5, "brand_fit": 4, "feasibility": 4, "clarity": 5}
    }
  ],
  "selected_id": "detalle"
}
```

**Importante:** el ejemplo contiene solo **una** ruta para facilitar lectura y por eso fallará el auditor intencionalmente. Claude debe generar **tres** rutas con gramáticas completas y distancias suficientes, utilizando timecodes verificados. El ejemplo no acredita visión real. No copiarlo como prueba de edición.

## Esquema de _creative-history.json
```json
{
  "executions": [
    {
      "client": "el-tilichero",
      "campaign": "earbuds-primera-entrega",
      "approved": true,
      "fingerprint": {
        "hook": "Describe la apertura utilizada",
        "narrative": "Describe el arco narrativo real",
        "pacing": "Describe ritmo observado del corte",
        "camera": "Describe el lenguaje de encuadre",
        "motion": "Describe motion graphics implementados",
        "sound": "Describe tratamiento musical y de sonido",
        "typography": "Describe comportamiento tipográfico",
        "ending": "Describe el cierre observado"
      }
    }
  ]
}
```
Registrar como aprobado **solo** tras verificar el MP4 y revisión de una persona. El auditor lee JSON, no recopila ni envía media/PII.

## Criterio editorial final
Exigir al menos **4/8 diferencias entre las tres rutas** y **3/8 frente a cada una de las últimas cinco entregas aprobadas**. Aun así, hay que revisar el producto final: dos conceptos con gramáticas diferentes podrían terminar pareciéndose en pantalla. La repetición puede estar justificada en una serie o test A/B; documentar excepción y pedir revisión.

## Herramientas
FFmpeg/Remotion siguen como motores opcionales ya documentados; las fuentes externas son referencias en [investigación](../research/creative-variation-repositories-2026-10-30.md), **no nuevas dependencias instaladas**. Respetar el gate de terceros y licencias.
