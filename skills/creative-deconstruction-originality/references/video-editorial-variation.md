# Altiora Editorial Variance Engine — guía de creatividad no repetitiva (v1)
**Integrado en** `creative-deconstruction-originality` + `ai-video-direction`, dirigido por `creative-ads-director`; revisión independiente `qa-reviewer`.
**Cuándo se activa:** «edítame este video», «todos los edits se ven iguales», «haz un reel distinto», «cambia la esencia», campañas del mismo cliente o producto repetido.

## Diagnóstico de la repetición
Claude Code puede repetir soluciones cuando recibe el mismo prompt genérico, la misma plantilla Remotion, iguales parámetros de música, presets de títulos, transiciones, cierres o un brief sin contexto. **Ningún prompt garantiza originalidad; hay que diseñar, registrar y revisar los cambios.**
Primero identificar si las tomas originales contienen información nueva. Variar efectos no corrige material visual insuficiente.

## SOP obligatorio
1. **Observar, no imaginar:** inspeccionar `01_CRUDOS` usando medios disponibles. Listar evidencias de tomas reales (reacción, macro, diálogo, acción, foley, POV, demostración probada). Si no se ven los videos, dejar `verified_footage_tags=[]`; no deducir por filename.
2. **Entender la esencia:** definir marca, producto auténtico, objetivo comercial, audiencia, emoción, conflicto central, beneficio verificable y limitación técnica. Registrar quién participa y qué tiene derechos.
3. **Consultar historial:** leer `media-workspaces/<cliente>/editorial-history.json` (ARRAY de estilos finales aprobados); NO reinventar el historial en cada campaña. Si falta historial, declararlo, no prometer que el video difiere de trabajos anteriores que no se conocen.
4. **Crear tres tratamientos relevantes**, cuando el material lo permita, con distintos: gancho/estructura/ritmo/perspectiva/diseño sonoro/uso de tipografía. Elegir la ruta que mejor conecte con objetivo y emoción. No obligar un estilo inapropiado por buscar novedad.
5. **Presentar un storyboard de 6–10 beats con timecodes reales**, audio, plano, guion, ritmo y transición justificada. Registrar `editorial-treatments.json` en `04_EDITABLES`. Las referencias en `02_REFERENCIAS` se analizan, no se copian.
6. **Gate de diversidad antes de montaje:** comparar con historial las siete dimensiones `hook, story, rhythm, sound, typography, camera, transition`. Requiere cambiar **al menos cuatro**, incluyendo hook o estructura de historia. Cambiar solo música, color, subtítulos o transiciones NO es suficiente. `npm run video:variation -- check --proposal <archivo-json> --history <historial-json>`.
7. **Producción:** FFmpeg para base; Remotion o software permitido para motion graphics originales. No reutilizar un componente completo solo cambiando colores. Construir módulos distintos para cada tratamiento con parámetros verificables, no efectos aleatorios sin sentido.
8. **QA de originalidad (humano + técnico):** comparar primero 3 s y toda la secuencia con los últimos trabajos. Evaluar narrativa, emoción, claridad del producto, ritmo, repetición de presets, cortes y cierre. Al igual que el control estructural, un MP4 puede verse repetido pese a distintos metadatos: revisión visual obligatoria.
9. **Historial:** guardar en `editorial-history.json` solo tras verificación de render final y aprobación humana: `{client,campaign,export,approved_at,style:{...siete dimensiones},notes}`. No registrar conceptos no producidos como históricos. Nunca sobreescribir trabajos anteriores. No automatizar publicación, gasto ni upload.
10. **Aprendizaje:** recoger consultas, retención del video, CTR, WhatsApp y ventas **cuando los datos existan**. No declarar un formato ganador por intuición.

## Cómo preparar el archivo de entrada
Crear `media-workspaces/<cliente>/<campaña>/04_EDITABLES/creative-brief.json` con:
```json
{
  "brand": "El Tilichero",
  "product": "earbuds inalámbricos (marca no verificada)",
  "goal": "attention",
  "emotion": "playful",
  "product_claims_verified": [],
  "verified_footage_tags": [],
  "restrictions": ["no afirmar Apple ni cancelación de ruido sin evidencia"]
}
```
`verified_footage_tags` debe completarse **después de mirar los videos**, no inventarse. Valores posibles: `dialogue`, `reaction`, `macro`, `detail`, `lifestyle`, `action`, `foley`, `pov`, `tested-demo`.

```bash
npm run video:variation -- plan --brief media-workspaces/el-tilichero/earbuds/04_EDITABLES/creative-brief.json --history media-workspaces/el-tilichero/editorial-history.json --output media-workspaces/el-tilichero/earbuds/04_EDITABLES/editorial-treatments.json
```
Si no hay material que respalde 3 rutas, el resultado es `NEEDS_REVIEW` y exige ideas de tomas adicionales. `READY_FOR_CREATIVE_REVIEW` **NO** significa editado ni renderizado.

## Mecanismos distintos (ejemplos y uso condicionado)
| Ruta | Esencia | Material indispensable |
|---|---|---|
| Humor situacional | diálogo + pausa + remate | diálogo y/o reacción |
| Sensorial premium | foley, textura y lujo | macro, detalle |
| Problema cotidiano | necesidad real → solución visible | acción, lifestyle |
| Ritmo sonoro | edición impulsada por sonidos originales | foley, detalle |
| POV de descubrimiento | perspectiva subjetiva + curiosidad | POV, acción |
| Demostración factual | prueba visible de prestaciones | test real, registrado |
| Editorial silencioso | espacio negativo, composición visual | macro, detalle |

El director no debe sacar exactamente el mismo preset que el trabajo anterior por defecto. Si el objetivo comercial exige continuidad de marca, mantener logotipo, voz, paleta corporativa y mensajes verificados; **variar el lenguaje de montaje, no desfigurar la marca.**

## Ejemplo: El Tilichero
Un video de earbuds con diálogos y reacción puede funcionar como humor natural; si predominan macros con sonido de estuche puede funcionar como pieza sensorial. Un tercer video de uso real puede ser narrativo, siempre que se haya grabado ese uso. No inventar una demostración ANC/Bluetooth ni recrear diálogo sin avisar. Para productos repetidos en días diferentes, leer `editorial-history.json` del cliente para evitar reciclar el gancho.

## Límites de verificación
El script compara descripciones estructuradas **aportadas por el editor**; no analiza automáticamente similitud de fotogramas ni calidad de actuaciones. Un agente podría rellenar campos distintos sin alterar el video; por eso el QA visual contra material real es condición de aprobación. Estado sin videos/renders: NOT_RUN. Las técnicas y el formato son guías originales de Altiora; Remotion/FFmpeg son posibles implementadores, no la fuente de estos criterios.
