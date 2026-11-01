---
name: federate-lakehouse-catalog
description: "Sets up Google Cloud Lakehouse federated catalogs to remote Iceberg REST Catalogs. Currently supported catalogs: Databricks Unity, AWS Glue. Supported clouds hosting those catalogs: GCP, AWS. The primary use case is connecting to remote data to query it from GCP engines (BigQuery, Spark). Examples of when to use this: \"federate my lakehouse catalog to databricks\", \"query data in databricks\", \"query data in s3\", \"connect to aws glue\". Do NOT use for direct remote database SQL execution (e.g., Databricks SQL) or managing remote clusters and infrastructure (e.g., Databricks clusters, AWS Glue jobs)."
disable-model-invocation: true
---

<!-- Generado con npm run agents:build. No editar a mano. -->

Skill del catálogo Altiora. Leer completo y seguir [skills/federate-lakehouse-catalog/SKILL.md](../../../skills/federate-lakehouse-catalog/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
