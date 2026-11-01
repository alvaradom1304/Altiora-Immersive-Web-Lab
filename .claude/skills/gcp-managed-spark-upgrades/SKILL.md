---
name: gcp-managed-spark-upgrades
description: "Upgrades Spark workloads on Google Cloud Managed Service for Apache Spark (formerly known as Dataproc) clusters and Serverless to a newer image or runtime version. Supports static compatibility analysis, code upgrade, build checks against the target version, and optional verification runs. Use when: - Upgrading Managed Spark versions (major, minor, or sub-minor) or assessing upgrade readiness. Example prompt: \"Upgrade Managed Spark job [job_id] in project [project_id], region [region] to target version [target_version]. Code location: [local path or GCS path]. Target GCS path: [gcs_target_path]\" Don't use when: - Writing new Spark code. - Migrating non-Spark workloads (e.g., Hive/Flink to Spark). - Troubleshooting a failed Spark job that is not part of an upgrade. Limitation: This skill does not support data/result validation currently."
disable-model-invocation: true
---

<!-- Generado con npm run agents:build. No editar a mano. -->

Skill del catálogo Altiora. Leer completo y seguir [skills/gcp-managed-spark-upgrades/SKILL.md](../../../skills/gcp-managed-spark-upgrades/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
