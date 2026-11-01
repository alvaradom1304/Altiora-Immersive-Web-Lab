# Fichas comerciales de los paquetes de Altiora — borrador

Fecha: 2026-11-01. Estado: **borrador para revisión del fundador**. Ninguna ficha se usa con clientes hasta resolver las [decisiones pendientes](#decisiones-pendientes-del-fundador).

Fuentes: [Paquetes (borrador)](../PAQUETES-BORRADOR.md), [Diferenciación](../DIFERENCIACION.md), [Plataforma de marca](../MARCA-ALTIORA.md) y [Oferta de US$10.000](../../altiora-business/OFERTA.md).

## Cómo leer estas fichas

- El alcance, la aceptación y las exclusiones vienen del borrador de paquetes. Esta ficha los ordena para una conversación de venta; no añade entregables.
- «Para quién es» y «problema que resuelve» son **hipótesis** tomadas de la audiencia prioritaria de [MARCA-ALTIORA.md §3](../MARCA-ALTIORA.md). Se validan en las conversaciones de descubrimiento.
- Altiora todavía no tiene caso publicado con métricas, cartera pública ni clientes de pago ([DIFERENCIACION.md §4](../DIFERENCIACION.md)). La Central del Queso es un piloto en desarrollo, no un caso con resultados.
- Las preguntas de diagnóstico sirven para comprobar el encaje antes de cotizar. No sustituyen el diagnóstico completo.

## Lo que ningún paquete promete

- Ventas, ingresos ni conversiones concretas.
- Posiciones o mejoras en buscadores.
- FPS ni tiempos de carga sin medirlos en el dispositivo del cliente.
- Resultados de otros clientes: no hay casos, cifras ni testimonios que mostrar todavía.

Lo que sí se promete es que **lo entregado se puede comprobar** con la prueba de aceptación de cada ficha ([MARCA-ALTIORA.md §2](../MARCA-ALTIORA.md)).

---

## Paquete 1 — Experiencia de marca con pedido

**Precio: por definir.**

### Para quién es

Pymes con producto propio y una historia de origen u oficio que venden por catálogo, redes o WhatsApp. Por ejemplo, alimentos artesanales, productores regionales o comercios especializados. Decide el dueño o la dueña, que tiene poco tiempo y desconfía de las promesas grandes. *(Hipótesis de audiencia.)*

### Problema que resuelve

Su web no transmite el valor del producto, o la versión «bonita» rompe el pedido. El paquete cuenta la historia de la marca sin perder lo que paga las cuentas: el pedido llega al canal de siempre y el catálogo funciona aunque falle la animación.

### Qué incluye

- Arquitectura de conversión.
- Una página de historia con una secuencia de scroll.
- Catálogo accesible en HTML.
- Formulario de pedido o enlace a WhatsApp.
- Versión estática de respaldo.
- Analítica acordada.

### Prueba de aceptación

- El pedido llega al canal acordado.
- El catálogo funciona sin WebGL y con teclado.
- La página respeta la preferencia de movimiento reducido.

### Exclusiones

Fotografía o video producidos por Altiora, dominio, hosting, licencias de terceros, proveedor de WhatsApp Business, migración de datos y traducciones.

### Tres preguntas para el diagnóstico

1. Cuéntame el último pedido que recibiste: ¿por qué canal llegó, qué datos te faltaron y cuánto tardaste en confirmarlo?
2. ¿Qué parte de la historia de tu producto crees que hoy no se ve en tu web o en tus redes, y qué fotos, videos o textos propios tienes para contarla?
3. Si la página nueva funcionara, ¿cómo lo notarías en tu día a día y qué dato podrías revisar para comprobarlo?

---

## Paquete 2 — Experiencia de producto 3D

**Precio: por definir.** El costo depende del modelo 3D disponible, así que requiere diagnóstico previo.

### Para quién es

Negocios del mismo perfil que el Paquete 1 cuyo producto necesita una vista detallada o una secuencia de producto y proceso para entenderse. *(Hipótesis de audiencia.)*

### Problema que resuelve

Hay productos que las fotos no explican bien: la forma, el detalle o el proceso. Una escena 3D limitada a un producto puede mostrarlos, siempre que la página siga cargando y que el texto y el pedido no dependan de ella. Si el 3D no aporta a la decisión de compra, conviene el Paquete 1.

### Qué incluye

- Todo el Paquete 1.
- Una escena 3D limitada a un producto.
- Carga progresiva.
- Presupuesto de rendimiento documentado.
- Alternativa estática.

### Prueba de aceptación

- La escena carga dentro del presupuesto acordado en el dispositivo de referencia.
- El contenido de texto sigue en HTML.
- Se mantienen las pruebas de aceptación del Paquete 1.

### Exclusiones

Las del Paquete 1, más: modelado o escaneo del producto si el cliente no lo entrega; licencias de modelos o texturas; campañas de medios.

### Tres preguntas para el diagnóstico

1. ¿Qué duda sobre tu producto te repiten los clientes antes de comprar y por qué una foto o un video no la resuelve?
2. ¿Tienes un modelo 3D, planos o un escaneo del producto, y quién tiene los derechos de ese material?
3. ¿Desde qué celulares y conexiones te compran tus clientes? Con eso definimos el dispositivo de referencia y el presupuesto de rendimiento.

---

## Paquete 3 — Automatización de captación

**Precio: por definir.** Depende de las integraciones y del volumen.

### Para quién es

Negocios que ya tienen web y reciben consultas, pero no las convierten en un seguimiento ordenado. *(Hipótesis de audiencia.)*

### Problema que resuelve

Las consultas llegan por varios lados, se duplican, se pierden o nadie las atiende a tiempo. El paquete lleva cada consulta de la web a un destino único, con validación, consentimiento y registro, para que una persona haga el seguimiento.

### Qué incluye

- Flujo Web → automatización → CRM o WhatsApp, con validación, consentimiento y registro mínimo.
- Plan de pruebas.
- Documentación de handover.

### Prueba de aceptación

- Una consulta de prueba llega al destino correcto y queda registrada sin duplicarse.
- El consentimiento se guarda como dato.

### Exclusiones

Envío masivo de mensajes; compra de bases de datos; soporte de la plataforma de terceros; cumplimiento legal específico del país (requiere revisión del cliente).

### Tres preguntas para el diagnóstico

1. Cuéntame la última consulta que se perdió o se atendió tarde: ¿por dónde entró, quién debía responderla y qué pasó?
2. ¿Cuántas consultas recibes en una semana normal y dónde las registras hoy (CRM, hoja de cálculo, WhatsApp u otro)?
3. ¿Quién da el seguimiento a cada consulta, quién decide sobre las herramientas y qué permisos o cuentas ya tienes en esas plataformas?

---

## Decisiones pendientes del fundador

Esta ficha no resuelve ninguna. Hasta que el fundador decida, cada paquete conserva «Precio: por definir».

1. **Precio: dos referencias que no coinciden.**
   - [OFERTA.md](../../altiora-business/OFERTA.md) fija como objetivo confirmado **US$10.000 por proyecto**, con 75 h internas planificadas y cobro en tres pagos.
   - [PAQUETES-BORRADOR.md](../PAQUETES-BORRADOR.md) cita para el Paquete 1 una referencia de **US$3.000–5.000**, tomada de la skill `high-ticket-offer` y sujeta a diagnóstico. [MARCA-ALTIORA.md §3](../MARCA-ALTIORA.md) y [DIFERENCIACION.md §1.3](../DIFERENCIACION.md) usan esa misma referencia.
   - Además, el alcance de los US$10.000 (página comercial de hasta cinco páginas, formulario, una integración y automatización de registro y aviso) no corresponde exactamente a ninguno de los tres paquetes. Se parece más a una combinación de web y Paquete 3.
   - Falta decidir qué referencia rige, si cada paquete tiene precio propio y cómo encaja la oferta de US$10.000 con los paquetes.
2. **Venta por separado o por etapas.** Decidir si los paquetes se venden de forma independiente o como etapas de un mismo proyecto. Por ejemplo, Paquete 1 y después Paquete 2 o 3. La decisión afecta al precio, al plazo y a cómo se presenta la oferta.
3. **Plazo de corrección de defectos.** El borrador de paquetes no lo define. OFERTA.md propone 14 días naturales desde la aceptación final para su oferta de US$10.000. Falta decidir si ese plazo se aplica a los tres paquetes, si varía por paquete y desde qué momento se cuenta.

## Criterio de aceptación de esta ficha

Se acepta cuando el fundador revisa las tres fichas y responde las decisiones 1 a 3. Ninguna ficha pasa a material para clientes con un precio, un caso o una cifra que no tenga fuente en el repositorio.
