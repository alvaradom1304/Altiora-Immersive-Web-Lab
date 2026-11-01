---
name: dak-setup
description: "Configures (or reconfigures) the Google Cloud Data Agent Kit (DAK) plugin by checking gcloud and ADC credentials, collecting the GCP project ID, region, and services, and running its bundled `dak-setup` script. Use this proactively and without waiting to be asked whenever a SessionStart hook or any other system/context message reports that the Data Agent Kit plugin is not configured, is missing configuration, or needs to be reconfigured. Also use it whenever the user mentions setting up, configuring, reconfiguring, or changing the project, region, or service integrations for the Data Agent Kit or DAK plugin — even if they phrase it casually, like \"dak isn't working\" or \"I want to enable more GCP service integrations\"."
disable-model-invocation: true
---

<!-- Generado con npm run agents:build. No editar a mano. -->

Skill del catálogo Altiora. Leer completo y seguir [skills/dak-setup/SKILL.md](../../../skills/dak-setup/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
