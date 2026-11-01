# Claude Code: descubrimiento y sincronización

Fecha de investigación: 2026-10-29. Base inspeccionada: `573b56b93bd8b8836c3cce9aafb02ccf02cd3f9b`, rama `feature/altiora-creative-ads-media-pipeline`, PR #10.

## Hallazgo reproducido

Había 260 carpetas fuente con SKILL.md, 15 roles canónicos y 89 skills distintas asignadas a esos roles. El generador añadía `disable-model-invocation: true` a las otras 171. Estaban disponibles por comando manual pero excluidas de la selección del modelo. La pertenencia a un agente no es un criterio de disponibilidad de una skill.

El número 111 fue reportado por el usuario y NO se reprodujo como conteo de esta rama. No hay ejecutable `claude` disponible en PATH ni en la ubicación nativa habitual en este entorno de trabajo. Sin versión, directorio de la sesión, overrides y salida de `/context`, no puede afirmarse qué combinación produjo exactamente 111. Un límite de descripciones, otro checkout, una sesión antigua o configuración del usuario son hipótesis, no hechos comprobados. No se leyó ningún archivo de credenciales.

El check original también falló en Windows: Antigravity extraía las skills de una tabla de INDEX.md con una expresión sensible a CRLF; además recibía descripciones truncadas a 140 caracteres para la presentación. Ahora ambos generadores leen directamente las fuentes y normalizan saltos de línea para comprobar derivados.

## Inventario reconciliado, sin dobles conteos

| Grupo | Antes | Después | Método |
|---|---:|---:|---|
| Skills canónicas del laboratorio | 260 | 260 | Originales conservados; sin reescritura ni baseline nuevo |
| Skill local adicional portable | 0 | 1 | immersive-interaction-lab, copia exacta con SHA-256 |
| Skills fuente totales | 260 | 261 | Nombres únicos y ruta fuente resoluble |
| Elegibles para selección del modelo | 89 | 261 | Se elimina exclusión por no estar asignada a un rol |
| Roles del registro canónico | 15 | 15 | team/agents.json intacto |
| Adaptadores de roles locales distintos | 0 | 7 | 4 altiora-* y 3 immersive-* |
| Roles totales del laboratorio | 15 | 22 | Misma identidad en Claude y Antigravity |
| Comandos auxiliares | 17 | 24 | chat por rol, equipo y repos; NO son nuevas skills fuente |

Siete configuraciones Codex y tres configuraciones Claude locales contienen siete identidades distintas, no diez agentes nuevos. Se guardan diez originales en `team/local-sources/`, hashes y procedencia en su manifest, y siete adaptadores en `team/local-agents.json` y `team/roles/`. Se eligió la variante nativa Claude para los tres roles immersive; las variantes Codex permanecen como evidencia. Las adaptaciones cambian rutas de usuario por rutas del laboratorio; las misiones y restricciones originales quedan en los snapshots.

En `~/.codex/skills` se encontraron 239 skills directas: 238 nombres ya estaban en las 260 del laboratorio y la restante es la importada. En `~/.claude/skills` había 26: 25 coinciden con el catálogo previo y la otra es la misma skill immersive. Los duplicados por nombre no se vuelven a importar ni reemplazan las variantes del repositorio. Los plugins del host mantienen su instalación y sus namespaces: no se copian como si fueran conexiones o capacidades nativas del laboratorio.

Otro proyecto (`~/OneDrive/Desktop/altiora`) tiene diez comandos de Altiora OS: altiora-os-automation-growth, altiora-os-coordinate, altiora-os-creative, altiora-os-media, altiora-os-qa, altiora-os-research, altiora-os-strategy, altiora-os-web-3d, altiora-runtime-bridge y altiora-session-handoff. Referencian `altiora-os/docs/protocol.md`, `.altiora/system` y contratos/scripts de aquel proyecto; se registran como capacidades CONTEXTUALES, no portables por solo copiar SKILL.md. No se importan dependencias ni contextos de otro proyecto en esta reparación. Permanecen disponibles en su proyecto original. No se cuenta esa lista como diez skills funcionales nuevas en este laboratorio.

## Qué cambió

- `scripts/skill-catalog.mjs`: inventario único para ambos generadores; valida nombres, duplicados, descripción y restricciones explícitas de la fuente. Una restricción manual futura en el original se conserva en Claude.
- `scripts/build-agents.mjs`: todas las skills son seleccionables por pertinencia, sin modificar su contenido. Los puentes obligan a leer la fuente y resolver allí sus referencias/scripts. Roles y comandos se generan también para los siete adaptadores.
- `scripts/build-antigravity.mjs`: descripciones completas de fuente, sin leer INDEX; comprobación tolerante a CRLF.
- `.claude/settings.json`: presupuesto de listado calculado desde nombres y descripciones con margen de formato. Es un ajuste local del proyecto, conserva otras claves y no concede herramientas ni evita aprobaciones. Aumenta espacio potencial para metadatos; no prueba consumo menor ni ejecución de las skills. Un override administrado o del usuario puede prevalecer.
- `references/discovery-manifest.json`: separa fuentes, roles, comandos y estado del runtime. `runtime_discovery: NOT_RUN` es deliberado.
- `scripts/discovery.test.mjs`: regresiones sobre visibilidad, descripción íntegra, agentes/commands, hashes, presupuesto y fixture real de Antigravity con CRLF y sin INDEX.

## Actualización 2026-10-31: núcleo por uso demostrado

Con autorización del dueño, el listado automático se reduce a un **núcleo de 51 skills** definido en `references/skill-core.json`: las 34 con uso demostrado en trabajo real y 17 de método (incluido `aem-company-builder`, método único de agencia desde el 2026-10-31). Las otras 212 quedan en **reserva**: conservan su puente en `.claude/skills/`, se invocan con `/nombre` y aparecen en `INDEX.md` con «Auto: —», pero llevan `disable-model-invocation: true`.

El criterio de 2026-10-29 (no ocultar por falta de rol asignado) sigue siendo válido; lo que cambia es el criterio de visibilidad: **uso demostrado**, no asignación a un rol. Promover una skill = añadirla a `skill-core.json` y ejecutar `npm run agents:build`. Evidencia y método en la [auditoría](auditoria-infraestructura-agentes-2026-10-31.md). Antigravity no aplica esta distinción: sigue recibiendo las 263 skills.

## Uso y validación en la instalación real

Actualizar esta rama y abrir la RAÍZ del laboratorio en Claude Code. Ejecutar `npm run agents:build` y `npm run check`. Abrir una sesión nueva o recargar las personalizaciones admitidas por su versión. Consultar `/agents` para los roles, el menú `/` para skills/comandos, `/context` para el listado recibido por el modelo y `/doctor` para diagnóstico del presupuesto. No esperar ver 261 al contar solo comandos de chat ni sumar los agentes otra vez como subagentes.

Probar `/cash-flow-analysis` (una skill antes oculta), una petición natural pertinente y `/chat-altiora-research` con una tarea de solo lectura. Comprobar que se lee `skills/cash-flow-analysis/SKILL.md` y sus referencias desde la carpeta original. Registrar versión de Claude, raíz/rama, revisión y resultado. Estos smoke tests del runtime están PENDIENTES; no se inició una sesión de pago para simular evidencia.

Si no aparecen, comprobar overrides de skills, Skill en permisos/disallowedTools, política administrada, raíz abierta y versiones. No desactivar seguridad ni importar credenciales. Las diferencias con plugins/skills personales son esperables y deben contabilizarse por separado. No ejecutar tests comerciales ni abrir cuentas para lograr una cifra.

## Fuentes técnicas primarias

[Skills de Claude Code](https://code.claude.com/docs/en/skills): rutas de proyecto, controles de invocación y presupuesto de descripciones. La documentación actual indica que los nombres permanecen en el listado y algunas descripciones pueden recortarse; no permite deducir 111 por sí sola. El ajuste `SLASH_COMMAND_TOOL_CHAR_BUDGET` admite presupuesto fijo.

[Subagentes de Claude Code](https://code.claude.com/docs/en/sub-agents): archivos nativos, identidades, herramientas y precarga selectiva. No se precargan cientos de cuerpos en todos los agentes; los prompts indican leer solo las capacidades pertinentes. El revisor local conserva su restricción de herramientas de lectura.

Próximo paso: abrir la revisión publicada en la instalación habitual de Claude y completar los smoke tests anotando la versión; el repositorio por sí solo no puede certificar una sesión del usuario.
