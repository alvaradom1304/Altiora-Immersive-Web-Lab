---
name: gcs-security-assessment
description: "Assesses the security posture of Google Cloud Storage (GCS) buckets and projects. Grounds every finding in gathered telemetry, evaluates buckets against Google security best practices (public access, IAM over-granting, CMEK, VPC Service Controls, audit logging), and correlates signals to flag toxic combinations of individually low-risk settings, with actionable remediation. Use whenever a user asks for a security scan, audit, review, vulnerability check, or compliance assessment (including SAIF) — or simply asks whether their buckets, project, or data are secure, exposed, public, or misconfigured, who can access their data, or wants storage hardened or locked down, e.g. before a launch. Don't use for diagnosing a specific access failure or 403, managing or configuring storage, investigating a live outage, or non-GCS resources (Compute Engine, GKE, etc.)."
disable-model-invocation: true
---

<!-- Generado con npm run agents:build. No editar a mano. -->

Skill del catálogo Altiora. Leer completo y seguir [skills/gcs-security-assessment/SKILL.md](../../../skills/gcs-security-assessment/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
