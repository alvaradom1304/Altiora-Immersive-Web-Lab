---
name: resolving-mcp-region-configs
description: "Mandatory Step 0 pre-flight check for regional Google Cloud MCP servers (e.g. Dataproc) before using MCP tools or falling back to gcloud/bq CLI. Use whenever interacting with Dataproc clusters, Spark batches, jobs, sessions, or regional GCP resources. Fixes regional MCP servers whose endpoint URL still has an unreplaced $GCP_REGION / ${REGION} placeholder across Claude Code, Codex, and Antigravity. Trigger: an expected mcp__*_{service}_* tool is missing entirely (not just failing), or a call to one fails/hangs on a malformed host. Check via ToolSearch/deferred-tools listing before falling back to gcloud/bq CLI. Asks the user for a region, patches the live MCP config file(s), and tells the user how to restart without losing session context."
---

<!-- Generado con npm run antigravity:build. No editar manualmente. -->

# resolving-mcp-region-configs
Esta skill se expone a Antigravity. **Leer por completo** el protocolo original `skills/resolving-mcp-region-configs/SKILL.md` (relativo: ../../../skills/resolving-mcp-region-configs/SKILL.md) antes de actuar.
Respetar documentación de apoyo, evidencias, pruebas, privacidad, derechos y autorizaciones. No inventar resultados.
