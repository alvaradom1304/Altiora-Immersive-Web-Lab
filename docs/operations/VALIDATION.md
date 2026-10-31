# Evidencia de operación compartida

Fecha: 2026-10-31. Entrega: [PR 35](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/pull/35). Consultar allí el commit y CI actuales; este documento no es una consulta en vivo.

## Comprobaciones locales

- `npm run check`: catálogo, enlaces, auditoría estructural sin regresiones, adaptadores generados y 50 pruebas Node existentes aprobadas.
- `npm run operations:test`: 19 pruebas aprobadas, incluidos enlaces/junctions de Windows en ejecución autorizada fuera del entorno restringido. Comprueban configuración malformada, límites de lectura, rutas, audio ausente, métricas incoherentes, informes alterados, revisiones revocadas y resoluciones de bloqueos asociadas al medio final.
- `python -m unittest discover -s skills/altiora-bibliotecario/scripts -p "test_*.py"`: 16 pruebas aprobadas, sin omisiones en esa ejecución autorizada.
- `npm run routing:eval`: 14/14 casos redactados de recuperación top-5. Cuatro tareas se formularon sin nombrar la skill. Se corrigieron palabras vacías y el caso de redacción publicitaria en español; se ajustó contra esta misma suite, no es evaluación independiente ni prueba de generalización.
- `python -m unittest discover -s skills/audio-production/scripts -p test_audio_qa.py`: nueve pruebas aprobadas del medidor PCM existente.
- Copia personal del evaluador con `--root` apuntando al checkout: 14/14. Copias locales del Bibliotecario y tres entradas de instrucciones actualizadas con respaldo y hashes coincidentes; se conservaron los demás ajustes. Gemini/Antigravity comparten la entrada GEMINI.md. Esto no prueba descubrimiento por cada sesión.
- La captura JSON en Windows detectó codificación regional en la salida del evaluador. Se corrigió a UTF-8 y se añadió cobertura de caracteres españoles con un entorno CP1252 en la prueba del checkout aislado.
- Revisión independiente: detectó que el productor original mantenía siempre cuatro bloqueos; se incorporaron resoluciones individuales verificables sin eliminar los motivos originales. La corrección se volvió a revisar con el productor real en pruebas sintéticas. El agregador nunca autoriza publicación.

Los tests sintéticos no equivalen a escucha o revisión de un video de cliente. La plantilla incompleta permanece `BLOCKED` con salida 2; un registro inventado no acredita una revisión.

## Diagnóstico observado y límites

El diagnóstico respondió en esta máquina con FFmpeg, FFprobe, Git y Python disponibles. Blender y aerender no se detectaron con las rutas/consultas disponibles; eso no demuestra ausencia en todo el disco. Remotion no estaba instalado en el experimento local. La consulta de npm requiere atención a wrappers de Windows: no se ejecutan scripts `.cmd`/`.ps1` mediante shell como parte del diagnóstico.

Los adaptadores de proyecto estaban presentes. El TOML de Codex declara `enabled=false`; Gemini declara `trust=false`; la configuración local de Antigravity no estaba presente. Todas las conexiones permanecen `NOT_VERIFIED` y las pruebas de ejecución de clientes `NOT_PERFORMED`. No se modificaron cuentas, permisos MCP ni instalaciones.

No se ha producido un master comercial con materiales de cliente en este hito. Continúan pendientes material auténtico, derechos, escucha, revisión visual y decisión del cliente. El [permiso del Scout](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab/issues/31) requiere acción del propietario. Ahorro de tokens: `NOT_MEASURED`.
