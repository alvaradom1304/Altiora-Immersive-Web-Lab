# Altiora — Control de seguridad para skills y repositorios externos

Fecha: 2026-10-30. Responsable: QA Reviewer + Experience Director. Aplica a Claude Code y Antigravity.

## Hallazgo y decisión

El proyecto al que se refería el usuario es [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) (Apache-2.0). Referencia auditada documentalmente: [commit 54921c8c7c23008c8af2328d5ab492a904b6ece4](https://github.com/NVIDIA/SkillSpector/commit/54921c8c7c23008c8af2328d5ab492a904b6ece4). Herramienta externa, NO es una de las skills de Altiora. Requiere Python 3.12–3.15; el proyecto observado declaraba versión 2.12.0. No está instalada por añadir este documento. No se ha ejecutado un escaneo real en la computadora del usuario.

## Instalación local revisable (no ejecutada automáticamente)

Inspeccionar cambios/licencias y dependencias antes de instalar. Desde terminal local con [uv](https://docs.astral.sh/uv/):

```bash
uv tool install 'skillspector @ git+https://github.com/NVIDIA/skillspector.git@54921c8c7c23008c8af2328d5ab492a904b6ece4'
skillspector --help
```

Si se requiere integración MCP, documentar por separado la instalación del extra `[mcp]` y evaluar el servidor antes de habilitarlo. No abrir su transporte HTTP al exterior. El flujo normal NO necesita MCP: usa CLI desde Node.

## Gate antes de importar skill, agente, prompt o script de terceros

1. Obtener la fuente en una carpeta de cuarentena sin ejecutarla, sin iniciar servicios ni instalar paquetes; registrar URL, licencia, SHA de commit y archivos relevantes. Nunca instalar con `curl | bash`, `npx skills add` u otro ejecutor de terceros sin esta revisión.
2. Revisar código, hooks, dependencias, instrucciones para lectura de archivos, posibles secretos, permisos, salidas a red, prompts e instrucciones de ejecución. Si no es un formato de skill, no interpretar un escaneo de SKILL.md como auditoría completa del repositorio.
3. Para una skill situada en `<ruta>`, ejecutar:

```bash
npm run security:scan -- --target <ruta>
```

La herramienta lanzará `skillspector scan <ruta> --no-llm --format json --fail-on-incomplete`. No instala ni ejecuta la skill inspeccionada. El gate **falla cerrado** si falta el scanner, da error, hay cobertura incompleta, o el resultado no es `SAFE` (riesgo <=20). Un resultado SAFE permite pasar a revisión humana, NO instalar automáticamente.
4. Validar función y contrato, licencia, dependencias, procedencia y compatibilidad. Copiar solo lo estrictamente necesario en la fuente canónica de Altiora; no duplicar agentes por marketing. Evitar permisos amplios, lectura de `.env`, claves, `~/.ssh`, navegadores y ficheros ajenos.
5. Antes de integrar al repositorio, ejecutar `npm run agents:build` si cambian agentes/skills, y `npm run check`. Registrar veredicto, fecha, SHA, modo del escaneo, hallazgos, revisión y decisión. Repetir en cada actualización del código externo.

## Privacidad y límites conocidos

**Modo estático por defecto:** `--no-llm` evita enviar contenido del archivo a un modelo externo. La detección SC4 puede consultar OSV.dev y enviar nombres/versiones de dependencias; si se prohíbe incluso esa salida, aislar la red y reconocer que los CVE en vivo no estarán disponibles. El scanner analiza patrones, no ofrece garantía contra todas las puertas traseras. No reemplaza aislamiento del sistema operativo, privilegios mínimos, control de secretos, revisión humana, antivirus ni autorización previa a instalar software.

Si el veredicto es `CAUTION` o `DO_NOT_INSTALL`, bloquear importación automática; hallazgos falsos positivos se documentan y revisan, no se desactivan en silencio. Los videos de clientes y materiales privados no se envían al scanner por rutina.

## Validación

El script se somete a pruebas de decisión con `node --test scripts/skill-security-gate.test.mjs`; estas pruebas comprueban lógica del gate, no el motor NVIDIA. Estado actual de escaneo real: **NOT_RUN** hasta tener SkillSpector instalado y un candidato en cuarentena.
