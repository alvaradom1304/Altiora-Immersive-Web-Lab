# Altiora Enterprise OS — Índice Maestro (`INDEX.md`)

Punto de entrada rápido para **Claude Code**, **Codex**, **Antigravity** y **Orca (`v1.4.245`)**. Leer solo las referencias necesarias para la tarea actual.

---

## 1. Enrutador Automático Multi-IA con un Solo Mensaje (`npm run orca:dispatch`)
- **Despachador sobre Orca CLI (modo solo plan desde 01/11/2026):** [`scripts/orca-dispatch.py`](scripts/orca-dispatch.py)
  ```powershell
  # Muestra flujos, IA sugerida (codex / claude / antigravity) y esfuerzo; no registra ni lanza:
  npm run orca:dispatch -- "tu mensaje"

  # Delegar: elegir la IA en Orca.
  orca worktree create --name tarea-x --agent claude --prompt "encargo con resultado verificable"
  ```
- **Reglas de decisión por IA:**
  - **Codex (`codex.cmd`):** Estrategia, oferta de US$10.000, unit economics, pricing, investigación B2B, backend/API, n8n, scripts Python y validación (`npm run check`).
  - **Claude Code (`claude.cmd`):** Marca, storytelling, copywriting, Meta Ads, propuestas comerciales y componentes UI/UX en React/Next.js.
  - **Antigravity (`agy.cmd`) + Orca Browser:** Escenas 3D/WebGL (`threejs-experience`, `react-three-fiber`), motion/scroll (`gsap-animation`), tipografía cinética y Google Cloud / Data Agent Kit (`bigquery`, `gcs`, `dataflow`, `notebooks`).

---

## 2. Contexto de Negocio y Oferta (US$10.000 / proyecto)
- **Contexto estructurado del proyecto:** [`.altiora/project.json`](.altiora/project.json)
- **Entrada ejecutiva de negocio:** [`docs/altiora-business/INICIO.md`](docs/altiora-business/INICIO.md)
- **Oferta, alcance de 6 semanas (75 h máx.) y compuertas:** [`docs/altiora-business/OFERTA.md`](docs/altiora-business/OFERTA.md) y [`docs/altiora-business/OPERACION.md`](docs/altiora-business/OPERACION.md)
- **Dirección de proyectos integrales:** [`docs/altiora-business/ALTIORA-MAESTRO-PROYECTOS.md`](docs/altiora-business/ALTIORA-MAESTRO-PROYECTOS.md)
- **Caso piloto / Laboratorio en este repo:** [`CLIENTS_PORTFOLIO.md`](CLIENTS_PORTFOLIO.md) (`La Central del Queso`)

---

## 3. Equipo de IA: Coordinadores, Subagentes y Skills
- **Mapa canónico de capacidades y desempates:** [`docs/altiora-toolkit/MAPA-CAPACIDADES.md`](docs/altiora-toolkit/MAPA-CAPACIDADES.md)
- **Google Cloud & Data Agent Kit (40 skills + MCPs):** [`docs/altiora-toolkit/GOOGLE-CLOUD-KIT.md`](docs/altiora-toolkit/GOOGLE-CLOUD-KIT.md)
- **Enrutamiento y estado de herramientas:** [`docs/altiora-toolkit/ROUTING.md`](docs/altiora-toolkit/ROUTING.md)
- **Coordinación multi-agente y runtime Orca (`stablyai/orca`):** [`docs/altiora-toolkit/ORQUESTADOR.md`](docs/altiora-toolkit/ORQUESTADOR.md) y [`docs/altiora-toolkit/ORCA-ALTIORA.md`](docs/altiora-toolkit/ORCA-ALTIORA.md)
- **Catálogo local de metadatos (519 entradas):** [`.altiora/catalog.local.json`](.altiora/catalog.local.json)

### Coordinadores principales (Skills en sesión principal)
| Tipo de encargo | Skill coordinadora |
|---|---|
| Orquestación de worktrees, terminales y navegador en Orca | `orca-orchestration` / `orca-cli` |
| Captación, entrevistas, propuesta y cierre del 1er cliente de US$10.000 | `altiora-commercial-director` |
| Ejecución de proyecto contratado (6 semanas, compuertas G1–G8) | `altiora-project-director` |
| Coordinación técnica / multidisciplinar e I+D | `altiora-agent-orchestrator` |
| Enrutamiento léxico con contexto mínimo | `altiora-bibliotecario` |
| Continuidad y traspaso entre sesiones/clientes | `altiora-session-handoff` |

### Subagentes especialistas (`.claude/agents/`, `.codex/agents/`, `altiora-os/agents/`)
- **Investigación y Estrategia:** `altiora-os-research` (con web), `altiora-research` (local), `altiora-os-strategy`
- **Cloud & Data Engineering:** `altiora-os-cloud-data` (Google Cloud, BigQuery, Dataflow, Airflow, dbt, Cloud Storage)
- **Marca y Creatividad:** `altiora-creative-analyst`, `altiora-os-creative`
- **Experiencia Web, 3D e Ingeniería:** `altiora-experience`, `altiora-os-web-3d`, `altiora-engineering`
- **Medios y Audio:** `altiora-os-media`, `audio-specialist`
- **QA y Crecimiento:** `altiora-os-qa` (con navegador/MCP), `altiora-review` (estático), `altiora-os-automation-growth`

---

## 4. Conectores MCP y Verificación (`npm run check`)
- **Servidores MCP declarados en proyecto:** [`.mcp.json`](.mcp.json) (`altiora-shared`, `chrome-devtools`, `playwright`, `dak-data-agent-kit`, `dak-notebook`, `dak-gcs`, `dak-bigquery`, `dak-cloudsql`, `dak-firestore`)
- **Verificación integral desde la raíz:**
  ```sh
  npm run check
  ```
  Ejecuta: `manage.py doctor`, `manage.py handoff-check`, `library.py check`, tests del Bibliotecario y tests de QA de audio.
