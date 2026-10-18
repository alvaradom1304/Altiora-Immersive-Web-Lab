# Registro de mejora continua de skills

Un bloque por ciclo, el más reciente arriba. Proceso: [mejora continua de skills](../docs/workflows/skill-improvement.md).

## Incorporación de skills externas — 2026-10-18

- 14 skills de terceros con licencia y procedencia: webapp-testing, skill-creator, web-design-guidelines, vercel-composition-patterns, events, referrals, offers, emails, schema, ab-testing, analytics, writing-plans, systematic-debugging, verification-before-completion. Atribución añadida a 4 importadas antes (cro, free-tools, lead-magnets, marketing-psychology).
- Línea base recalculada con 251 skills; la media baja porque varias externas no declaran versión ni entregable con el formato de la rúbrica. No es una regresión de las existentes.
- Backlog: casos de evaluación propios para las externas sin `evals/` (webapp-testing, skill-creator, web-design-guidelines, vercel-composition-patterns, writing-plans, systematic-debugging, verification-before-completion) y adaptar ejemplos de marketing a La Central del Queso en `evals/`, sin tocar su SKILL.md.

## Ciclo 1 — 2026-10-18

**Planificar.** Primera auditoría con `scripts/audit-skills.mjs`: media **78.1/100**, solo 84 de 237 skills en 100. Causa principal: un envoltorio «Executive Protocol» insertado durante la integración del catálogo, duplicado en 132 skills (secciones y párrafos repetidos, encabezados vacíos) y que en 125 skills con contrato contradecía su protocolo: pedía hablar «como consultor de Bain/McKinsey», hacer preguntas antes de actuar y entregar Markdown libre, frente al contrato que exige `output-schema.json`, no pedir permiso para análisis autorizado y estado `SUCCESS/FAILED/BLOCKED/NEEDS_REVIEW`.
Objetivo: eliminar duplicados y contradicciones sin perder contenido propio, y rehacer las 7 skills de menor puntuación.

**Hacer.**
- Migración revisada en 136 `SKILL.md`: en las 125 con contrato se quitan el envoltorio y el SOP genérico (se conserva la Regla de Oro una vez); en las 11 sin contrato se deja una sola copia de cabecera y SOP.
- Reescritas con disparador, procedimiento concreto, entregable y 3 casos de evaluación (`evals/evals.json`): `spin-selling`, `consumer-psychology`, `cybersecurity-owasp`, `financial-forecasting`, `logistics-supply-chain`, `premium-branding` (de 50 a 100) y `modular-docs-architect` (de 70 a 100; además sustituye el consejo de enlazar con rutas absolutas `file:///` por rutas relativas).
- Nuevo auditor con gate de no-regresión dentro de `npm run check`.

**Verificar.**
- `npm run check`: OK, sin regresiones. Media **98.0/100**; 212 skills en 100, ninguna por debajo de 75.
- Revisión del diff de la migración: solo se eliminan líneas del envoltorio repetido.
- Casos de evaluación de las 7 skills reescritas: **NO EJECUTADOS** todavía. Primer punto del próximo ciclo.

**Actuar.** Línea base actualizada. Lección convertida en regla: `no-legacy-conflict` y `no-duplicate-paragraphs` impiden que vuelva a entrar el envoltorio.

**Backlog del ciclo 2.**
- Ejecutar los 21 casos de evaluación de este ciclo y anotar PASA/FALLA.
- 21 skills sin casos de evaluación (las 7 `aem-stage-*`, `altiora-*`, `frontend-design`, `vercel-react-best-practices`, orquestadores).
- 12 descripciones sin indicar cuándo usarlas y 16 skills sin versión.
- Las skills con contrato listan fuentes poco pertinentes a su dominio (p. ej. `accessibility` cita GSAP y Next.js). Candidata a nueva regla del auditor.
- Las descripciones generadas («X: dominio. Usar para producir…») se parecen entre sí; revisar si disparan bien entre skills vecinas.
