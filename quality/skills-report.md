# Informe de calidad de skills

Generado el 2026-11-02 con `npm run skills:baseline`. 353 skills; media **93.5/100**.
Mide estructura y verificabilidad; no sustituye ejecutar los casos de evaluación. Proceso: [mejora continua de skills](../docs/workflows/skill-improvement.md).

## Reglas incumplidas

| Regla | Puntos | Skills que fallan |
|---|---:|---:|
| Frontmatter YAML presente (`frontmatter`) | 5 | 0 |
| name coincide con la carpeta (`name-match`) | 5 | 0 |
| description entre 60 y 1024 caracteres (`description-length`) | 5 | 0 |
| description indica cuándo usarla (`description-trigger`) | 5 | 26 |
| Un único título H1 (`single-h1`) | 5 | 21 |
| Sin secciones H2 duplicadas (`no-duplicate-sections`) | 10 | 1 |
| Sin encabezados vacíos (`no-empty-sections`) | 5 | 4 |
| Sin párrafos repetidos (`no-duplicate-paragraphs`) | 10 | 8 |
| Sin bloque SOP genérico que contradiga el contrato (`no-legacy-conflict`) | 10 | 0 |
| SKILL.md de 500 líneas o menos (`length`) | 5 | 3 |
| Al menos 3 casos de evaluación (`eval-cases`) | 15 | 102 |
| Define el entregable (`output-defined`) | 5 | 45 |
| Enlaces locales válidos (`local-links`) | 10 | 0 |
| Versión declarada (`versioned`) | 5 | 38 |

## Distribución

| Rango | Skills |
|---|---:|
| 90–100 | 249 |
| 75–89 | 96 |
| 60–74 | 7 |
| 0–59 | 1 |

## 25 skills con menor puntuación (backlog del próximo ciclo)

| Skill | Puntos | Reglas incumplidas |
|---|---:|---|
| gcp-pipeline-orchestration | 55 | description-trigger, single-h1, no-duplicate-sections, no-empty-sections, length, eval-cases |
| finishing-a-development-branch | 65 | single-h1, no-empty-sections, eval-cases, output-defined, versioned |
| altiora-session-handoff | 70 | description-trigger, eval-cases, output-defined, versioned |
| building-data-apps | 70 | no-duplicate-paragraphs, eval-cases, output-defined |
| cloud-databases-onboarding | 70 | no-duplicate-paragraphs, eval-cases, output-defined |
| gcp-managed-airflow-migrations | 70 | description-trigger, no-duplicate-paragraphs, eval-cases |
| orca-orchestration | 70 | description-trigger, single-h1, length, eval-cases |
| schema-mapping | 70 | single-h1, no-duplicate-paragraphs, eval-cases |
| aem-stage-03-strategy | 75 | description-trigger, eval-cases, versioned |
| aem-stage-04-brand | 75 | description-trigger, eval-cases, versioned |
| aem-stage-06-automation | 75 | description-trigger, eval-cases, versioned |
| aem-stage-07-growth | 75 | description-trigger, eval-cases, versioned |
| altiora-os-qa | 75 | description-trigger, eval-cases, versioned |
| altiora-runtime-bridge | 75 | eval-cases, output-defined, versioned |
| bigquery-graph-query | 75 | no-duplicate-paragraphs, eval-cases |
| brainstorming | 75 | eval-cases, output-defined, versioned |
| dispatching-parallel-agents | 75 | single-h1, eval-cases, versioned |
| frontend-design | 75 | eval-cases, output-defined, versioned |
| gcp-data-pipelines | 75 | description-trigger, eval-cases, output-defined |
| gcp-managed-airflow-dag-authoring | 75 | no-duplicate-paragraphs, eval-cases |
| gcp-pipeline-resource-provisioning | 75 | single-h1, eval-cases, output-defined |
| gcp-spark | 75 | no-duplicate-paragraphs, eval-cases |
| gcp-spark-troubleshooting | 75 | no-duplicate-paragraphs, eval-cases |
| immersive-interaction-lab | 75 | description-trigger, eval-cases, output-defined |
| managing-python-dependencies | 75 | single-h1, eval-cases, output-defined |
