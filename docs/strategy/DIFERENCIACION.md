# Diferenciación de Altiora frente a la competencia

Fecha: 2026-10-31. Estado: propuesta de trabajo para revisar con el equipo. Separa lo verificado en este repositorio de lo que solo es hipótesis comercial.

## 1. Panorama competitivo

### 1.1 Referentes internacionales (fuentes externas, no verificadas en profundidad)

| Tipo | Ejemplo | Lo que ofrece | Límite frente a Altiora |
|---|---|---|---|
| Estudio de experiencias de alto perfil | [Active Theory](https://www.designrush.com/agency/profile/active-theory) | Trabajo para marcas grandes, separación entre "client work" y "lab work", premios | Escala y costo altos; el laboratorio es interno y no siempre se traduce en producto comercial pequeño |
| Estudio especializado en web inmersiva | [Elipse Studio](https://elipsestudio.com/services/interactive-web-experiences) | Three.js, Babylon.js y GSAP para lanzamientos y landings de marca | Vende la técnica; el resultado comercial depende del cliente |
| Estudio con casos documentados | [Artistsweb / Skyline Films](https://www.casestudies.com/company/artistsweb/case-study/skyline-films-launches-a-groundbreaking-website-in-3-weeks-with-artistsweb) | Caso con arrastre y scroll, premios reportados | Caso de contenido, no de comercio con pedidos |
| Freelancers en marketplaces | [Contra](https://contra.com/ther1chdumm13s_lpwa3xxb), [Fiverr](https://fiverr.com/gabriel_m4rt1n/create-immersive-webgl-and-threejs-interactive-website-for-animated-portfolios) | Precio bajo, entrega rápida | Sin proceso de calidad, licencias ni continuidad documentada |

### 1.2 Competencia local en Costa Rica (consultada el 2026-10-31)

Fuentes: listados de Clutch para [branding](https://clutch.co/cr/agencies/branding) y [desarrollo web](https://clutch.co/cr/web-developers) en Costa Rica, y [Revista EyN](https://www.revistaeyn.com/empresasymanagement/moov-media-group-se-expande-a-costa-rica-y-mexico-con-meta-de-crecer-50-en-tres-anos-MB27625797) (2025-10-06). Clutch muestra datos declarados por cada agencia y su orden es comercial; no prueba calidad, ventas ni tamaño real.

| Grupo | Ejemplos (Clutch, top 10 de cada listado) | Proyecto mínimo / tarifa declarada | Lo que ofrece | Límite frente a Altiora |
|---|---|---|---|---|
| Agencias de branding y publicidad | Buzz, Bragi, Jacuzzi Creative Studio, Vuelo 88, Brandia | Desde USD 1,000+ (Bragi, Jacuzzi, Vuelo 88) hasta USD 10,000+ (Buzz); tarifas entre < USD 25 y USD 150–199/h | Identidad, publicidad, redes, diseño web | Venden imagen y campaña; el listado no muestra web inmersiva ni flujo de pedido medido |
| Casas de software y desarrollo web | Siftia, Kambda, ParallelDevs, WAM Digital, FusionHit, Gorilla Logic | Desde USD 1,000+ (People Apps) hasta USD 250,000+ (Gorilla Logic); la mayoría USD 10,000+ | Software a medida, apps, e-commerce, desarrollo de IA | Fuertes en ingeniería; en la parte del listado revisada ninguna menciona 3D, WebGL ni experiencias inmersivas |
| Grupos de marketing con IA | Moov Media Group (expansión a Costa Rica en 2025) | No publicado | Consultoría tecnológica, medios, contenidos; IA, automatización y alianzas con Google, Meta, Shopify, HubSpot | Enfoque en performance y medios, no en experiencia de marca inmersiva |

Límites de esta revisión: solo se leyó la primera parte del listado de desarrollo web de Clutch (unas 100,000 de 172,000 caracteres); no se revisaron Behance, Awwwards ni directorios locales; precios declarados no equivalen a cotizaciones. Un perfil individual en LinkedIn sugiere trabajo en IA y 3D interactivo en Costa Rica, sin confirmar que sea agencia.

### 1.3 Conclusión provisional

El mercado vende **espectáculo técnico** (estudios internacionales), **precio bajo** (marketplaces), **imagen y campaña** (agencias locales de branding) o **ingeniería a medida** (casas de software locales). En Costa Rica no se encontró, en las fuentes revisadas, una oferta visible que combine experiencia inmersiva, pedido funcionando y evidencia de calidad para una pyme. Ese es el hueco que Altiora puede ocupar, siempre que lo demuestre con un caso real.

Lectura de precio: la referencia del Paquete 1 ([borrador](PAQUETES-BORRADOR.md), USD 3,000–5,000) queda por encima del mínimo de agencias locales de branding (USD 1,000+) y por debajo del mínimo habitual de las casas de software (USD 10,000+). Es una comparación de mínimos declarados, no de alcances equivalentes.

## 2. Diferenciadores que Altiora ya tiene en el repositorio (verificables)

Comprobado el 2026-10-31: todos los archivos enlazados en esta sección existen en la rama `feature/altiora-creative-ads-media-pipeline`, y `npm run check` incluye las pruebas citadas (catálogo, auditoría de skills, runtime, bibliotecario, audio y After Effects).

- **Experiencia atada a la venta.** El caso [La Central del Queso](../../projects/la-central-del-queso/BRIEF.md) exige que el catálogo, el formulario de pedidos y WhatsApp sigan funcionando. El [workflow inmersivo](../workflows/immersive-project.md) lo trata como requisito.
- **Calidad con evidencia.** `npm run check` ejecuta catálogo, auditoría de skills, pruebas de runtime, bibliotecario, audio y After Effects. Un informe sin evidencia no se presenta como verificado ([validación](../research/VALIDATION.md)).
- **Licencias y procedencia.** Cada referencia visual tiene revisión de licencia ([revisión](../../references/visual-license-review.md)) y el gate de seguridad para skills externas ([gate](../security/third-party-skill-gate.md)).
- **Pipeline audiovisual reproducible.** Remotion, FFmpeg y verificación de MP4 (`experiments/tilicheros-motion-lab`), con QA técnico y límites declarados.
- **Operación compartida entre IAs.** Claude, Codex, Gemini y ChatGPT trabajan sobre el mismo tablero ([chat del equipo](../../team/chat/README.md)) y el mismo protocolo ([operación compartida](../operations/SHARED-OPERATIONS.md)).
- **Honestidad comercial.** Las reglas del repositorio prohíben inventar certificaciones, testimonios, ROI o FPS; también prohíben afirmar conexiones o publicaciones sin evidencia.

## 3. Posicionamiento candidato (a validar con clientes)

> Experiencias inmersivas que se miden: llevan al cliente de la historia de la marca al pedido, sin perder velocidad, accesibilidad ni licencias.

Es una hipótesis. Solo se usa en público si hay un caso real con medición.

## 4. Huecos honestos (lo que Altiora todavía no puede demostrar)

1. **No hay caso publicado con métricas reales.** La pieza Tilichero y La Central del Queso son prototipos o experimentos, no entregas comerciales medidas.
2. **No hay precios ni paquetes definidos.** Faltan oferta, alcance y tarifas en un documento que el equipo pueda vender.
3. **No hay cartera pública.** No existe un espacio donde un cliente vea trabajo real.
4. **El laboratorio no está conectado a una venta.** Hay muchas capacidades documentadas y pocas entregas terminadas.

## 5. Acciones propuestas, en orden

1. Terminar un caso real (La Central del Queso, experimento 001) con medición de carga, accesibilidad y flujo de pedido. Sin esto, el resto es opinión.
2. Definir 2 o 3 paquetes vendibles con alcance y exclusiones, a partir de [immersive-commerce](../../skills/immersive-commerce/SKILL.md) y [high-ticket-offer](../../skills/high-ticket-offer/SKILL.md).
3. Publicar solo capturas y métricas que se puedan reproducir, con fuente en el repositorio.
4. Mantener la comparación con competidores como tarea recurrente: revisar la lista del punto 1 cada trimestre con fuentes fechadas.
5. Pedir 2 o 3 cotizaciones locales con el mismo alcance del Paquete 1 (una agencia de branding y una casa de software) para comparar alcance y precio reales, no solo mínimos declarados.

## 6. Qué no decir

- No prometer FPS, conversión ni ventas sin medición del cliente.
- No afirmar que Altiora trabajó para marcas que no aparecen en un caso documentado.
- No comparar con competidores por premios o clientes sin fuente verificable.
