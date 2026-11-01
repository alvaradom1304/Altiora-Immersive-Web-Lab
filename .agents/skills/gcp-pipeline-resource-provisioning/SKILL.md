---
name: gcp-pipeline-resource-provisioning
description: "Automates declarative resource creation and provisioning for data pipelines, supporting BigQuery, Dataform, Dataproc, BigQuery Data Transfer Service (DTS), and other resources. It manages environment-specific configurations (dev, staging, prod) through a deployment.yaml file. Use when: - Modifying or creating deployment.yaml for deployment settings. - Resolving environment-specific variables (e.g., Project IDs, Regions) for deployment. - Provisioning supported infrastructure like BigQuery datasets/tables, Dataform resources, or DTS resources via deployment.yaml. Do not use when: - Resources already exist. - Managing resources not supported by `gcloud beta orchestration-pipelines resource-types list`. - Managing general cloud infrastructure (VMs, networks, Kubernetes, IAM policies), which are better suited for Terraform. - Infrastructure spans multiple cloud providers (AWS, Azure, etc.). - Already uses Terraform for the target resources."
---

<!-- Generado con npm run antigravity:build. No editar manualmente. -->

# gcp-pipeline-resource-provisioning
Esta skill se expone a Antigravity. **Leer por completo** el protocolo original `skills/gcp-pipeline-resource-provisioning/SKILL.md` (relativo: ../../../skills/gcp-pipeline-resource-provisioning/SKILL.md) antes de actuar.
Respetar documentación de apoyo, evidencias, pruebas, privacidad, derechos y autorizaciones. No inventar resultados.
