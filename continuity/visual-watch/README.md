# Visual Tech Scout — vigilancia semanal de librerías

**Objetivo:** detectar evolución relevante de las referencias visuales de Altiora sin instalar decenas de paquetes ni conceder permisos de edición a repositorios ajenos.

## Activación real

El workflow [Altiora Visual Tech Scout](../../.github/workflows/visual-tech-scout.yml) está programado para **los lunes a las 13:17 UTC (07:17 Costa Rica)** y se puede ejecutar manualmente desde GitHub Actions → Altiora Visual Tech Scout → Run workflow, una vez integrado en la rama principal.

El calendario depende del servicio de GitHub: las ejecuciones pueden retrasarse, el workflow puede deshabilitarse por inactividad o por configuración del repositorio. **La programación no equivale a garantizar disponibilidad 24/7.**

## Qué inspecciona

- Repositorio existente/canónico.
- Cambios de licencia declarada, archivado, deshabilitado, rama principal.
- Actividad en repositorios de prioridad P0.
- Repositorios nuevos o que salieron del catálogo.

Cuando encuentra cambios, genera `latest.json` y `review.md`, sube el reporte como artifact y trata de abrir una PR con las observaciones. **No descarga, compila ni instala código externo; nunca fusiona automáticamente.**

El primer escaneo genera una **línea base**. Un cambio de licencia detectado por metadatos requiere leer el texto real de la licencia y sus componentes. No reemplaza revisión de releases, advisories ni pruebas del producto.

## Configuración necesaria

En GitHub, Actions debe estar habilitado y el workflow debe tener permisos para crear ramas/PR con `GITHUB_TOKEN`. En algunos repositorios es necesario activar **Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**. Si falla esa creación, el job lo notificará en el resumen y conservará el artefacto de la revisión.

No usar token personal de alto privilegio ni guardar secretos en los reportes.

## Pruebas y uso manual

Desde el root con Node 20+:

```bash
npm run visual:watch:test   # pruebas offline, sin red
npm run visual:watch        # escaneo remoto de solo lectura, imprime reporte
npm run visual:preflight    # comprueba binarios presentes EN ESTA máquina
npm run visual:preflight -- --json
```

Para proponer actualización de snapshot desde un checkout revisado: `node scripts/visual-watch.mjs --write`. Comprobar cambios y crear PR; nunca modificar production package.json directamente desde el watcher.

## Cómo lo usa cada IA

- **Claude Code:** consultar [rol Visual Tech Scout](../../creative/visual-studio/agents/visual-tech-scout.md), reporte de scan y `AGENTS.md` antes de proponer un upgrade.
- **Gemini/Antigravity:** mismos artefactos; no inferir que Blender/Adobe ya están conectados.
- **ChatGPT/Codex:** puede inspeccionar snapshot GitHub y proponer cambios en rama/PR; distinguir metadatos y datos confirmados de la app local.

**Después del scan:** un operador evalúa utilidad, compatibilidad, licencia real, CVE, impacto visual, seguridad y coste; acepta o descarta la propuesta. El siguiente ciclo incorpora aprendizajes validados mediante playbooks actualizados.

## Seguridad y fallos

- Si GitHub API falla o se alcanza límite, el job falla claramente. **No** reetiquetar la biblioteca como actualizada.
- Si hay una PR de vigilancia abierta, no sobrescribirla; el nuevo reporte queda en el artefacto de Actions para inspección.
- El scanner es metadatos; NO autoriza ejecutar README, npm install, scripts MCP, Adobe UXP, código Blender externo ni extensiones.
- Evitar PRs solo por stars; las estrellas no predicen estabilidad ni calidad.
- [Reanudar Altiora](../README.md) y revisar el checkpoint para no depender de la respuesta de ChatGPT.
