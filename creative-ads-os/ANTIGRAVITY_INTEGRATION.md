# Altiora — integración de Antigravity y Claude Code
**Estado:** fuentes versionadas en rama de revisión. No se ha ejecutado Antigravity en el dispositivo del cliente.

## Diseño
El mismo repositorio contiene las fuentes `team/agents.json`, `team/roles/` y `skills/`.
- Claude Code descubre los resultados generados en `.claude/agents/` y `.claude/skills/`.
- Google Antigravity descubre `.agents/agents/`, `.agents/skills/` y `.agents/rules/`.
- `GEMINI.md` y `AGENTS.md` apuntan al router común `creative-ads-os/WORK_ROUTER.md`.

El generador `npm run agents:build` ejecuta ambos adaptadores a partir del mismo catálogo, mientras `npm run check` comprueba que no estén desincronizados. Cada skill Antigravity apunta al protocolo fuente. Cada subagente Antigravity apunta al prompt portátil del rol.

## Activación
1. Actualizar/clonar este repositorio en el workspace de Antigravity (rama con cambios o rama principal después de revisar e integrar PR).
2. Ejecutar `npm run agents:build` y `npm run check` en la carpeta raíz usando Node.js >=20.
3. Abrir Antigravity, comprobar Customizations > Skills/Rules y subagentes con `/agents` en App o CLI que lo soporte.
4. Pedir «vamos a hacer marketing para El Tilichero». Validar que selecciona rutas `commerce-growth-director`, `market-intelligence-director`, `creative-ads-director` si el encargo lo amerita y que sigue `creative-ads-os/WORK_ROUTER.md`.

## Límites
GitHub guarda instrucciones; no da acceso por sí solo al escritorio local, redes sociales, cuentas de clientes ni a sesiones autónomas. Las pruebas de descubrimiento y delegación dentro del IDE quedan pendientes hasta abrirlo con este workspace. No gastar ni publicar sin aprobación. No editar los espejos generados.

## Documentación del fabricante
- https://antigravity.google/docs/skills/
- https://antigravity.google/docs/rules/
- https://antigravity.google/docs/subagents/
- https://antigravity.google/docs/migration/workflows-to-skills/
