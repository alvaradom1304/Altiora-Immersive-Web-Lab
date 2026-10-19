# Informe de calidad de skills

Generado el 2026-10-18 con `npm run skills:baseline`. 251 skills; media **97.4/100**.
Mide estructura y verificabilidad; no sustituye ejecutar los casos de evaluación. Proceso: [mejora continua de skills](../docs/workflows/skill-improvement.md).

## Reglas incumplidas

| Regla | Puntos | Skills que fallan |
|---|---:|---:|
| Frontmatter YAML presente (`frontmatter`) | 5 | 0 |
| name coincide con la carpeta (`name-match`) | 5 | 0 |
| description entre 60 y 1024 caracteres (`description-length`) | 5 | 0 |
| description indica cuándo usarla (`description-trigger`) | 5 | 13 |
| Un único título H1 (`single-h1`) | 5 | 3 |
| Sin secciones H2 duplicadas (`no-duplicate-sections`) | 10 | 0 |
| Sin encabezados vacíos (`no-empty-sections`) | 5 | 2 |
| Sin párrafos repetidos (`no-duplicate-paragraphs`) | 10 | 0 |
| Sin bloque SOP genérico que contradiga el contrato (`no-legacy-conflict`) | 10 | 0 |
| SKILL.md de 500 líneas o menos (`length`) | 5 | 0 |
| Al menos 3 casos de evaluación (`eval-cases`) | 15 | 29 |
| Define el entregable (`output-defined`) | 5 | 9 |
| Enlaces locales válidos (`local-links`) | 10 | 0 |
| Versión declarada (`versioned`) | 5 | 18 |

## Distribución

| Rango | Skills |
|---|---:|
| 90–100 | 222 |
| 75–89 | 28 |
| 60–74 | 1 |
| 0–59 | 0 |

## 25 skills con menor puntuación (backlog del próximo ciclo)

| Skill | Puntos | Reglas incumplidas |
|---|---:|---|
| webapp-testing | 70 | description-trigger, eval-cases, output-defined, versioned |
| aem-core-philosophy | 75 | no-empty-sections, eval-cases, versioned |
| aem-stage-01-discovery | 75 | description-trigger, eval-cases, versioned |
| aem-stage-02-research | 75 | description-trigger, eval-cases, versioned |
| aem-stage-03-strategy | 75 | description-trigger, eval-cases, versioned |
| aem-stage-04-brand | 75 | description-trigger, eval-cases, versioned |
| aem-stage-06-automation | 75 | description-trigger, eval-cases, versioned |
| aem-stage-07-growth | 75 | description-trigger, eval-cases, versioned |
| altiora-repository-research | 75 | eval-cases, output-defined, versioned |
| frontend-design | 75 | eval-cases, output-defined, versioned |
| skill-creator | 75 | single-h1, no-empty-sections, eval-cases |
| vercel-react-best-practices | 75 | eval-cases, output-defined, versioned |
| aem-learning-os | 80 | eval-cases, versioned |
| aem-stage-05-digital | 80 | description-trigger, eval-cases |
| altiora-agent-orchestrator | 80 | eval-cases, versioned |
| altiora-ai-economy | 80 | eval-cases, versioned |
| altiora-quality-review | 80 | eval-cases, versioned |
| company-builder-orchestrator | 80 | eval-cases, versioned |
| customer-value-architect | 80 | description-trigger, eval-cases |
| elite-web-experience-os | 80 | eval-cases, output-defined |
| smart-model-router | 80 | eval-cases, versioned |
| systematic-debugging | 80 | eval-cases, output-defined |
| vercel-composition-patterns | 80 | eval-cases, output-defined |
| verification-before-completion | 80 | eval-cases, versioned |
| writing-plans | 80 | single-h1, eval-cases |
