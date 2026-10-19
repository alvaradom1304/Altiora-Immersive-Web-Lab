# Mejora continua de skills (PDCA)

Las 237 skills de `skills/` mejoran en ciclos cortos y medibles: Planificar, Hacer, Verificar y Actuar. Cada ciclo deja la línea base igual o mejor y nunca empeora una skill.

## Herramientas

| Orden | Qué hace |
|---|---|
| `npm run skills:audit` | Puntúa cada skill (0–100) con reglas objetivas y falla si alguna baja respecto a la línea base. |
| `npm run skills:baseline` | Guarda la nueva línea base y regenera el [informe](../../quality/skills-report.md). Solo tras un ciclo verificado. |
| `npm run check` | Catálogo, enlaces locales y auditoría de skills. |

La rúbrica está en [audit-skills.mjs](../../scripts/audit-skills.mjs): frontmatter, disparador en la descripción, estructura sin duplicados ni encabezados vacíos, ausencia de instrucciones contradictorias, longitud, casos de evaluación, entregable, enlaces y versión. Mide forma y verificabilidad, no la calidad del resultado: para eso están los casos de evaluación.

## Ciclo

1. **Planificar.** Leer el [informe](../../quality/skills-report.md) y elegir como máximo 10 skills: las de menor puntuación, las más usadas o las que fallaron en uso real. Escribir en el [registro](../../quality/skills-improvement-log.md) el objetivo y la métrica (p. ej. «media 98 → 99», «0 skills sin casos de evaluación en ventas»).
2. **Hacer.** En una rama `mejora-skills/<fecha>`:
   - Descripción con qué hace **y cuándo usarla** (y cuándo no).
   - Procedimiento concreto, reglas de decisión y entregable verificable.
   - Al menos 3 casos de evaluación: normal, borde o datos insuficientes, y una petición que debe rechazarse o redirigirse.
   - Subir la versión (`metadata.version` o la del contrato) y anotar el cambio.
   - Corregir patrones repetidos con una migración revisada, nunca con buscar y reemplazar a ciegas.
3. **Verificar.**
   - `npm run check` sin errores ni regresiones.
   - Ejecutar al menos un caso de evaluación por skill modificada con un agente y comparar con `expected_output`. Anotar resultado: PASA, FALLA o NO EJECUTADO.
   - Revisar el diff: no perder contenido propio de la skill.
4. **Actuar.** Si se cumple el objetivo, `npm run skills:baseline`, completar el registro y abrir PR. Si un caso falla, la skill vuelve al backlog con la causa. Las lecciones que afectan a muchas skills se convierten en una regla nueva del auditor, para que el error no vuelva.

## Cadencia

- **Semanal:** una tarea programada ejecuta el ciclo sobre las 5 skills de menor puntuación y abre un PR para revisión humana. No fusiona sola.
- **Al usar una skill y notar un fallo:** añadirlo al backlog del registro con el ejemplo concreto.
- **Trimestral:** revisar la rúbrica. Si casi todas las skills llegan a 100, endurecer reglas (p. ej. fuentes pertinentes al dominio, casos ejecutados) en lugar de declarar el trabajo terminado.

## Skills de terceros

Las skills con `SOURCE.md` vienen de otro repositorio (registro en `references/skill-sources.json`). No reescribirlas a mano: actualizar copiando una revisión nueva, revisar el diff y anotar cualquier cambio local en su `SOURCE.md`. Sus fallos de rúbrica se resuelven con casos de evaluación propios en `evals/` o proponiendo el cambio al proyecto original.

## Reglas

- Nunca bajar la línea base para que pase la auditoría.
- Una skill no pasa de EXPERIMENTAL por cumplir la rúbrica: necesita casos ejecutados y revisión documentada.
- No inventar fuentes, cifras ni casos de clientes en las skills ni en sus evaluaciones.
