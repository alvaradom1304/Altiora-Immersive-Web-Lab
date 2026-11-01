# Revisión del puente local de After Effects

Fecha del cliente: 2026-10-30. Continúa la rama existente con correcciones a la PR #32 mediante la PR #33.

## Evidencia local

- Windows, Node local: 22 pruebas AE pasaron antes de añadir la regresión de mensajes JSON-RPC malformados; las 12 pruebas bridge/MCP pasaron después de añadirla. Se incluyen junctions, hard links, espacios y arranque fuera del directorio del repo.
- `npm run check` completo pasó: catálogo, enlaces, skills, agentes generados, continuidad, preflight, watcher, validación MP4 y puente/configuración AE. La matriz CI añade Windows y Linux.
- Codex CLI `0.166.0-alpha.5.1`: `mcp get altiora-after-effects --json` leyó la configuración de un proyecto temporal confiable con `CODEX_HOME` aislado. Confirmó transporte stdio, Node absoluto, script absoluto y cwd con espacios. No se alteraron los ajustes globales reales ni se conectó Adobe.
- El protocolo MCP arrancó con el Node real mediante las configuraciones generadas. Solo expuso preflight y plan sin autorización de render.
- `node scripts/after-effects-bridge.mjs --check`: `available:false`, `diagnostic:ENOENT`. No se encontró aerender en las ubicaciones consultadas; esto no demuestra su ausencia de toda la PC. No se abrió ningún .aep ni se ejecutó render Adobe.
- Claude Code y Gemini CLI no se encontraron mediante Get-Command en este entorno. Compatibilidad de sus campos y de Antigravity contrastada con documentación oficial enlazada en MCP-SETUP.md; no se certifica una conexión dentro de esos clientes.

## Correcciones

Un registro local común reemplaza las dos rutas divergentes. No modifica configuraciones globales, no instala paquetes y no abre puertos. Los respaldos privados y salidas quedan ignorados. Se validan rutas y enlaces antes de crear directorios; se bloquean streams alternativos, controles y nombres de composición que parecen opciones. Configuraciones personalizadas y permisos del propietario requieren revisión en lugar de reemplazo silencioso. El plan no lanza Adobe y el render usa el ejecutable que pasó el preflight.

## Acción local pendiente

En el checkout de la PC con After Effects instalado y autorizado, ejecutar `npm run after-effects:setup -- --apply`, reiniciar los clientes instalados y aceptar su confianza de proyecto. Comprobar `after_effects_preflight` en cada cliente. Si no detecta Adobe, señalar la ubicación real del aerender instalado mediante ALTIORA_AERENDER. La autorización de render de un .aep es una acción posterior independiente, descrita en MCP-SETUP.md. GitHub no concede acceso a esa PC.

La publicación comercial permanece bloqueada por assets/derechos y aprobación, y el permiso de PR automáticas sigue a cargo del propietario en issue #31. Esta revisión no modifica ese ajuste.
