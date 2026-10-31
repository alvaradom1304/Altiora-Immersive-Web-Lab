# Operación común de Altiora

Fuente compartida para Claude Code, Codex, Gemini CLI, Antigravity y ChatGPT. Cargar únicamente la sección necesaria. No instala software, no conecta cuentas y no amplía permisos.

## Control completo antes de integrar cambios

Desde la raíz del checkout ejecutar `npm run check`, con Node.js 20+ y Python 3.11+ disponibles como `node` y `python`. Es el mismo control usado en CI Windows/Linux: catálogo/agentes/continuidad, puentes AE, diagnóstico y QA de producción, compactador/identidad, handler aislado, Bibliotecario, 17 casos de recuperación y medidor PCM. Las suites se detienen ante un error; no ejecutar otra vez cada comando por separado tras un PASS completo sin cambios nuevos.

`npm run check:base` conserva el control anterior del catálogo y los puentes, pero es una comprobación parcial. Para cambios acotados siguen disponibles `operations:test`, `toolkit:test`, `runtime:test`, `librarian:test`, `routing:eval` y `audio:test`. Son pruebas con fixtures; no arrancan aplicaciones creativas, servidores MCP ni sesiones autenticadas, y no certifican selección nativa, escucha o derechos.

## Diagnóstico en la máquina ejecutora

Desde la raíz del checkout, con Node.js 20+:

```sh
npm run capability:doctor -- --text
node scripts/capability-doctor.mjs --json
```

El segundo comando emite JSON puro por stdout. Para conservar evidencia, el operador puede redirigirlo a `out/capability.local.json` tras crear `out/`. Ese directorio se ignora en Git. El informe no lee configuraciones personales ni imprime comandos MCP, entornos o credenciales de configuración. Solo consulta versiones de ejecutables y archivos concretos del proyecto. No inicia servidores MCP, clientes, renders ni servicios.

Blender se busca también en instalaciones estándar fuera de PATH; ver [evidencia y límites locales](BLENDER-LOCAL.md). Su ruta ejecutable puede aparecer en el JSON: conservar ese informe localmente si contiene ubicaciones personales. La detección no habilita conexiones de clientes.

| Resultado | Significado | Siguiente acción |
|---|---|---|
| `AVAILABLE` | Un ejecutable respondió a la consulta de versión | Probar el trabajo concreto con permisos vigentes |
| `DETECTED_NOT_RENDER_TESTED` | aerender respondió a ayuda | Confirmar licencia y proyecto; render solo con consentimiento local ya definido |
| `NOT_FOUND`, `NOT_INSTALLED`, `NOT_DETECTED`, `ERROR` | No se comprobó disponibilidad en este entorno | Revisar ruta/instalación; no instalar por efecto lateral |
| `WINDOWS_WRAPPER_NOT_PROBED` | La consulta directa no ejecuta wrappers npm.cmd/npm.ps1 | Consultar `npm --version` en la terminal propia; no significa npm ausente |
| `ENTRY_SHAPE_PRESENT` | JSON del proyecto tiene los campos mínimos | Abrir el cliente y comprobar sus herramientas reales |
| `ENTRY_TEXT_PRESENT_NOT_TOML_VALIDATED` | Se encontró la sección textual de Codex | No certifica sintaxis TOML; revisar con el cliente |
| `MISSING`, `INVALID_ENTRY`, `INVALID_UNREADABLE_OR_UNSAFE` | Falta archivo o no puede inspeccionarse con seguridad | Revisar checkout/rutas y guía MCP existente |
| `NOT_VERIFIED`, `NOT_PERFORMED` | No hay prueba de conexión/ejecución | Mantener este estado hasta obtener evidencia desde la sesión real |

La inspección distingue adaptador del proyecto y configuración MCP; no busca sesiones ni cuentas. Las copias personales pueden diferir. Los ajustes de After Effects siguen en [MCP-SETUP](../../creative/visual-studio/after-effects/MCP-SETUP.md); el diagnóstico no los habilita. No usar un resultado del runner de GitHub para afirmar acceso al PC.

## Bibliotecario: evaluación de recuperación

```sh
npm run routing:eval
python -m unittest discover -s skills/altiora-bibliotecario/scripts -p "test_*.py"
```

Ver los casos versionados en [routing-evals](../../skills/altiora-bibliotecario/references/routing-evals.json). Usan metadatos locales, encargos representativos y abstención cuando falta intención. Comprueban candidatos recuperados, no ejecución real de agentes, obediencia universal ni calidad de una entrega. El evaluador no llama a modelos ni lee toda la biblioteca de instrucciones. No publica porcentajes de ahorro de tokens.

Para medir ahorro en el futuro, comparar encargos equivalentes con criterio de aceptación fijo, consumo expuesto por el cliente, relecturas, correcciones y tiempo total, incluidos subagentes. Sin esas mediciones el ahorro es desconocido.

El buscador local compara términos completos para evitar [falsos candidatos por subcadenas](LIBRARIAN-BOUNDARIES.md), como SEO dentro de «deseo». Eso no añade comprensión semántica, negación o sinónimos automáticos: el coordinador conserva la decisión y los permisos.

Al reutilizar un índice local tras cambios o retomar una instalación, ejecutar `library.py check --catalog RUTA_LOCAL` desde la skill instalada. [Estados y límites](../../skills/altiora-bibliotecario/references/portability.md): solo `METADATA_CURRENT` da salida0; altas, bajas y cambios de metadatos producen `STALE`. Los índices antiguos sin raíces piden reconstrucción explícita. No ejecutar sobre índices ajenos sin revisar sus raíces; no recorre bibliotecas por mensaje ni actualiza archivos automáticamente.

## Producción audiovisual y revisión humana

Reutilizar los informes técnicos de video y audio existentes y seguir [QA de producción](production-qa.md). Vincular la evidencia a la misma versión de medios; una modificación del master exige repetir los controles afectados. No considerar el WAV analizado como la pista del MP4 sin evidencia explícita de extracción o correspondencia.

Escuchar y ver el archivo real, comprobar sincronización e inteligibilidad, registrar derechos y revisión del cliente. No rellenar esos campos por inferencia ni por éxito de tests. La medición PCM original no certifica LUFS ni true peak. El agregado no publica ni autoriza difusión.

El hito comercial exige producto, material, afirmaciones y derechos auténticos. Si faltan, dejar bloqueado ese paso y continuar con herramientas y pruebas reversibles.

## Uso por cliente

Para comprobar que el handler instalado responde, utilizar la [prueba funcional aislada](RUNTIME-SMOKE.md) únicamente con un kit propio ya revisado. Separa PASS del script y NOT_VERIFIED de la sesión nativa: no ejecuta comandos de configuración, no autentica clientes ni otorga confianza. La [observación de ejecutores locales](NATIVE-RUNTIME-VALIDATION.md) registra capacidades consultadas en un perfil aislado; no extrapolarlo al perfil personal o al de otra IA.

| Cliente | Entrada compartida | Evidencia local necesaria |
|---|---|---|
| Claude Code | `CLAUDE.md` → `AGENTS.md`; agentes generados en `.claude/agents` | Herramientas visibles en sesión; revisar `/mcp` |
| Codex | `AGENTS.md`; adaptador de audio en `.codex/agents` | Herramientas de la sesión y confianza del proyecto; no inferir acceso del TOML |
| Gemini CLI | `GEMINI.md`; adaptador de audio en `.gemini/agents` | Revisar `gemini mcp list` y herramientas autorizadas |
| Antigravity | `GEMINI.md`, prompts portables de `team/agents` | Comprobar descubrimiento del IDE y panel MCP; el archivo local no se versiona |
| ChatGPT u otra IA web | Adjuntar este documento, rol necesario y resumen de evidencia | Sin terminal usar un operador o entorno conectado; leer GitHub no conecta el PC |

Todos usan los mismos scripts y formatos del repositorio. Un prompt portable no crea agentes en un cliente que no los soporte. Actualizar el checkout y regenerar con `npm run agents:build` cuando cambie la fuente; las cuentas y copias personales no se sincronizan automáticamente.

## Continuidad y entrega

Para afilar la biblioteca instalada, usar el [compactador conservador](SKILL-COMPACTION.md): plan de solo lectura primero y aplicación sobre plan revisado con respaldo. Solo elimina dos secciones generadas exactamente repetidas; no reescribe skills de terceros, modelos o el plugin Superpowers. Mide bytes/caracteres, no ahorro de tokens.

Antes de compartir cambios, comprobar [identidad del proyecto](PROJECT-IDENTITY.md) contra un repositorio esperado explícito del encargo. No deducir el destino de origin, mezclar carpetas de empresa/cliente ni reparar Git automáticamente para forzar un PASS. El diagnóstico no publica ni concede permiso.

Ver [evidencia de afilado](TOOLKIT-VALIDATION.md) para distinguir archivos locales instalados, pruebas, MCP de coordinación y sesiones que siguen sin verificarse. Una instrucción de continuar permite completar los pasos desbloqueados del encargo; no implica ejecución después de cerrar el chat ni crear automatizaciones periódicas.

Guardar en el tablero solo resultado y evidencia breve. No incluir credenciales ni medios privados en GitHub. El [checkpoint](../../continuity/checkpoint.json) distingue implementación de conexión y producción real. El permiso pendiente del Scout está en [issue 31](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/issues/31); este protocolo no lo modifica.
