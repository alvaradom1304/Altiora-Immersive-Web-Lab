# Revisión conjunta de audio y video

`node scripts/production-qa.mjs --bundle out/production-review.json` agrega informes existentes y revisiones explícitas. No renderiza, modifica, sube ni escucha medios; no instala paquetes. Funciona desde la raíz del checkout con Node 20+, en los mismos términos para Codex, Claude Code, Gemini/Antigravity y otras IAs con ejecución local autorizada. Un chat sin ejecución puede leer el contrato, pero no afirmar que ejecutó la comprobación.

## Evidencia requerida

1. Conservar el archivo final y calcular su SHA-256 con una herramienta autorizada. Registrar ese valor en `media.sha256` y en todos los registros que se refieren al final. No usar nombre de archivo como identidad.
2. Ejecutar el QA técnico existente sobre ese MP4 y conservar su JSON completo en `video.report`. Esta versión valida exclusivamente el perfil ya existente de 1080×1920, H.264, 30 fps y 15 segundos. El reporte debe declarar `marketing_ready: false`; conservar los `marketing_blockers` originales completos. El generador existente incluye cuatro bloqueos de producción por defecto; documentar su resolución real con el procedimiento siguiente, sin borrar motivos ni fingir que el QA técnico los revisó.
3. Medir un WAV PCM mono/estéreo decodificado del **audio del mismo archivo final**, mediante `skills/audio-production/scripts/audio_qa.py`, y conservar el JSON en `audio.report`. El helper incluye `source.sha256` y `source.size_bytes` del WAV completo, incluidos chunks no usados por el medidor; copiar ese hash a `audio.source_sha256`. El agregado rechaza una identidad presente malformada o contradictoria, incluso con digests de informes recalculados. Los informes antiguos sin `source` conservan el procedimiento de hash y atestación manual explícitos; no se les atribuye identidad medida automáticamente. Un stem anterior al montaje o a la codificación no acredita el audio final. El helper WAV no certifica LUFS ni true peak.
4. Documentar la relación WAV/final en `audio.relationship`, con `kind: DECODED_FINAL_AUDIO`, `verified: true`, hashes de ambos archivos, revisor y referencia a la evidencia de extracción. Una atestación revocada (`revoked: true`) bloquea. Esta herramienta no ejecuta esa extracción ni verifica su autenticidad.
5. Calcular cada digest del informe mediante `node scripts/production-qa.mjs --digest-report out/qa-master.json` y el equivalente para el JSON de audio. El algoritmo es SHA-256 de `JSON.stringify(JSON.parse(texto))`; el orden de propiedades forma parte del digest. Conservar ese orden al copiar los objetos al bundle. Registrar valores en `video.report_sha256` y `audio.report_sha256`.
6. Registrar por separado escucha del final codificado, sincronización, inteligibilidad, revisión visual y derechos en `reviews.listening`, `synchronization`, `intelligibility`, `visual` y `rights`. Cada registro necesita `status: PASS`, `reviewer`, `evidence`, `media_sha256`, `video_report_sha256` y `audio_report_sha256`. Una transcripción o una medición no reemplazan escuchar. La revisión de derechos debe cubrir producto, afirmaciones, voz, música y elementos visuales. No poner PASS sin revisión real.

Cada evidencia puede referenciar un informe local privado o identificador de artefacto que el revisor pueda comprobar; no publicar material, identidades privadas ni credenciales en el repositorio. Los hashes identifican datos, no demuestran por sí solos procedencia o derechos. El informe de video y los informes antiguos de audio no incorporan identidad medida de fuente; este bundle sigue exigiendo una **atestación explícita** que los vincule. Tampoco el nuevo hash WAV autentica al productor o demuestra la extracción desde el MP4. La herramienta valida la coherencia de las declaraciones y métricas; no autentica al firmante ni verifica que el contenido referenciado exista.

Mantener el WAV bajo control del propietario y sin ediciones durante el análisis. El helper calcula SHA-256 en bloques, sin escribir archivos ni exponer rutas en el informe, y compara tamaño/fechas del descriptor abierto para rechazar cambios comunes incluso del mismo tamaño. No bloquea escritores, no crea un snapshot atómico ni garantiza detectar una modificación hostil concurrente. Un hash nuevo cambia el digest del informe y exige revisiones actuales; no reutilizar registros anteriores.

## Resolver bloqueos sin borrar el historial

Cada motivo original necesita exactamente un registro en `blocker_resolutions`, que contiene:

```json
{
  "blocker": "Texto exacto de un marketing_blocker original",
  "status": "RESOLVED",
  "action": "VERIFIED_CURRENT_MEDIA",
  "revoked": false,
  "reviewer": "Revisor que comprobó la corrección",
  "evidence": "Referencia verificable del cambio y su revisión",
  "resolution": "Qué causa se corrigió y cómo se comprobó en este final",
  "media_sha256": "SHA256_DEL_FINAL_ACTUAL",
  "video_report_sha256": "DIGEST_DEL_INFORME_VIDEO_ACTUAL",
  "audio_report_sha256": "DIGEST_DEL_INFORME_AUDIO_ACTUAL"
}
```

`RESOLVED` significa que la causa fue corregida o que el revisor verificó con evidencia que el motivo genérico no aplica al medio actual. No existe acción de renuncia o aceptación de riesgo. Por ejemplo, una pieza que todavía muestra “VISUAL CONCEPTUAL” no se convierte en producto real por escribir RESOLVED: debe corregirse el material y repetirse su revisión, con nuevos hashes y digests. Los derechos faltantes exigen procedencia/licencias reales; una explicación no los concede. El código no puede comprobar esas afirmaciones: registra declaraciones para revisión humana, sin certificar su autenticidad.

Un registro ausente, duplicado, desconocido, revocado, fallido o asociado a otro medio/informe conserva `BLOCKED`. La salida conserva `original_video_blockers`, resume los registros aplicados en `applied_blocker_resolutions` y enumera causas pendientes en `pending_video_blockers`. Las cinco revisiones manuales siguen siendo obligatorias aunque estén documentadas todas las resoluciones. No reescribir los informes originales para evitar este control.

## Estados y límites

- `BLOCKED`: falta evidencia, existe un fallo, hay identidades/digests distintos, un informe es inválido o persiste un bloqueo. Se imprimen motivos; el proceso sale con código 2.
- `READY_FOR_CLIENT_REVIEW`: controles técnicos y cinco revisiones previas completos según la evidencia suministrada. Todavía falta la decisión del cliente. La herramienta **nunca** emite `APPROVED` ni autoriza publicación.
- `client_signoff`: `PENDING_OR_INVALID` cuando no se ha suministrado aprobación; `RECORDED_NOT_AUTHENTICATED` cuando el registro suministrado pasa la misma comprobación que las otras revisiones. Si se suministra un registro incompleto, rechazado, revocado o asociado a otros hashes, el bundle queda bloqueado. No es necesario fingir aprobación para poder solicitar revisión del cliente.
- `publication_authorized` siempre es `false`. Incluso con una aprobación registrada, cualquier publicación requiere autorización y comprobaciones propias del canal y encargo.

Las muestras a escala completa y el riesgo de cancelación mono bloquean para revisión, sin afirmar clipping audible ni invalidez estética automática. Un cambio de informe exige nuevos digests y revisiones; un cambio del medio final exige recalcular todos los vínculos. Cambiar un `PASS` en el JSON no equivale a efectuar la revisión.

El comando solo lee JSON de hasta 1 MiB dentro de la carpeta actual; rechaza traversal y enlaces simbólicos/junctions usando el validador local compartido. No escribe archivos. El directorio debe estar controlado por su propietario durante la lectura; no es un servicio para entradas hostiles concurrentes. Código de salida 1 indica entrada/comando ilegible o inválido; 0 indica evidencia lista para revisión del cliente, nunca lanzamiento aprobado.

Pruebas sintéticas: `node --test scripts/production-qa.test.mjs`. No contienen medios de clientes ni demuestran escucha perceptual. [Plantilla incompleta y bloqueada](../../examples/production-review.json).
