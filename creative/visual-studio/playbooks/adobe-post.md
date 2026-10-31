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
