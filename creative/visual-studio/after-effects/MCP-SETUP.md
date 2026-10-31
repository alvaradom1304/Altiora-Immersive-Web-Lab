# Conectar After Effects en todas las IAs de Altiora (MCP local)

**Status:** servidor MCP `stdio` y script de registro disponibles en GitHub. **No está instalado todavía en tu computadora**. Para acceder a proyectos AE, cada IA debe correr desde el mismo PC donde exista After Effects o desde un ejecutor local autorizado. Esta guía NO abre puertos ni ofrece acceso remoto desde ChatGPT en iPhone/web.

## Conexión única recomendada

Requisitos: Node.js 20+, repositorio Altiora clonado en una carpeta local, aplicaciones de IA instaladas (Claude Code, Gemini CLI/Antigravity, Codex CLI) y After Effects instalado y licenciado.

Desde terminal en la raíz del repo de Altiora:

```bash
npm run ae:clients:plan
npm run ae:clients:connect
npm run after-effects:check
```

**Plan** solo imprime qué configuraciones se instalarían. **Connect** es una acción local explícita: utiliza los comandos oficiales `claude mcp add --transport stdio --scope project`, `gemini mcp add --scope project`, `codex mcp add`; además escribe `.agents/mcp_config.json` de Antigravity, preservando otros servidores. Las configuraciones apuntan al Node.js y al archivo MCP absolutos del PC donde se ejecute. Si una CLI no está instalada, reporta `CLI_NOT_INSTALLED`, y no se marca conectada.

No guardar `.agents/mcp_config.json` con rutas absolutas personales o claves en un commit. Para evitar exponerla, se añade al `.gitignore`. La herramienta también puede utilizarse cliente por cliente si alguno no acepta su comando debido a versión.

## Verificación cliente por cliente

- **Claude Code:** `claude mcp list`, o `/mcp` desde Claude Code; buscar `altiora-after-effects`.
- **Gemini CLI:** `gemini mcp list` y `/mcp`. El servidor es de proyecto, no de usuario global.
- **Antigravity IDE:** en el panel del agente abrir `… → MCP Servers → Manage MCP Servers` y revisar `altiora-after-effects`. Si no lo detecta automáticamente, usar `View raw config` y registrar el bloque de `.agents/mcp_config.json` que generó el instalador. Revisar permisos para el workspace.
- **Codex CLI/IDE local:** `codex mcp list` y `/mcp`. El Codex de una computadora conectada no equivale al ChatGPT web ni al de tu iPhone.

Referencias oficiales de las rutas: [Antigravity](https://antigravity.google/docs/mcp), [Gemini CLI](https://geminicli.com/docs/tools/mcp-server/), [Codex](https://learn.chatgpt.com/docs/extend/mcp).

## Acceso seguro disponible por defecto

Servidor: `scripts/after-effects-mcp.mjs`.

- `after_effects_preflight` — consulta el ejecutable local `aerender`; solo lectura.
- `after_effects_plan_render` — valida un archivo existente `.aep` dentro del repo y prepara argumentos; NO ejecuta.
- `after_effects_render` — **oculto/deshabilitado por defecto**. Solo disponible cuando el propietario establece explícitamente dos variables en la configuración local de la IA: `ALTIORA_AE_ALLOW_RENDER=YES-I-APPROVE-LOCAL-RENDERS` y `ALTIORA_AE_APPROVED_PROJECT=approved/my-approved-project.aep`. El render únicamente acepta **ese archivo exacto** dentro de Altiora, y una salida nueva en `out/`. No sobrescribe archivos existentes.

No configurar esas variables para todas las IAs sin evaluar permisos de cada una. Usar permiso por proyecto, apagarlo al terminar y revisar la acción antes de ejecutar. La detección de `aerender` no acredita que Adobe tenga licencia activa; la validación real exige ejecutar un render y comprobarlo.

## Si no detecta After Effects

Configurar en el **PC local** `ALTIORA_AERENDER` con la ruta del ejecutable oficial para la versión instalada (puede variar en Windows/macOS). Luego reiniciar el cliente y repetir `npm run after-effects:check`. Si continúa sin detectarse, la aplicación no queda conectada. No instalar servidores MCP de terceros desconocidos o abrir puertos públicos para solucionarlo.

### Ejemplo de conversación con tu director audiovisual

«Altiora: prepará una animación cinematográfica del artículo de Tilicheros. Elegí automáticamente si conviene After Effects, Blender o Remotion, revisá accesos disponibles y solo usá After Effects para un proyecto autorizado. Entregá preview y QA antes de publicar».

El Director consulta las herramientas sin pedirte seleccionar software; decide el pipeline y delega. Este archivo de configuración no mantiene una IA trabajando 24/7 y no habilita control de escritorio para servicios remotos.
