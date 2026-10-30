# Altiora — Creative Variation Director (especialización de ai-video-direction)

**Activación:** «editá este video de forma distinta», «cada Reel me sale igual», «adaptate a la esencia del material», «no repitas plantillas», «director creativo autónomo». Este módulo es una **skill operativa anidada** dentro de `ai-video-direction`, ya descubierto por Claude Code, Antigravity y Codex. No necesita instalar otro paquete ni duplicar un superagente.

**Propósito:** que cada edición responda al contenido real, la marca, el público y el objetivo, en vez de aplicar siempre un preset de «cortes rápidos + captions + zooms». **Distinto no significa aleatorio:** priorizar comunicación y verdad del material sobre novedad superficial.

## Contrato de la dirección creativa
Responsable: `creative-ads-director`. Invocar este protocolo **antes del storyboard/timeline**. Para ejecución: `visual-producer` identifica tomas, `motion-designer` construye lenguaje de movimiento, `qa-reviewer` verifica diferencia real y calidad. El director decide; los especialistas no se simulan si el host no los inicia.

### Puerta 1: lectura de la esencia, sin editar todavía
1. Leer `00_BRIEF.md`, `02_REFERENCIAS/REFERENCIAS.md`, material autorizado de `01_CRUDOS` y campañas previas del **mismo cliente**. Si hay referencias visuales, describir qué mecanismo inspiran, sin copiarlas.
2. Visionar material real y registrar `file + in/out + observación verificable` en `04_EDITABLES/footage-notes.md`. `ffprobe` aporta datos técnicos, **no interpreta la escena**. No inventar acciones ni diálogos si no se pudieron ver/escuchar.
3. Construir una **huella editorial de esencia**: emoción dominante; energía real; momentos irrepetibles; tensión/conflicto; gestos y sonidos aprovechables; textura de imagen; puntos débiles; claridad del producto; marca, audiencia y objetivo. Indicar evidencia y desconocidos.
4. Anotar restricciones de identidad que se **mantienen constantes**: voz, autenticidad del producto, CTA, derechos, claims comprobables. La personalidad de marca no debe cambiar porque varía el montaje.

### Puerta 2: divergencia estructural (mínimo tres propuestas)
Diseñar **tres rutas originales de edición** adecuadas al material. NO etiquetar automáticamente «humor + premium + tráiler». Elegir libremente recursos como observación documental, demostración continua, pausa sensorial, narración invertida, comedia situada, POV, gesto humano, objeto como protagonista, historia fragmentada, comparativa verificable o diseño sonoro, **solo cuando el contenido lo sostenga**.

Cada ruta debe tener: nombre y tesis, hook real de los primeros segundos, audiencia y objetivo, emoción, microhistoria, piezas crudas concretas con timecodes, ritmo y duración, gramática de cámara/montaje, tratamiento de sonido, identidad tipográfica y motion graphics, cierre/CTA, riesgos y por qué **esta** ruta encaja mejor que una plantilla.

Contrastar las rutas en **ocho dimensiones semánticas**:
`hook, narrative, pacing, camera, motion, sound, typography, ending`.
Una propuesta realmente diferente cambia **al menos cuatro** de las ocho frente a cualquier otra finalista; cambiar solo color, canción o fuente NO cuenta. Las etiquetas deben describir la ejecución concreta, no usar nombres vacíos como «creativo» o «cinemático».

### Puerta 3: memoria de estilos sin exponer videos
Leer `media-workspaces/<cliente>/_creative-history.json` **si existe**, sin mezclar clientes. Por cada anuncio ya publicado/aprobado guardar únicamente campaña, fecha, `fingerprint` (las ocho dimensiones), resultado de QA y aprendizajes (nunca material privado ni claves).
Comparar cada propuesta con **las últimas cinco campañas**: el concepto elegido debe diferir al menos en **tres dimensiones** de cada ejecución previa; también debe ser distinto de los otros dos candidatos. Si no lo logra, rediseñar.
**Excepción**: si material limitado, consistencia de campaña o test A/B exige similitud, documentar `override_reason`, marcar `NEEDS_REVIEW` y pedir decisión editorial. No bloquear incoherentemente la continuidad de una serie.
No forzar tres versiones producidas: tres conceptos **evaluados** y uno o más renders según el brief.

### Puerta 4: elección por ajuste, no por azar
Puntuar cada ruta de 0 a 5 en ajuste al metraje, coherencia de marca, viabilidad y claridad del mensaje (ponderaciones 40/25/20/15). La originalidad opera como **control de similitud**; un concepto único pero incoherente NO gana.
Registrar selección explícita y por qué descartamos las otras rutas. Antes de renderizar crear `04_EDITABLES/creative-proposal.json` según el esquema documentado en `docs/video/CREATIVE_VARIATION.md`, auditar:
`npm run video:variation -- --proposal media-workspaces/<cliente>/<campaña>/04_EDITABLES/creative-proposal.json --history media-workspaces/<cliente>/_creative-history.json`.
El auditor es una barrera reproducible de **diversidad declarada**: no interpreta video, no prueba calidad artística y no reemplaza visión humana.

### Puerta 5: montaje y QA con evidencia
1. Storyboard/EDL usando clips y `in/out`, separando sonido real, música licenciada, SFX y motion. Usar FFmpeg/Remotion solo si están instalados y licenciados; consultar `references/postproduction-playbook.md`.
2. Revisar primer corte sin efectos: ¿la historia funciona? Después añadir motion **al servicio de la idea**, no como marca de fábrica.
3. Para el MP4 final revisar audio, legibilidad, duración, marca y claims; comprobar **diferencias observables** con campañas previas (ritmo, secuencia, timing, sonido, lenguaje visual), no solo el JSON. Si el corte converge a la vieja plantilla, reabrir dirección creativa.
4. Tras **render verificado y revisión humana**, actualizar historial local con `fingerprint`, `approved: true` y aprendizaje. No grabar una propuesta no realizada como ejecución previa.
5. Estados: `DESIGNED` (3 rutas), `AUDITED` (comprobación semántica declarada), `RENDERED` (MP4 real), `APPROVED` (QA visual). Nunca confundir estados.

## Especial para El Tilichero — earbuds
Puede que los crudos den pie a humor, demostración, microhistoria o presentación táctil. **No imponer automáticamente «¿Me escuchan?» ni la plantilla premium.** Si solo aparece una caja fija, una escena humorística actuada no está justificada: privilegiar montaje de producto, captions veraces, detalle y voz o nuevas tomas autorizadas. No afirmar autonomía, cancelación, marca Apple o compatibilidad sin evidencia.

## Fuentes externas: inspiración NO importada
- https://github.com/remotion-dev/skills — prácticas oficiales para ejecución programática, no decide la idea.
- https://github.com/Vincentwei1021/video-shotcraft — biblioteca de ejemplos de shots y movimiento (Apache-2.0); **riesgo de repetir recetas si se usa como selector automático**.
- https://github.com/salomonMuriel/media-production-skills — metodología de guion/dirección (MIT; proyecto emergente, no validado por Altiora).
No instalar/copiar sin `docs/security/third-party-skill-gate.md`; nunca descargar código de terceros solo para añadir variedad.
