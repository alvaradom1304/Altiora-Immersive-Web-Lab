# Verificación de ejecutores locales

Observación: 2026-10-31, en la PC de la tarea. No es un inventario permanente ni certifica otras sesiones.

## Comprobado

Codex CLI respondió `codex-cli 0.166.0-alpha.5.1`. Se ejecutaron `--version`, `features list` y `debug --help` con un perfil CODEX_HOME nuevo y aislado, sin copiar autenticaciones ni configuración personal. Las tres consultas salieron con código 0 y sin advertencias en esa ejecución. No se inició una tarea con modelos; no se monitorizó tráfico de red.

La consulta de capacidades del perfil aislado indicó `hooks stable true`, `multi_agent stable true` y `skill_search stable true`. Eso comprueba capacidades declaradas del binario con ese perfil, no confianza de hooks, descubrimiento de agentes del proyecto ni conexiones MCP. No se activaron flags en el perfil real.

Las consultas de comandos y algunas ubicaciones estándar no localizaron las CLI de Claude o Gemini. Esto no demuestra ausencia en toda la PC. Se encontró el ejecutable de escritorio de Antigravity; no se lanzó ni se equipara a una CLI o una sesión activa.

## Capas de evidencia

Se ejecutó la prueba funcional aislada sobre los bytes del handler instalado del kit propio, comprobados contra su recibo SHA-256 `099719c26909a4ef5b801b786bd678f91b7bc19842e6d5b116bcc28b119fdcc2`. Pasaron 18/18 casos, seis para cada protocolo de Codex, Claude y Antigravity. Se copiaron únicamente handler/política a fixtures temporales y se eliminaron después; no se modificaron el kit ni las cuentas.

El resultado sigue indicando `native_discovery`, `native_trust` y `native_session` como NOT_VERIFIED. Shell, MCP arbitrarios y herramientas desconocidas quedan NOT_COVERED. La evidencia privada de esta PC se conserva como entregable local, fuera del commit. El [diagnóstico reproducible](RUNTIME-SMOKE.md) usa fixtures propios en CI y no requiere las rutas del dueño.

La implementación tiene 13 pruebas automatizadas de integridad, aislamiento y control de resultados. Una revisión independiente reprodujo dos clases de falso positivo con controles de parada incompatibles; se corrigieron con regresiones antes de compartir. El kit real no emitía esos campos y se volvió a comprobar con el validador corregido. El perfil comprueba respuestas concretas esperadas del kit, no todos los formatos de hooks válidos de cada proveedor.

| Capa | Qué prueba | Qué no prueba |
|---|---|---|
| Archivos y hashes | Payload instalado y sin deriva respecto al recibo | Descubrimiento del cliente |
| Ejecutor responde | Binario local puede procesar esa consulta | Login, modelos, agentes o MCP activos |
| Handler funcional en fixtures | Script probado ante entradas sintéticas | Que el host lo cargue, confíe o ejecute con su shell |
| Sesión nativa observada | Comportamiento de esa sesión ante ese caso | Comportamiento universal o futuro |

Un doctor estructural y una prueba del handler no deben etiquetarse LIVE_TESTED en el cliente. Conservar la confianza y autenticación como NOT_VERIFIED si no se ha observado su activación real.

## Contraste con fuentes primarias

La documentación de [hooks de OpenAI](https://learn.chatgpt.com/docs/hooks) distingue configuración y confianza de cada definición; cambiar un hook puede exigir una nueva revisión. Este trabajo no confía ni acepta hooks en nombre del propietario. [Build skills](https://learn.chatgpt.com/docs/build-skills) describe el descubrimiento por metadatos y rutas; un catálogo privado no sustituye el inventario nativo.

Se contrastaron los formatos de eventos con [Claude Code](https://code.claude.com/docs/en/hooks) y [Antigravity](https://antigravity.google/docs/hooks). Sus fuentes documentan formatos y limitaciones de shell propios; consultar una página no prueba la versión instalada ni una integración en vivo. No instalar un cliente o cambiar permisos únicamente para convertir una comprobación pendiente en PASS.
