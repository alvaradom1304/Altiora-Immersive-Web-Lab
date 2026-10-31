# Playbook · Adobe & Postproduction (After Effects, Premiere, Photoshop)

**Cuándo:** montaje de campañas, motion graphics editorial, retoque fotográfico con consentimiento, colorización y entregas para redes.

**Inputs:** source footage, derechos de media/música/fuentes, timeline, presets de export, app/version, licencias, dispositivo de ejecución y permisos.

## SOP

1. Identificar el programa realmente disponible y su versión; distinguir control manual, script local, plugin UXP, CEP legacy, MCP no oficial y referencia documental.
2. Photoshop: inspeccionar soporte UXP oficial para edición de capas/paneles. Diseñar batch con dry-run, copia de seguridad y rollback.
3. Premiere: priorizar muestras UXP oficiales si el host/version lo permite; comprobar operación secuencia/media. No dar por hecho que un plugin de terceros está autorizado.
4. After Effects: scripting y templates según API/version; guías comunitarias como referencia, no copiar propiedad intelectual ni afirmar compatibilidad con UXP de Premiere.
5. Color: documentar OCIO/ACES, entrada de cámara/Blender, secuencia y salida SDR/HDR. QA de consistencia (vectorscope, muestras, revisión humana).
6. Export: FFmpeg para transcodificación comprobada; OpenTimelineIO para intercambiar estructuras editoriales cuando existan adaptadores, sin prometer fidelidad total a efectos nativos.
7. Validar audio, subtítulos, 9:16 safe area, codecs, fps, ingest/relink y permisos antes de publicar.

**Fuentes actuales:** samples AdobeDocs UXP Photoshop/Premiere del catálogo base, Adobe CEP Samples/Resources solo legado, After Effects scripting guide (referencia), FFmpeg, OpenTimelineIO, OCIO. Licencias de software host y codecs son independientes de las de GitHub.

**Entregables:** proyecto editable nativo cuando realmente exista, EDL/OTIO según caso, transcodes de prueba, manifest de medios y licencias, estado de conexiones, pruebas con capturas/logs.

**Gate de seguridad:** NO ejecutar un servidor MCP Adobe no auditado: acceso a archivos, red, permisos de edición y protección de proyecto. Si app no instalada, entregar plan/instrucciones, no afirmar render.

[Back to playbooks](README.md).

## After Effects — puente local disponible
[Instrucciones y límites del puente aerender](../after-effects/README.md) y [composición ExtendScript original](../after-effects/altiora-concept-comp.jsx). Antes de delegar a AE: `npm run adobe:check` en la computadora ejecutora, permiso de cuenta/licencia y fuente .aep revisada. No declarar que el conector Adobe para ChatGPT controla After Effects si no se comprobó esa función. Para efectos y componer a nivel nativo, optar por AE cuando sí está instalado; en caso contrario, el Director selecciona alternativa con Remotion, Blender o FFmpeg.

## After Effects: dos canales de acceso verificables

**Canal A — Adobe conectado en ChatGPT:** el conector Adobe está disponible para edición y composición de videos mediante operaciones de media/video y Creative Cloud, pero **no expone actualmente una operación directa para abrir o editar un proyecto nativo .aep o controlar el escritorio de After Effects**. La capacidad debe reevaluarse si aparecen nuevas herramientas. No prometer acceso a AE por el solo hecho de contar con Adobe.

**Canal B — After Effects instalado localmente:** puente [`scripts/after-effects-bridge.mjs`](../../scripts/after-effects-bridge.mjs), usado desde un checkout autorizado. Ejecutar `npm run after-effects:check` para descubrir aerender. Para diseñar una composición de ejemplo original, abrir la app y ejecutar [`after-effects/altiora-concept-comp.jsx`](../after-effects/altiora-concept-comp.jsx) con File → Scripts → Run Script File. Guardar el .aep en este workspace, configurar Render Queue/Output Module, y ejecutar:

```bash
node scripts/after-effects-bridge.mjs --plan approved/project.aep "NOMBRE_COMPOSICION" out/comercial.mov
node scripts/after-effects-bridge.mjs --render approved/project.aep "NOMBRE_COMPOSICION" out/comercial.mov
```

`--plan` no ejecuta nada; `--render` requiere solicitud de ejecución explícita, licencia válida y un proyecto existente. El informe resultante no equivale a QA de códec ni aprobación comercial. No ejecutar scripts de terceros sin revisión. Nunca conceder a plugins/MCP acceso ilimitado a proyectos de clientes.
