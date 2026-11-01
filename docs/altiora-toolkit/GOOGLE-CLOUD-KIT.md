# Google Cloud & Data Agent Kit en Altiora Enterprise OS

Altiora integra el kit oficial de **Google Cloud (Data Agent Kit `v1.2.0` de Google LLC)**, aportando 40 skills especializadas, conectores MCP para BigQuery, Cloud Storage, Cloud SQL, Firestore y Spanner, y un subagente de datos (`altiora-os-cloud-data`).

## Capacidades y Superpoderes Añadidos

1. **40 Skills Especializadas en `.agents/skills` y `.claude/skills`:**
   - **BigQuery y Analítica:** `bigquery-optimization`, `bigquery-observability`, `bigquery-troubleshooting`, `bigquery-data-transfer-service`, `bigquery-ai-ml`, `bigquery-bigframes`, `bigquery-graph-query`, `dataform-bigquery`, `dbt-bigquery`.
   - **Almacenamiento (Cloud Storage):** `google-cloud-storage-bucket-architect`, `google-cloud-storage-basics`, `google-cloud-storage-fuse`, `gcs-security-assessment`.
   - **Pipelines y Orquestación:** `gcp-data-pipelines`, `gcp-dataflow`, `gcp-pipeline-orchestration`, `gcp-managed-airflow-dag-authoring`, `gcp-composer-troubleshooting`, `gcp-spark`, `gcp-spark-troubleshooting`.
   - **Bases de Datos Operacionales:** `cloud-databases-onboarding`, `bigtable-basics`, `schema-mapping`.
   - **Notebooks y Machine Learning:** `notebook-guidance`, `ml-best-practices`, `building-data-apps`, `data-autocleaning`.
   - **Gobernanza y Seguridad:** `accidental-data-loss-prevention`, `enforcing-resource-attribution`, `federate-lakehouse-catalog`, `resolving-mcp-region-configs`.

2. **Servidores MCP en `.mcp.json`:**
   - `dak-data-agent-kit`: Metadatos de proyectos y recursos GCP.
   - `dak-notebook`: Manipulación y ejecución de celdas de notebooks BigQuery/Dataproc.
   - `dak-gcs`: Proxy MCP para Google Cloud Storage.
   - `dak-bigquery`: Proxy MCP para BigQuery.
   - `dak-cloudsql`: Proxy MCP para Cloud SQL.
   - `dak-firestore`: Proxy MCP para Firestore.

3. **Subagente Especialista:**
   - [`altiora-os-cloud-data`](../../.claude/agents/altiora-os-cloud-data.md): Especialista en diseño de datos, data warehouses y pipelines cloud para clientes de US$10.000.

4. **Integración con Orca (`scripts/orca-dispatch.py`):**
   - Las solicitudes sobre Google Cloud, BigQuery, buckets, ETLs o pipelines son clasificadas automáticamente hacia `codex` / `antigravity` con worktree aislado.

## Licencia y Origen
- **Fuente original:** Google Cloud Data Agent Kit (`C:\Users\Usuario\.gemini\config\plugins\dak`)
- **Autor:** Google LLC
- **Licencia:** Apache License 2.0 (reproducida en cada carpeta de skill en `LICENSE.txt`)

