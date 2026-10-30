# Altiora Video OS — Release Readiness / Handoff

**Fecha de preparación:** 2026-10-30
**Destinatarios:** Claude Code, Google Antigravity y Codex.
**Estado:** componentes en código y pruebas de CI; **sin certificación end-to-end sobre un MP4 real**. No afirmar que los IDE ya detectan localmente todas las capacidades.

## Dependencias y alcance

Este branch reúne la cadena de PR apiladas:
- #14 Video OS: workspaces privados por cliente, edición reproducible, seguridad y adaptadores de Codex.
- #15 Creative Variation Director: tres propuestas basadas en metraje y auditor semántico de repetición.
- #16 Universal Capability Sync: una fuente canónica y wrappers para los tres agentes.
- #17 Discovery First: auditor de evidencias de preproducción y storyboard de frames con FFmpeg.

**No se han incorporado ni probado en la laptop** Remotion, Playwright MCP, agent-browser, Whisper, NVIDIA SkillSpector como binarios operativos, ni videos reales del cliente. Se documentan como candidatos y procesos, no como herramientas ejecutadas.

## Contrato que debe seguir cualquier IA al abrir este repositorio
1. Leer `AGENTS.md` y `creative-ads-os/WORK_ROUTER.md`. Toda nueva skill/agente es multiplataforma **por defecto**. No agregar adapters manuales; usar `npm run capability:sync`.
2. Crear workspace privado con `npm run video:project -- init --client CLIENTE --campaign CAMPANA`, sin compartir ni subir crudos ni datos del cliente a este GitHub público.
3. Trabajar en orden **Discovery → Research → observación real → hipótesis/alternativas → auditor de Discovery → 3 direcciones editoriales divergentes → auditor de variación → montaje/render → QA → aprendizaje**.
4. No fingir que un muestreador de fotogramas comprende el video, ni que un informe PASS prueba ventas, originalidad audiovisual o calidad. Marcar `NOT_VIEWED`, `NEEDS_REVIEW` o `NOT_RUN` si faltan insumos.
5. Antes de incorporar skills externas aplicar el gate de `docs/security/third-party-skill-gate.md`; revisar licencia, SHA, permisos y resultados; jamás ejecutar repositorios externos ciegamente.
6. La cantidad de versiones renderizadas se decide según brief y evidencia. No usar «humor + premium» como plantilla obligatoria.

## Verificación reproducible

Desde la raíz del proyecto actualizado y con Node.js >=20:

```bash
npm run capability:sync
npm run check
npm run video:project -- init --client el-tilichero --campaign earbuds
npm run video:project -- status --client el-tilichero --campaign earbuds
```

Cuando los videos autorizados estén disponibles en `media-workspaces/el-tilichero/earbuds/01_CRUDOS/`, y FFmpeg/ffprobe estén instalados:

```bash
npm run video:project -- inventory --client el-tilichero --campaign earbuds
npm run video:observe -- --client el-tilichero --campaign earbuds
```

Revisar realmente los fotogramas y el audio, investigar referencias, elaborar `05_QA/discovery-report.json` según `docs/marketing/DISCOVERY_PREPRODUCTION_GATE.md` y auditar:

```bash
npm run marketing:discovery -- --report media-workspaces/el-tilichero/earbuds/05_QA/discovery-report.json
```

Preparar `04_EDITABLES/creative-proposal.json` con tres rutas **fundamentadas** y ejecutar:

```bash
npm run video:variation -- --proposal media-workspaces/el-tilichero/earbuds/04_EDITABLES/creative-proposal.json --history media-workspaces/el-tilichero/_creative-history.json
```

**No usar ejemplos ficticios de los docs para superar gates.** Exportar solo con los medios, licencias, claims y CTA verificados. QA de MP4 y proyecto editable antes de afirmar que el video está terminado.

## Criterios de aceptación finales

- [x] Workspaces por cliente diseñados, con originales excluidos por `.gitignore`.
- [x] Instrucciones y adaptadores de las tres plataformas versionados.
- [x] Discovery First con auditor estructural y extracción de storyboard.
- [x] Creative Variation Director con auditor de 8 dimensiones.
- [x] Gate de seguridad de skills externas documentado y probado como CLI.
- [x] Guías de campaña alineadas para evitar presets obligatorios.
- [ ] Confirmar CI de la integración consolidada dirigida a `main` después de los últimos cambios.
- [ ] Revisar y aprobar la PR consolidada antes de fusionar (hay muchos cambios acumulados).
- [ ] Actualizar la laptop/IDE con el branch fusionado o rama de prueba.
- [ ] Probar detección real de skills/agentes en Claude Code, Antigravity y Codex.
- [ ] Instalar/verificar FFmpeg y herramientas de edición necesarias con seguridad y licencias.
- [ ] Auditar accesos/privacidad de navegación y medios de cliente.
- [ ] Validar con MOV/MP4 reales, inspección visual/audio, render final, proyectos editables y QA.
- [ ] Medir resultados comerciales; sin datos reales no se afirma efectividad de marketing.

## Documentación primaria

- `docs/video/VIDEO_WORKSPACES.md`
- `docs/video/CREATIVE_VARIATION.md`
- `docs/marketing/DISCOVERY_PREPRODUCTION_GATE.md`
- `docs/operations/UNIVERSAL_CAPABILITIES.md`
- `docs/security/SKILL_SUPPLY_CHAIN_GATE.md`

**Advertencia de release:** este handoff no autoriza publicar anuncios, gastar publicidad, instalar repositorios externos ni revelar archivos privados. Requiere revisión por el responsable antes de cambios irreversibles.
