---
name: gcp-managed-spark-upgrades
description: "Upgrades Spark workloads on Google Cloud Managed Service for Apache Spark (formerly known as Dataproc) clusters and Serverless to a newer image or runtime version. Supports static compatibility analysis, code upgrade, build checks against the target version, and optional verification runs. Use when: - Upgrading Managed Spark versions (major, minor, or sub-minor) or assessing upgrade readiness. Example prompt: \"Upgrade Managed Spark job [job_id] in project [project_id], region [region] to target version [target_version]. Code location: [local path or GCS path]. Target GCS path: [gcs_target_path]\" Don't use when: - Writing new Spark code. - Migrating non-Spark workloads (e.g., Hive/Flink to Spark). - Troubleshooting a failed Spark job that is not part of an upgrade. Limitation: This skill does not support data/result validation currently."
---

<!-- Generado con npm run antigravity:build. No editar manualmente. -->

# gcp-managed-spark-upgrades
Esta skill se expone a Antigravity. **Leer por completo** el protocolo original `skills/gcp-managed-spark-upgrades/SKILL.md` (relativo: ../../../skills/gcp-managed-spark-upgrades/SKILL.md) antes de actuar.
Respetar documentación de apoyo, evidencias, pruebas, privacidad, derechos y autorizaciones. No inventar resultados.
