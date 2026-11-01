---
name: resolving-mcp-region-configs
description: "Mandatory Step 0 pre-flight check for regional Google Cloud MCP servers (e.g. Dataproc) before using MCP tools or falling back to gcloud/bq CLI. Use whenever interacting with Dataproc clusters, Spark batches, jobs, sessions, or regional GCP resources. Fixes regional MCP servers whose endpoint URL still has an unreplaced $GCP_REGION / ${REGION} placeholder across Claude Code, Codex, and Antigravity. Trigger: an expected mcp__*_{service}_* tool is missing entirely (not just failing), or a call to one fails/hangs on a malformed host. Check via ToolSearch/deferred-tools listing before falling back to gcloud/bq CLI. Asks the user for a region, patches the live MCP config file(s), and tells the user how to restart without losing session context."
disable-model-invocation: true
---

<!-- Generado con npm run agents:build. No editar a mano. -->

Skill del catálogo Altiora. Leer completo y seguir [skills/resolving-mcp-region-configs/SKILL.md](../../../skills/resolving-mcp-region-configs/SKILL.md). Sus archivos de apoyo (references/, evals/, scripts/) están en esa misma carpeta: resolver las rutas relativas desde allí.

Petición: $ARGUMENTS
