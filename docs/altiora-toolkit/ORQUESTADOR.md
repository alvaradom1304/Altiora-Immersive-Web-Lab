# Coordinación de Altiora · Enrutamiento Automático Multi-IA con Orca

El usuario autorizó a **Orca (`v1.4.245`)** como enrutador y orquestador de flujos de trabajo de Altiora para que baste **un único mensaje** del usuario y el sistema decida qué IA (`codex`, `claude` o `antigravity`) favorece cada flujo, separe worktrees cuando existan escrituras paralelas y despache las tareas.

## Flujo Automático ante un Mensaje Único (`npm run orca:dispatch`)

1. **Entrada de un solo mensaje:** Al recibir un objetivo del usuario, ejecutar o consultar [`scripts/orca-dispatch.py`](../../scripts/orca-dispatch.py):
   ```powershell
   # Modo solo plan (01/11/2026): muestra el reparto; no registra tareas ni lanza agentes.
   npm run orca:dispatch -- "mensaje del usuario"
   # Delegar: el usuario elige la IA en Orca (orca worktree create --agent claude --prompt "...").
   ```
2. **Regla de decisión por especialidad (verificada contra `.altiora/catalog.local.json`):**
   - **Codex (`codex-cli 0.166.0`):** Estrategia, oferta de US$10.000, unit economics, pricing, investigación B2B (`cold-outbound-system`), backend/API, flujos n8n, scripts Python, seguridad OWASP y validación (`npm run check`).
   - **Claude Code (`claude 2.1.309`):** Arquitectura de marca, storytelling, copywriting, Meta Ads, propuestas comerciales de alto ticket, sistemas de diseño y componentes UI en React/Next.js.
   - **Antigravity + Orca Browser:** Escenas 3D/WebGL (`threejs-experience`, `react-three-fiber`), motion/scroll (`gsap-animation`, `scroll-experience`), tipografía cinética (`immersive-interaction-lab`) y auditoría visual en vivo (`orca browser`).
3. **Separación de flujos y worktrees (`one_writer_per_file`):**
   - Si el mensaje pertenece a **1 solo dominio**, se ejecuta directamente en el worktree actual (`current`) sin abrir ramas innecesarias.
   - Si el mensaje combina **2 o más dominios**, `scripts/orca-dispatch.py` divide el encargo en subtareas dentro del Run activo de Orca (`run_c4e4ac292801`) y asigna worktrees separados (`wt-codex-strategy`, `wt-claude-brand`, `wt-antigravity-immersive`) con rutas de archivos exclusivas por agente.
4. **Cierre y verificación:** Antes de integrar o dar por cerrada una entrega, ejecutar `npm run check` en la raíz.

## Estado Real de los Runtimes en esta PC

| Participante / CLI | Binario vinculado en PATH (`AppData\Roaming\npm`) | Responsabilidad principal | Estado verificado |
|---|---|---|---|
| **Orca (`v1.4.245`)** | `orca.cmd` → `AppData\Local\Programs\orca\resources\bin\orca.exe` | Runtime de orquestación, worktrees, terminales y navegador integrado | Activo (`repoId: 7bb9c5d7-95b1-43a7-a52f-4971ad3ffa40`, Run `run_c4e4ac292801`) |
| **Codex (`v0.166.0-alpha.5.1`)** | `codex.cmd` → `AppData\Local\OpenAI\Codex\bin\22cfb1d302613eae\codex.exe` | Estrategia, finanzas US$10k, outbound B2B, backend, n8n y QA estático | Activo y autenticado OAuth (`term_e0116129-5525-4e16-bf5b-42e43fca7b42`) |
| **Claude Code (`v2.1.309`)** | `claude.cmd` → `AppData\Local\Claude-Data\...\claude.exe` | Marca, copywriting, Meta Ads, propuestas y UI/UX Next.js | Binario activo en Orca (`term_280f8263-909b-4fc4-88d0-24e88fc16dfd`); requiere login/API key si se usa por CLI |
| **Antigravity IDE** | `agy.cmd` → `AppData\Local\Programs\Antigravity IDE\bin\antigravity-ide.cmd` | Web 3D/WebGL, shaders, GSAP, ejecución en sesión e inspección visual | Activo en esta sesión |
