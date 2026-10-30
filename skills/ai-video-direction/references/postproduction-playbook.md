# Altiora — Protocolo de postproducción de video real (v1.0)

**Ámbito:** extensión operativa de `ai-video-direction` para editar grabaciones reales desde Claude Code o Antigravity. No es un agente nuevo ni un renderizador autónomo. Activación: «edita estos clips», «une las tomas», «monta el Reel», «añade motion graphics», «exporta el anuncio».

## Resultado y límites de ejecución

La salida esperada, **cuando existen videos accesibles y herramientas instaladas**, es un MP4 reproducible, fuentes editables, manifiesto del montaje y reporte QA. No confundir diseñar un montaje con renderizarlo. Sin acceso a los videos, entregar plantilla y estado `BLOCKED`, no un «video final». Cada paso indica `NOT_RUN/PASS/FAIL`.

**Responsable:** `creative-ads-director`; especialistas según necesidad: `visual-producer` (producto/imagen), `motion-designer` (animación), `qa-reviewer` (verificación), `growth-analyst` (medición posterior). Invocar `cinematic-direction`, `storyboarding` y `creative-quality-assurance` solo cuando correspondan. El director es una configuración invocable, no un servicio en ejecución continua.

## Estructura de entrada/salida

Crear dentro del proyecto del cliente, sin subir video privado ni grandes binarios a Git por defecto:

```text
campaign/
  01_CRUDOS/           # videos originales, inmutables
  02_REFERENCIAS/      # enlaces, licencias y briefs; NO copiar anuncios
  03_FINALISTAS/
    humor/
    premium/
  editing/
    media-inventory.json
    selects.md
    timeline.json
    narration-and-captions.srt
    brand-truth.md
    qa-report.md
    sources/            # Remotion/FFmpeg scripts, fuentes, LUTs autorizados
```

**Antes de trabajar:** comprobar permisos de rostros/voz/audio/música y derechos del logo; registrar si los audífonos son AirPods genuinos o earbuds de otra marca, SKU, precio y prestaciones **verificados**. Si no hay verificación, decir «earbuds inalámbricos» sin inventar cancelación, micrófono, autonomía o compatibilidad.

## SOP ejecutable

1. **Inspección reproducible.** Enumerar archivos sin alterarlos; calcular SHA-256 para rastrear originales. Localizar `ffmpeg`, `ffprobe`, Node y Remotion en PATH/proyecto; distinguir disponible de planeado. Para cada video ejecutar (o adaptar a la plataforma): `ffprobe -v error -show_streams -show_format -of json "CLIP.mov"`. Registrar fps, codecs, dimensiones, duración, audio, orientación, variaciones VFR, ruido y clips dañados. No inferir escenas por nombre de archivo.
2. **Logging de tomas.** Visionar el contenido real; transcribir diálogos reales y marcar timecodes `in/out`, acción, calidad de audio, foco, exposición, uso comercial y derechos en `editing/selects.md`. Si un clip no puede visualizarse, no inventar su contenido.
3. **Dos narrativas diferentes.** Para El Tilichero: (A) humor «¿Me escuchan?» **solo si los crudos permiten contar la escena**; (B) producto premium con detalles reales y CTA. Preparar `editing/timeline.json` con segmentos `source, in_s, out_s, track, speed, transition`, duración estimada y `claim_evidence`. Si faltan escenas esenciales, escoger otra historia honesta o solicitar tomas adicionales.
4. **Edición base (FFmpeg).** Conservar masters originales; usar proxies si pesan. Normalizar FPS, escala, rotación y formato antes de concatenar; aplicar `trim/atrim`, `setpts/asetpts`, `scale/crop/pad`, `concat`, `xfade/acrossfade` según correspondan, con timebases compatibles. Controlar saltos de tiempo y clips VFR. No añadir escalados o interpolación que introduzcan artefactos. La composición debe poder repetirse desde los archivos fuente.
5. **Animación y motion graphics (Remotion o equivalente disponible).** Diseñar sistema visual reutilizable: gancho 0–2 s, subtítulos legibles y animados, reacción con punch-in moderado, macro del producto, logotipo verificable y CTA hacia WhatsApp. Usar `spring`/`interpolate` o keyframes con tiempos explícitos, evitando plantillas genéricas, textos excesivos y zooms continuos. Usar Remotion solo si está instalado y su licencia/versión permite el trabajo; revisar paquetes y no instalar dependencias sin inspección.
6. **Sonido.** Corregir balance de voces, ruidos y clipping; preservar inteligibilidad. Sincronizar foley realista (apertura de estuche, clic, transición), música con licencia autorizada y subtítulos revisados. No publicar música comercial sin derechos; no fabricar una «prueba» de calidad de micrófono.
7. **Color y look.** Unificar temperatura, contraste, luminancia y tonos de piel según el material, sin afirmar que se mejora la calidad óptica con IA. Evitar sobreprocesamiento del producto. Guardar referencias visuales y ajustes reproducibles.
8. **Render.** Exportar por defecto `1080x1920` (9:16), H.264, AAC, `yuv420p`, 30 fps como estándar del encargo salvo decisión técnica por material; usar `-movflags +faststart` si se produce con FFmpeg. Nombre: `el-tilichero-earbuds-humor-v01.mp4` y `el-tilichero-earbuds-premium-v01.mp4`. Guardar proyectos editables. Si se requieren versiones sin audio, subtítulos o para un canal distinto, exportar variantes identificadas.
9. **QA automatizado + visual.** Verificar que MP4 existe y pesa >0, abre y reproduce; `ffprobe` devuelve duración, 1080x1920, fps, streams de audio esperados; decodificación completa sin errores; revisar fotogramas inicial/final, textos dentro de zonas seguras, sincronía labial, cortes negros accidentales, silent gaps, derechos, claims, logotipo, CTA, estética y uso de producto. `blackdetect/silencedetect` son pistas, **no prueba suficiente**. Si no se ha visto/reproducido el archivo final, `QA visual = NOT_RUN`.
10. **Entrega y aprendizaje.** Devolver rutas relativas a MP4, fuente editable, inventario, timelines, manifiesto de recursos/licencias, resultados de QA y pendientes; sin sustituir MP4 por código. Las visualizaciones, leads y ventas son resultados posteriores: no afirmar éxito comercial al exportar.

## Criterios de aprobación

- Ambos renders corresponden a **tomas reales verificadas** y no contienen características/claims inventados.
- Se preservan todos los originales; la receta y sus entradas están documentadas.
- El humor se entiende sin depender de audio; los planos premium presentan el producto real.
- El CTA es legible, identidad consistente, archivos reproducibles y formato correcto.
- Cualquier error de audio, frame negro no intencional, derecho no aclarado, logo ajeno o incompatibilidad de dispositivo bloquea el estado `SUCCESS`.
- El reporte especifica qué se ejecutó con evidencia, qué solo se preparó y qué queda por validar en Instagram/TikTok.

## Modo de trabajo cuando llegan grabaciones de iPhone

Transferir originales con AirDrop, cable o transferencia de archivos **sin** comprimirlos por WhatsApp. Copiar al proyecto `01_CRUDOS/` y no renombrar ni borrar masters; si hay iCloud, confirmar descarga local completa. Abrir **la carpeta del proyecto** desde Claude Code, no tratar Claude como almacenamiento de video. Si el editor está abierto fuera de esa carpeta, usar una ruta absoluta confirmada por el usuario. No subir crudos al repositorio de Altiora ni exponer caras/voz del cliente.

## Caso concreto: El Tilichero / earbuds

- A: 15–25 s, diálogo real + reacción auténtica + revelación del producto + CTA. Si no hay diálogo usable, reconstruir con texto narrativo honesto o pivotar a demostración con humor visual.
- B: 12–20 s, apertura de estuche → detalle del auricular → colocación → resultado cotidiano verificable → packshot + CTA.
- Evitar «AirPods Apple» salvo autenticidad comprobada. Usar «consultá precio y disponibilidad por WhatsApp» mientras no consten datos verificables de precio/inventario.
- Los efectos no son un fin: hacer que el producto y el beneficio se entiendan con claridad. Validar en móvil antes de publicar.

## Integración con el contrato actual

Esta extensión **no reemplaza** `references/contract.json`, `output-schema.json` ni `protocol.md` del skill. `video_brief` incorpora el inventario y montaje, `prompts` documenta acciones/recetas reproducibles de postproducción y `continuity_checks` incluye resultados de QA/renders con sus rutas y estados reales. Se mantienen `SUCCESS/FAILED/BLOCKED/NEEDS_REVIEW` según el contrato. Las capacidades profesionales requieren pruebas con material y entorno reales.
