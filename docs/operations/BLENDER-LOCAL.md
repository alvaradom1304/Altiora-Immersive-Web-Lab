# Blender local: detección y prueba de arranque

Verificado el 2026-10-31 en la PC ejecutora. El diagnóstico previo solo consultaba `blender --version` desde PATH. Una inspección acotada de ubicaciones estándar encontró una instalación de Blender; no se cambió PATH ni se instaló software.

## Evidencia real

- Ejecutable de la instalación estándar Windows: respondió `Blender 5.2.2 LTS`, build `d13f752e3b9c`.
- Arranque con `--background --factory-startup --disable-autoexec`: proceso completado con salida 0. La expresión local únicamente importó `bpy`/`json` e imprimió versión, modo y motor predeterminado:

```json
{"version":"5.2.2 LTS","background":true,"engine":"BLENDER_EEVEE","render_performed":false}
```

- `capability:doctor` ahora devuelve `Blender: AVAILABLE` usando el preflight compartido. El diagnóstico ordinario solo consulta versión; no repite el arranque Python.

No se abrió archivo `.blend`, no se renderizó y no se probó GPU, addons ni integración dentro de Claude/Gemini/Codex/Antigravity. El arranque headless prueba ejecución local básica, no calidad visual o acceso MCP.

## Regla compartida de descubrimiento

`npm run visual:preflight` y `npm run capability:doctor` usan el mismo detector. Primero respetan el Blender que responde desde PATH; si no responde, en Windows consultan las versiones estables dentro de `Program Files/Blender Foundation`, en orden numérico descendente. macOS añade la ubicación estándar de Blender.app; Linux conserva PATH. Las consultas fallidas mantienen NOT_FOUND/ERROR y no implican ausencia de todo el disco.

Para una instalación diferente, el dueño puede proporcionar `ALTIORA_BLENDER` con una ruta absoluta al ejecutable local Blender antes de ejecutar el diagnóstico. Un override explícito falla sin sustituirlo silenciosamente por otra versión. Se rechazan rutas relativas, UNC, streams alternativos, controles y otros nombres de ejecutable en Windows. No se configura esta variable globalmente ni se abre un servicio. El propietario controla ejecutables/rutas y entorno de búsqueda; esto no es una auditoría de seguridad del binario.

El informe JSON incluye `executable` y `discovery` como evidencia local de selección. Puede contener rutas de instalación personales si se usa override: conservarlo fuera de GitHub. Nunca copiar la ruta de una PC al código compartido ni inferir de AVAILABLE un permiso para renderizar proyectos ajenos.

Las demás IAs deben actualizar el checkout y usar estos comandos desde él. No es necesario modificar sus cuentas ni instalar un MCP adicional.

## Comprobación posterior de render local

El mismo 31/10/2026 se ejecutó el script original `experiments/tilicheros-motion-lab/blender/generate-concept.py` con arranque limpio, autoexec deshabilitado, cuatro hilos, Cycles, 32 samples y tamaño 1080. Generó un PNG RGBA de 1080×1080 (575.954 bytes) y una fuente `.blend` (115.706 bytes) en una carpeta de entregables nueva, sin sobrescribir archivos.

FFprobe identificó el PNG/RGBA y FFmpeg lo decodificó con salida 0. Se inspeccionó visualmente la imagen; la fuente volvió a abrirse en Blender y reportó Cycles, 1080×1080, 32 samples, cámara y 18 objetos. Se observó un error no fatal al intentar escribir una miniatura fuera de la carpeta de trabajo y avisos de deprecación; no se concedieron permisos ni se repitió el render para ocultarlos. El proceso de render salió con código 0 y ambos entregables se comprobaron.

La geometría sigue siendo conceptual y original, sin producto comercial ni derechos de cliente acreditados. Los medios y rutas personales se conservan como entregables locales; no se publican en este repositorio. Esta prueba local amplía la evidencia anterior de arranque y no conecta un MCP ni certifica GPU, fotorrealismo o una sesión de otra IA.
