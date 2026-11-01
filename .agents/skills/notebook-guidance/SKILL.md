---
name: notebook-guidance
description: "This skill guides the use of Jupyter notebooks for data analysis, exploration, and visualization, particularly with BigQuery. It outlines best practices for notebook execution and validation (supporting both cell-by-cell execution and full notebook generation depending on tool availability), library installation, and structuring notebooks for clarity. It also covers specific rules for data cleaning, plotting, and integrating with BigQuery SQL and machine learning workflows. Relevant when any of the following conditions are true: 1. The user request involves a data analysis, data exploration, data visualization, or data insights task that requires multiple steps, queries, or visualizations to answer. 2. The user explicitly requests a notebook (.ipynb). 3. You are creating, editing, or executing cells in a Jupyter notebook. 4. You need to query BigQuery from within a notebook. DO NOT use the Python BigQuery client library; instead, you MUST use the `%%bqsql` magics explained in this skill."
---

<!-- Generado con npm run antigravity:build. No editar manualmente. -->

# notebook-guidance
Esta skill se expone a Antigravity. **Leer por completo** el protocolo original `skills/notebook-guidance/SKILL.md` (relativo: ../../../skills/notebook-guidance/SKILL.md) antes de actuar.
Respetar documentación de apoyo, evidencias, pruebas, privacidad, derechos y autorizaciones. No inventar resultados.
