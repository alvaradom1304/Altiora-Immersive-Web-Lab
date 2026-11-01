# El Tilichero: sistema de captación de 30 días

**Estado: DISEÑADO.** Fecha: 2026-11-01. Autor: `claude/commerce-growth-director`. QA: aceptado con correcciones (aplicadas en esta versión). Pendiente: Estrategia + `growth-analyst`.
Nada de esto está publicado, pautado, enviado ni probado con clientes. Este documento no prueba que haya llegado ni una consulta nueva.

**Qué resuelve.** Ordena en un solo sistema lo que ya existe: de dónde salen las consultas, cómo llegan a WhatsApp, cómo pasan a pedido y cómo se mide. Agrega lo que faltaba: prioridad entre canales, recorrido completo hasta la recompra y los referidos, el papel posible de Tecnogau, un plan de 30 días y metas que se fijan solo cuando haya baseline.

**Qué no rehace.** Se mantienen sin cambios:
- [`ads/PRODUCCION_CANONICA.md`](ads/PRODUCCION_CANONICA.md): guiones, códigos GAME1/GAME2/RETRO1/RGB1 y Prueba A.
- [`ads/CAPTACION_SEMANA_1.md`](ads/CAPTACION_SEMANA_1.md): textos por canal, mensajes de cierre, campaña Meta lista para aprobación y calendario de la semana 1.
- [`ads/kit-cliente/`](ads/kit-cliente/README.md): fichas y registro (`registro-tilichero.xlsx`).
- [`DIRECCION_DEL_PROYECTO.md`](DIRECCION_DEL_PROYECTO.md): Tecnogau es proveedor y espacio de exhibición, no anunciante.

Si algo de este documento contradice esas fuentes, mandan ellas, **con una excepción**: la activación de pauta. Semana 1 §11 prevé activar la campaña el día 1 y revisarla el día 4. Aquí rige la puerta de §2.2, que exige antes al menos una semana de registro orgánico, así que **esas filas de pauta de los días 1 y 4 quedan excluidas**. Este documento remite a los textos de las fuentes y no los copia.

**Proceso (M-8):** esta tarea se hizo sin entrada en el chat del equipo porque el encargo prohibía editar otros archivos. El coordinador debe registrarla allí (`npm run chat`) con este archivo como evidencia.

---

## 1. Diagnóstico del embudo actual

### 1.1 Datos observados

| Dato | Valor | Fuente y fecha |
|---|---|---|
| Seguidores en Instagram | 168 (sigue a 4 cuentas) | Auditoría pública, 2026-10-29 |
| Publicaciones visibles | 12: 11 imágenes de producto o empaque y 1 miniatura de video; predominan los empaques sobre fondo blanco | Ídem |
| Fechas de esas 12 | 9 del 29-oct y 3 del 15-oct | Ídem; `ads/evidence/instagram-public-2026-10-29.json` |
| Bio | Tono cercano, cobertura «GAM y alrededores», invita a pedir por WhatsApp | Ídem |
| Enlace a WhatsApp | `wa.me` llega a una página titulada El Tilichero. No se abrió conversación | Ídem |
| Puntuación de claridad pública | 13/18 en los criterios observables | Ídem; no mide conversión |
| Precio y condiciones en miniaturas | No visibles. Podrían estar en captions, que no se pudieron abrir | Ídem |
| Analítica privada (Metricool) | **NOT_RUN para El Tilichero.** `getBrandSettings` (2026-11-01) devolvió una sola marca, distinta de El Tilichero. Sin marca no se consultan métricas ni mejores horarios | Esta sesión |
| Insights, Facebook, TikTok, volumen de mensajes, ventas | Sin acceso. No se conocen | — |
| Datos comerciales (SKU, precio, stock, garantía, entrega, horario, responsable) | Pendientes. En el tablero no hay registro de que se hayan entregado | Tareas T1029-* cerradas el 2026-10-30 |

### 1.2 Embudo y estado de cada paso

```
Ve una pieza → entra al perfil → toca WhatsApp → escribe → se cualifica → recibe cotización → confirma pedido → paga → recibe → recomienda / vuelve
```

| Paso | Estado | Evidencia |
|---|---|---|
| Ve una pieza (alcance) | DESCONOCIDO | Sin Insights. 168 seguidores sugieren un alcance orgánico pequeño (hipótesis) |
| Perfil → WhatsApp | VERIFICADO hasta la página pública | Auditoría |
| Escribe → se cualifica | NO MEDIDO | El registro existe, pero sin datos |
| Cotización → pedido → pago | BLOQUEADO | No hay precio, stock ni entrega verificados para cotizar |
| Entrega → recomendación o recompra | NO DISEÑADO hasta este documento | — |

### 1.3 Huecos que frenan el flujo (en orden de bloqueo)

| ID | Hueco | Tipo | Efecto |
|---|---|---|---|
| H1 | No hay datos comerciales verificados (SKU, precio, stock, garantía, entrega) | Dato del negocio | Bloquea la cotización, Marketplace, grupos, catálogo, clips con precio y pauta. **Es el hueco raíz.** |
| H2 | No hay responsable de WhatsApp, horario ni tiempo de respuesta conocido | Operación | Más consultas sin atención se pierden. No se puede prometer horario ni pautar |
| H3 | Alcance bajo: pocas personas ven las piezas | Hipótesis | Aunque el perfil convierta, entra poco tráfico |
| H4 | No hay una razón visible para escribir hoy: precio, disponibilidad, entrega o prueba de uso | Hipótesis (auditoría) | Quien ve una caja no sabe si le sirve ni cuánto cuesta |
| H5 | No hay baseline: no se sabe cuántas consultas llegan ni de dónde | Medición | Cualquier meta sería inventada |
| H6 | Facebook, TikTok y la analítica privada no están auditados. Metricool no tiene la marca | Acceso | El diagnóstico se basa solo en Instagram público |
| H7 | No hay un paso posventa (reseña, referido, recompra) | Diseño | Cada cliente se capta desde cero |

---

## 2. Canales priorizados

Coste = dinero nuevo que hay que sacar. El esfuerzo semanal es una **estimación** sacada del calendario de la semana 1 y se corrige con la semana real.

| Prioridad | Canal | Papel en el embudo | Por qué ahora | Coste | Esfuerzo semanal (estimado) | Depende de | Textos listos en |
|---|---|---|---|---|---|---|---|
| **P0** | **WhatsApp Business**: perfil, catálogo, respuestas rápidas, etiquetas y registro | Conversión. Todo canal termina aquí | Sin esto, más tráfico no se convierte en pedidos (H2) | ₡0 | Configuración 60 min una vez; atención y registro 2–3 min por consulta | H1 para cotizar; H2 responsable | Semana 1 §3.3–§4 |
| **P1** | **Perfil de Instagram**: bio, fijado «Cómo pedir», destacados | Convierte la visita en mensaje | Ya funciona hasta WhatsApp. Ajustarlo cuesta poco (H4) | ₡0 | 20–35 min | Fijado 2 y 3 dependen de H1 | Semana 1 §5 |
| **P1** | **Clips demo de 10–15 s** en Reels, TikTok y Facebook (página) | Alcance + razón para escribir | Es la hipótesis principal de la auditoría: demo real frente a caja (H3, H4). Un mismo clip sirve en tres redes | ₡0 (celular) | 30–45 min por clip; 3–5 por semana | Producto en stock con atributos verificados | Semana 1 §9 |
| **P1** | **Facebook Marketplace** | Alcance de gente con intención de compra local | La gente que busca ahí ya quiere comprar. No depende de seguidores | ₡0 | 15–20 min por publicación | H1 completo y `[WHATSAPP OFICIAL]` | Semana 1 §6 |
| **P2** | **Grupos de Facebook** (3–5, compraventa o gaming de CR) | Alcance segmentado | Barato. Exige respetar las reglas de cada grupo | ₡0 | 30 min para elegir; 10 min por publicación | H1 y reglas del grupo | Semana 1 §7 |
| **P2** | **Estados y difusión de WhatsApp** | Reactiva a quien ya tiene el número | Solo llega a contactos guardados, no a gente nueva. Útil para recompra | ₡0 | 5 min al día | Contactos que aceptaron recibir mensajes | Semana 1 §8 |
| **P2** | **Referidos y reseñas posventa** (§3.4) | Convierte clientes en canal | Ataca H7. Las recomendaciones ya figuran como canal en el registro | ₡0 sin incentivo. Un incentivo lo define el negocio con su margen | 2 min por cliente entregado (estimación propia) | Al menos un pedido cobrado y entregado | Este documento §3.4 |
| **P3** | **Alianza con Tecnogau** como punto físico (§2.1) | Alcance local + confianza (ver el producto) | Ya existe la relación de proveedor y exhibición. Puede dar algo que el canal digital no da | ₡0 a bajo (impresión de una tarjeta o QR) | 1–2 h para acordar; después ~0 (estimación propia) | Permiso escrito de Tecnogau y definir qué se puede hacer ahí | Este documento §2.1 |
| **OPCIÓN** | **Meta clic a WhatsApp** (pauta) | Alcance pagado con destino WhatsApp | Acelera el alcance (H3) cuando la conversión ya funciona | **Importe a aprobar por el dueño.** Escenarios documentados y NO APROBADOS: ₡3.000/día = ₡21.000 en 7 días; ₡5.000/día = ₡35.000 en 7 días. Son costos, no previsiones | 45–60 min para configurar; 20 min de revisión a las 72 h | Ver la puerta de §2.2 | Semana 1 §10 |
| No priorizado | Google Business Profile, web propia, automatización o chatbot | — | No hay ubicación pública verificada ni una fricción que lo justifique. La dirección del proyecto los reserva para cuando resuelvan una fricción real | — | — | Reabrir si el registro muestra esa fricción | — |

**Lógica del orden.** Primero se arregla la conversión (P0–P1 de perfil), después el alcance gratuito con intención (clips, Marketplace, grupos), luego lo que multiplica a los clientes que ya existen (referidos, estados) y la pauta queda al final. Pautar antes de poder cotizar o atender es pagar por consultas que se pierden.

### 2.1 Tecnogau: qué se puede proponer y qué no

Tecnogau es **proveedor y espacio de exhibición, no anunciante** (DIRECCION_DEL_PROYECTO). Rige la regla de Semana 1 §13: **«Tecnogau no aparece»** en piezas, captions ni anuncios. La alianza no lo promociona ni usa su marca.

**SUPUESTO, a confirmar por el dueño:** que en el espacio de Tecnogau se exhiben productos **de El Tilichero** y no solo productos del proveedor. Las propuestas 1 y 2 y el mensaje D (§3.2) dependen de ese supuesto. Si no se cumple, se descartan.

Propuestas para que **el dueño** negocie con Tecnogau (Altiora no lo contacta; ninguna está acordada):
1. **Tarjeta o QR de El Tilichero** junto a sus productos exhibidos, con «Consultá precio y entrega por WhatsApp» → registro: canal «Otro», nota «TECNOGAU».
2. **Punto de retiro o de prueba** del producto, si Tecnogau lo permite: baja la objeción de confianza. Se ofrece solo si está acordado por escrito. El nombre o el teléfono del cliente se pasa a Tecnogau **solo con su consentimiento expreso** para ese fin (ver §3.5).
3. **Grabar clips en el espacio** con permiso escrito y sin rótulos de Tecnogau en cuadro (regla ya escrita en el canónico, checklist de rodaje).

**Riesgo de conflicto de canal:** el cliente que ve el producto en el espacio de un proveedor puede comprarle directo a ese proveedor. Antes de invertir esfuerzo, el dueño confirma por escrito qué permite Tecnogau, si hay comisión, exclusividad o precio de reventa acordado, y quién atiende al cliente en el lugar. **Pendiente del negocio.** Si la relación no lo permite, el canal se descarta sin afectar al resto.

### 2.2 Puerta para activar la pauta (las cinco condiciones a la vez)

1. Al menos 2 productos con ficha verificada (precio, stock, entrega, garantía), **distintos del SKU de audífonos de la Prueba A**.
2. Un responsable de WhatsApp con horario y tiempo de respuesta medido en la semana orgánica (columna «Minutos hasta la primera respuesta»).
3. Al menos una semana de registro orgánico (baseline).
4. Costo unitario o margen conocido, para calcular el **costo máximo aceptable por pedido** = contribución por pedido antes de pauta.
5. Importe diario y total aprobados por escrito por el dueño, que es quien publica.

Si falta una, la pauta no se activa y el plan sigue con los canales orgánicos. Además, la pauta **no arranca** entre la publicación de GAME1 y el cierre de la ventana de 72 h de GAME2 (ver §4, semana 3).

---

## 3. Recorrido en WhatsApp: consulta → cotización → pedido → recompra

Los mensajes de bienvenida, origen, cualificación, cotización, confirmación, pago, entrega, seguimiento único y objeciones **ya están** en Semana 1 §4 y canónico §5. Se usan tal cual. Aquí van el mapa completo y solo los mensajes que faltaban.

### 3.1 Mapa de estados

| Estado (etiqueta de WhatsApp Business) | Entra cuando | Siguiente acción | Columna del registro | Texto |
|---|---|---|---|---|
| Nuevo | Primer mensaje | Bienvenida; pedir código o publicación una sola vez | Nueva fila: canal, código | Semana 1 §4 |
| Cualificada | Dijo producto o necesidad **y** zona | Cotizar con el total | Cualificada = Sí; producto; zona | Semana 1 §4 |
| No disponible | Pide algo que no hay en stock | Mensaje 3.2-A; anotar la demanda | Objeción = Stock; nota «NO HAY: [producto]» | Nuevo, §3.2 |
| Avisar si entra | Aceptó de forma expresa el aviso de A (con A2 enviado) | Avisar una sola vez cuando entre el producto; después se quita la etiqueta | Nota «AVISAR SI ENTRA: [producto]» | Nuevo, §3.2 |
| Cotizada | Recibió precio final con envío | Esperar; un único seguimiento al día siguiente | Cotizada = Sí | Semana 1 §4 |
| Pedido confirmado | Dijo que lo compra | Datos de entrega (fuera del registro) e instrucciones de pago | Pedido confirmado = Sí | Semana 1 §4 |
| Cobrado | El pago aparece en la cuenta | Coordinar la entrega | Cobrado = Sí y monto | Semana 1 §4 |
| Entregado | Se entregó | Mensaje 3.2-B a las 24–72 h | Nota «ENTREGADO» | Nuevo, §3.2 |
| Acepta novedades | Aceptó avisos de forma expresa | Difusión según la frecuencia que fije el dueño | — | Semana 1 §8 |
| No compró | Dijo que no, o no respondió al único seguimiento | Anotar la objeción | Objeción principal | — |
| No escribir más | Pidió que no le escriban | No volver a escribir | Nota «no contactar» | — |
| Reclamo o garantía | Problema con el producto | Pasa a una persona responsable, no a respuestas rápidas | Nota «RECLAMO» | Nuevo, §3.2 |

**Tiempo de respuesta.** No se promete un tiempo. En la semana 1 se mide con la columna de minutos. El dueño fija un objetivo interno según su capacidad real y solo después se puede publicar un horario o un plazo.

### 3.2 Mensajes que faltaban (español costarricense, para respuestas rápidas)

Reglas: se trata de vos, con frases cortas y en primera persona del plural («te escribimos», «te avisamos»). «Pura vida» o «tuanis» una vez como mucho, no en todos los mensajes. Los marcadores entre corchetes se llenan desde la ficha verificada y **un texto con marcadores vacíos no se envía**.

**A. No tenemos ese producto** (`/nohay`)
```text
Uy, ese ahorita no lo tenemos. ¿Querés que te avisemos si vuelve a entrar? Mientras, te pasamos opciones parecidas que sí hay.
```
Si dice que sí, se envía el aviso A2 antes de etiquetar:
```text
Listo. Usamos tu número solo para avisarte de ese producto, una vez, y no lo compartimos con nadie. Si en cualquier momento no querés más mensajes, respondé BAJA.
```
Etiqueta y nota «AVISAR SI ENTRA: [producto]».

**B. Después de la entrega: cómo le fue y permiso para pedir reseña** (`/postventa`, una sola vez, 24–72 h después)
```text
¡Hola! ¿Cómo te ha ido con [PRODUCTO]? Si algo no está funcionando bien, decinos y lo vemos. Y si te gustó, nos ayudaría mucho que dejaras un comentario en nuestro Instagram @el.tilichero.cr o que nos recomendés con alguien que ande buscando algo parecido.
```
Si responde con un problema → estado «Reclamo o garantía». Una reseña solo se puede mostrar en público con el permiso expreso del cliente, sin editarla y sin su número ni foto si no lo autoriza.

**C. Pedido de referido** (`/recomenda`, solo a quien respondió bien a B)
```text
¡Qué dicha que te gustó! Si tenés un amigo que ande buscando algo de gaming o tecnología, pasale este número y que diga que va de tu parte. Así sabemos que vino por vos.
```
[PENDIENTE DEL NEGOCIO: si se ofrece algo a cambio. Solo se menciona si el dueño lo define con su margen. Sin incentivo, el mensaje sirve igual.] Registro: el nuevo contacto entra con canal «Recomendación» y la nota «REF». Nunca se anota en el registro quién recomendó. Si hay incentivo y hace falta saber a quién dárselo, eso se anota **solo dentro de WhatsApp** (etiqueta o nota del chat), con el consentimiento de quien recomendó, y se borra al entregar el incentivo.

**D. Entrada desde el punto físico** (`/tienda`, solo si se acuerda lo de §2.1 y se confirma el SUPUESTO de que ahí se exhiben productos de El Tilichero)
```text
¡Pura vida! Gracias por escribir. ¿Viste el producto en exhibición? Decinos cuál te interesó y en qué zona lo recibirías, y te pasamos precio final, disponibilidad y entrega.
```
Registro: canal «Otro», nota «TECNOGAU».

**E. Reclamo o garantía** (`/reclamo`)
```text
Gracias por avisar, ya lo revisamos. ¿Nos mandás una foto o un video corto de lo que está pasando? [GARANTÍA: plazo, quién la da y cómo se hace válida]. Te escribimos hoy mismo [solo si el horario real lo permite].
```
Se usa solo con la garantía verificada. Si no lo está: «Te confirmamos cómo funciona la garantía y te escribimos».

**F0. Permiso para novedades** (sustituye al texto de permiso de Semana 1 §8, que no indicaba la finalidad ni si los datos se comparten)
```text
¿Querés que te avisemos por aquí cuando entren productos nuevos? Usamos tu número solo para eso, no lo compartimos con nadie, te escribimos como máximo [FRECUENCIA: la decide el dueño] y para dejar de recibirlos basta con responder BAJA.
```
Etiqueta «Acepta novedades» solo si responde que sí.

**F. Recompra a quien aceptó novedades** (como mucho con la frecuencia que fije el dueño)
```text
Hola, te escribimos porque nos dijiste que te avisáramos. Entró [PRODUCTO] [MODELO] a ₡[PRECIO], compatible con [COMPATIBILIDAD PROBADA]. Si te interesa, respondé con tu zona. Si ya no querés estos mensajes, respondé BAJA.
```

### 3.3 Registro mínimo

Se usa la hoja «Consultas» de `ads/kit-cliente/registro-tilichero.xlsx`, sin columnas nuevas. Columnas que existen y son el mínimo: N.º de consulta, fecha, canal de origen, código de pieza, producto consultado, zona (GAM / Fuera de GAM / No dijo), ¿consulta repetida?, cualificada, cotizada, pedido confirmado, cobrado, monto cobrado (₡), minutos hasta la primera respuesta, objeción principal y nota breve sin datos personales.

Convenciones nuevas, todas dentro de la nota y sin columnas extra: `NO HAY: [producto]` (demanda no atendida, que alimenta la elección de productos), `AVISAR SI ENTRA: [producto]`, `REF`, `TECNOGAU`, `ENTREGADO`, `RECLAMO`, `DEVOLUCIÓN` y `no contactar`.
**Petición a `growth-analyst`** (dueño del kit): valorar si `NO HAY`, `REF` y `TECNOGAU` merecen un conteo en «Resumen». No se edita el kit desde esta tarea.

Nunca van al registro nombres, teléfonos, direcciones, capturas ni datos de pago.

### 3.4 Lazo de referidos y reseñas

Cliente cobrado → entregado → B (cómo le fue) → si respondió bien: C (referido) y, con su permiso, reseña pública → el nuevo contacto llega como «Recomendación / REF».
Mide: referidos por cada 10 pedidos entregados, solo con al menos 10 entregados. Si hay menos, se informan los números absolutos.
Límites: nada de reseñas inventadas o pagadas sin declararlo, ni de mensajes a terceros que el cliente no presentó.

### 3.5 Datos personales (Ley 8968 de Costa Rica)

- **Finalidad, terceros y baja:** todo pedido de permiso (A2, F0) dice para qué se usa el número, que no se comparte con terceros y que se sale respondiendo BAJA. Quien responde BAJA sale ese mismo día y pasa a «No escribir más».
- **Datos de entrega** (nombre de quien recibe, punto de entrega, teléfono): los guarda **solo la persona responsable de WhatsApp, dentro del chat de WhatsApp Business**, nunca en el registro ni en archivos de Altiora. Se borran o archivan en un plazo **[PENDIENTE DEL NEGOCIO; propuesta: al vencer la garantía o el plazo de devolución]**. Altiora no recibe esos datos.
- **Tecnogau como punto de retiro:** el nombre o el teléfono del cliente se le pasa a Tecnogau solo si el cliente lo acepta de forma expresa en el chat («¿Nos autorizás a pasarle tu nombre a [punto de retiro] solo para entregarte el pedido?»).
- **PENDIENTE DE REVISIÓN LEGAL:** si la lista de contactos con permiso o los datos de entrega forman una base que deba inscribirse ante la PRODHAB. Este documento no lo resuelve; el dueño lo consulta con asesoría legal antes de hacer crecer las listas de difusión.

---

## 4. Plan de 30 días

**El día 1 es el día en que el negocio entrega los datos mínimos** (solicitud de Semana 1 §3.1, que pide de 5 a 10 productos): por lo menos 2 productos con ficha **distintos del SKU de la Prueba A**, el WhatsApp oficial, el responsable y el horario. No se fijan fechas de calendario sobre datos que no existen. Mientras tanto corre la **Semana 0**, que no depende del negocio.

| Semana | Objetivo | Acciones | Responsable | Entregable verificable | Puerta para pasar |
|---|---|---|---|---|---|
| **0** (ya, sin datos) | Dejar todo listo para arrancar | El usuario o coordinador de Altiora entrega al dueño la solicitud de Semana 1 §3.1 por el canal habitual con el cliente; Altiora no escribe a compradores. El dueño responde. Abrir el registro. Cargar los mensajes de §3.2 como respuestas rápidas preparadas. El dueño, si quiere, negocia con Tecnogau lo de §2.1. **Opcional:** conectar la marca El Tilichero en Metricool para lectura, solo con autorización del dueño y comprobando antes que el plan de Metricool admite otra marca | Coordinador de Altiora: entregar la solicitud. Negocio: responder, configurar WhatsApp, negociar con Tecnogau y, si lo autoriza, conectar Metricool con su sesión. Altiora: revisar textos y verificar la conexión si existe | Solicitud entregada; registro abierto; WhatsApp configurado con etiquetas; si se conectó Metricool, marca visible en `getBrandSettings` | Datos mínimos recibidos → día 1 |
| **1** (días 1–7) | **Baseline real** y primeras consultas cualificadas | Ejecutar el calendario de Semana 1 §11 (bio y fijado, estados, Marketplace, 3–5 grupos, 3–5 clips, seguimiento único) **excepto las filas de pauta de los días 1 y 4, que quedan excluidas porque prevalece §2.2**. Medir los minutos de respuesta | Negocio: publicar, atender, registrar. Altiora: revisar textos antes de publicar | Registro con 7 días de filas y «Resumen» lleno; lista de objeciones | Resumen del día 7 recibido |
| **2** (días 8–14) | Quitar la fricción que mostró la semana 1 y fijar metas | Revisión del día 7 (Semana 1 §12). Por canal: seguir, ajustar una sola cosa o dejarlo. **Fijar las metas del mes con B₁ según §5.3.** Convertir las 2–3 objeciones más repetidas en fijados, destacados y respuestas rápidas. Activar el lazo posventa (§3.4) con los primeros entregados. Si hay SKU de audífonos verificado: rodaje de GAME1/GAME2 según el canónico | Altiora: informe, propuesta de metas y ajustes de texto. Negocio: aprobar metas, aplicar cambios, entregar, mandar B y C, grabar | Informe de la semana 1 con decisiones por canal; **metas aprobadas por escrito por el dueño**; respuestas rápidas actualizadas; primer «REF» posible | Metas aprobadas, ajustes publicados y registro al día |
| **3** (días 15–21) | Prueba A limpia y decisión de pauta | Publicar GAME1 y GAME2 si están listos, según el canónico §7 (GAME1 el día 1 de la prueba, GAME2 el día 4, ventanas de 72 h) y sin contaminar su SKU (Semana 1 §9). **Desde la publicación de GAME1 hasta el cierre de las 72 h de GAME2: no se arranca pauta ni se sube el volumen de ningún canal.** El ritmo de publicaciones se mantiene igual en las dos ventanas (DEC-01). Si la Prueba A no corre esta semana, se amplía el volumen solo en los canales con consultas cualificadas (no por alcance). Evaluar la puerta de §2.2: si se cumple, el dueño decide el importe y activa la campaña de Semana 1 §10 por 7 días, **después** de cerrar las ventanas de la prueba | Negocio: publicar, decidir y activar la pauta. Altiora: revisión de 72 h si se le pide | Decisión de pauta por escrito (sí con importe y fecha posterior a la prueba, o no con motivo). Piezas de la Prueba A con fecha y alcance anotados | Registro continuo; ventanas de la prueba sin cambios de ritmo; pauta activa o descartada con razón |
| **4** (días 22–30) | Informe de 30 días y plan del mes 2 | Informe por canal y por pieza: consultas únicas, cualificadas, cotizadas, pedidos, cobrados, objeciones, NO HAY, REF y minutos de respuesta. Con pauta: costo por cualificada y por pedido frente al costo máximo aceptable. Fichas de producto según demanda (NO HAY + consultas por producto) con `product-winner-scorecard`. Fijar metas del mes 2 según §5.3 | Altiora: informe y propuesta. Negocio: datos de costo y margen, y aprobación | Informe de 30 días con evidencia; metas del mes 2 aprobadas o justificadamente pendientes | Revisión de Estrategia + growth-analyst + QA |

**Capacidad.** Si en cualquier semana la atención no da abasto (minutos de respuesta en aumento o consultas sin responder), se frena la captación y no se agregan canales hasta resolverlo.

---

## 5. Métricas, baseline y metas

### 5.1 Qué medir, cómo y dónde

| Métrica | Definición | Fuente | Frecuencia |
|---|---|---|---|
| Consultas únicas | Conversaciones nuevas sin repetidas | Registro | Diaria; corte semanal |
| Consultas cualificadas | Producto o necesidad **y** zona | Registro | Semanal |
| Tasa de cualificación | Cualificadas / únicas | Registro | Semanal |
| Cotizaciones | Precio final con envío enviado | Registro | Semanal |
| Pedidos confirmados y cobrados | Por separado. Un comprobante no es un cobro | Registro | Semanal |
| Cierre | Cobrados / cualificadas | Registro | Semanal |
| Ingresos cobrados (₡) | Suma de cobrados. No es ganancia | Registro | Semanal |
| Contribución por pedido | Precio − costo − envío subsidiado − comisiones (− pauta si la hay) | Ficha (costo confidencial) + registro | Al cerrar el mes |
| Minutos hasta la primera respuesta | Promedio y peor caso de las filas anotadas | Registro | Semanal |
| Consultas por canal y por código | Embudo por canal / por código | «Resumen» | Semanal |
| Demanda no atendida | Conteo de notas `NO HAY` por producto | Registro | Semanal |
| Referidos | Filas «Recomendación» con nota `REF` | Registro | Mensual |
| Alcance por pieza | Cuentas alcanzadas, no reproducciones | Insights; Metricool cuando esté conectado | Al cierre de cada ventana |
| Pauta (si existe) | Importe gastado, conversaciones iniciadas, costo por cualificada y por pedido | Ads Manager + registro (la inversión se anota en un solo lugar) | 72 h y 7 días |

Reglas que ya están en el kit y se mantienen: con denominador 0 o vacío la tasa es **NO CALCULABLE** (no 0 %). Las consultas absolutas pueden reflejar el alcance y no la calidad. Con pocas consultas no hay canal ni pieza ganadora. Vistas y seguidores no se toman como ventas.

**Metricool, cuando la marca esté conectada:** leer en solo lectura el alcance y las visitas al perfil de Instagram y Facebook y las vistas de TikTok, más los mejores horarios propios (`getBestTimeToPostByNetwork`). Los ID de métricas se confirman con `getAnalyticsAvailableMetrics` en ese momento; no se dan por sabidos aquí. Los mejores horarios propios sustituyen a cualquier recomendación genérica.

### 5.2 Baseline

- **Declarado:** lo que el dueño estime en la solicitud (punto 1). Se anota aparte como referencia y **no se compara** con lo medido.
- **Medido:** semana 1 del registro = baseline B₁ (consultas únicas, cualificadas, cobrados y minutos de respuesta). Ojo: B₁ mide la **semana 1 del plan, ya con intervención** (bio nueva, Marketplace, clips), no el estado previo sin cambios. Por eso la comparación entre la semana 1 y la semana 4 es **descriptiva y no causal** (DEC-04): cambian a la vez canales, días y alcance.
- Si la semana 1 se corta (datos tardíos, sin atención algunos días), se extiende la medición antes de fijar metas.

### 5.3 Metas condicionadas al baseline (sin cifras inventadas)

Las metas del mes se fijan en la **semana 2**, con B₁ en la mano, con estas reglas:

1. **Meta de volumen** = consultas cualificadas por semana en la semana 4 ≥ B₁ × (1 + g). El negocio y Altiora eligen g según la capacidad de atención. **Tope:** la meta nunca supera lo que el responsable puede atender sin que suban los minutos de respuesta.
2. **Si B₁ es muy pequeño** (criterio operativo propuesto: menos de 10 consultas únicas en la semana), los porcentajes engañan. Las metas pasan a ser de **ejecución y calidad**: cuántos clips, publicaciones y fichas completas se hicieron, el 100 % de las consultas registradas y un tiempo de respuesta dentro del objetivo interno. El volumen se informa en números absolutos.
3. **Meta de conversión:** el cierre (cobrados / cualificadas) se compara solo contra su propio B₁, y solo si en B₁ hubo cualificadas > 0. Si no, NO CALCULABLE y la meta es «tener los primeros N cobrados registrados», con N acordado.
4. **Meta de pauta (si se activa):** costo por pedido cobrado ≤ contribución por pedido antes de pauta. Sin costo unitario conocido, la pauta no tiene meta de rentabilidad y no se escala.
5. Ninguna meta se cambia después de ver los resultados. Si cambian las condiciones (stock, precio, atención), se anota y la comparación se marca como no válida.

---

## 6. Bloqueos del negocio y qué avanza sin ellos

| Dato o decisión | Quién | Qué bloquea | Qué se puede avanzar sin él |
|---|---|---|---|
| 5–10 SKUs (mínimo 2 distintos del SKU de la Prueba A) con modelo, estado, precio final, stock, garantía y compatibilidad | Dueño | Cotización, catálogo, Marketplace, grupos, clips con precio, fijado 3, pauta, GAME1/GAME2 | Bio, fijado «Cómo pedir», estado «¿Qué andás buscando?», bienvenida, origen, cualificación, `/nohay`, registro |
| Costo unitario o margen (confidencial) | Dueño | Contribución, puerta de pauta, metas de rentabilidad | Todo lo orgánico; métricas de volumen y cierre |
| Responsable de WhatsApp y horario | Dueño | Mensaje de ausencia, tiempo de respuesta, cualquier aumento de volumen, pauta | Configurar etiquetas y respuestas rápidas; medir minutos desde el día 1 |
| WhatsApp oficial confirmado (número o enlace) | Dueño | Marketplace, grupos, clips de TikTok sin enlace | Usar el enlace público de la bio ya verificado hasta la página de WhatsApp |
| Zonas, costo y plazo de entrega; métodos de pago | Dueño | Total en la cotización, fijado 2, objeción de envío | Cualificar por zona (GAM / Fuera de GAM) |
| Importe de pauta aprobado | Dueño | Campaña Meta | Plan completo en orgánico; la campaña queda lista para aprobación |
| Permiso escrito de Tecnogau y confirmación de que ahí se exhiben productos de El Tilichero (SUPUESTO) | Dueño, que negocia con Tecnogau | Canal físico (§2.1) y mensaje D | Todo lo demás; el canal es opcional |
| Plazo de borrado de los datos de entrega y revisión legal sobre la PRODHAB | Dueño con asesoría legal | Hacer crecer las listas de difusión y de avisos (§3.5) | Atender y cotizar sin guardar datos fuera de WhatsApp |
| Marca El Tilichero conectada en Metricool | Dueño (con su sesión) | Alcance y horarios propios en el informe | Leer el alcance a mano desde Insights (instrucciones del kit) |
| Enlaces de la página de Facebook y de TikTok | Dueño | Auditoría de esas redes; enlace en TikTok | Clips con CTA «WhatsApp: producto + zona» |
| Definir si hay incentivo por referido | Dueño | Mencionar un premio en C | Pedir el referido sin incentivo |

**Siguiente acción que desbloquea más:** que el dueño responda la solicitud de Semana 1 §3.1 (7 puntos) y confirme el responsable de WhatsApp.

---

## 7. Criterio de aceptación de este sistema

- [x] Diagnóstico con datos observados, con fuente y fecha, y huecos priorizados (§1).
- [x] Canales con por qué, coste y esfuerzo; la pauta solo como opción con importe a aprobar y con puerta (§2).
- [x] Recorrido completo en WhatsApp, mensajes nuevos en español costarricense y registro mínimo sin columnas nuevas (§3).
- [x] 30 días por semana con responsable, entregable y puerta (§4).
- [x] Métricas, baseline y metas condicionadas sin cifras inventadas (§5).
- [x] Bloqueos del negocio y qué avanza sin ellos (§6).
- [x] Revisión independiente de `qa-reviewer` (2026-11-01): ACEPTAR CON CORRECCIONES. Correcciones I-1 a I-6 y M-1 a M-8 aplicadas en esta versión.
- [ ] Revisión de Estrategia + `growth-analyst` y nueva revisión de QA sobre las correcciones: **pendiente**.
- [ ] Validación del dueño (datos, Tecnogau, incentivo): **pendiente**.

**Estado por componente:** DISEÑADO: todo el documento. IMPLEMENTADO: nada. PROBADO: nada. PUBLICADO: nada.

## 8. Evidencia y límites

- Fuentes leídas el 2026-11-01: `DIRECCION_DEL_PROYECTO.md`, `DIRECCION_CREATIVA.md`, `ads/README.md`, `ads/CAMPANA_CAPTACION_2026-10-29.md`, `ads/CAMPANA_AUDIFONOS_2026-10-29.md`, `ads/AUDITORIA_INSTAGRAM_PUBLICO_2026-10-29.md`, `ads/CAPTACION_SEMANA_1.md`, `ads/kit-cliente/README.md`, encabezados de `registro-tilichero.xlsx` (solo lectura), estado de las tareas T1029-* en `team/chat/tasks/`.
- Metricool: `getBrandSettings` ejecutado en solo lectura; la marca El Tilichero no figura → analítica NOT_RUN. No se usó ninguna herramienta de creación, programación ni envío.
- Skills aplicadas (leídas, no ejecutadas como agentes): `whatsapp-lead-to-sale`, `organic-social-distribution`, `growth-experiment-analysis`; `referrals` como consulta para el lazo posventa. Casos de evaluación de las skills: NOT_RUN.
- No se abrió Instagram ni WhatsApp de nuevo, no se habló con el negocio ni con Tecnogau, no hubo gasto y no se publicó nada.
- Los esfuerzos semanales son estimaciones. El umbral de «menos de 10 consultas» es un criterio operativo propuesto y no un dato de mercado.
