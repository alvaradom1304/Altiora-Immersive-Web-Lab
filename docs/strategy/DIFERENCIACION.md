# Diferenciación de Altiora frente a la competencia

Fecha: 2026-10-31. Estado: propuesta de trabajo para revisar con el equipo. Separa lo verificado en este repositorio de lo que solo es hipótesis comercial.

## 1. Panorama competitivo (fuentes externas, no verificadas en profundidad)

| Tipo | Ejemplo | Lo que ofrece | Límite frente a Altiora |
|---|---|---|---|
| Estudio de experiencias de alto perfil | [Active Theory](https://www.designrush.com/agency/profile/active-theory) | Trabajo para marcas grandes, separación entre "client work" y "lab work", premios | Escala y costo altos; el laboratorio es interno y no siempre se traduce en producto comercial pequeño |
| Estudio especializado en web inmersiva | [Elipse Studio](https://elipsestudio.com/services/interactive-web-experiences) | Three.js, Babylon.js y GSAP para lanzamientos y landings de marca | Vende la técnica; el resultado comercial depende del cliente |
| Estudio con casos documentados | [Artistsweb / Skyline Films](https://www.casestudies.com/company/artistsweb/case-study/skyline-films-launches-a-groundbreaking-website-in-3-weeks-with-artistsweb) | Caso con arrastre y scroll, premios reportados | Caso de contenido, no de comercio con pedidos |
| Freelancers en marketplaces | [Contra](https://contra.com/ther1chdumm13s_lpwa3xxb), [Fiverr](https://fiverr.com/gabriel_m4rt1n/create-immersive-webgl-and-threejs-interactive-website-for-animated-portfolios) | Precio bajo, entrega rápida | Sin proceso de calidad, licencias ni continuidad documentada |

Conclusión provisional: el mercado vende **espectáculo técnico** o **precio bajo**. Casi nadie vende, con evidencia, una experiencia que además vende: pedido, accesibilidad, rendimiento y licencias revisadas.

## 2. Diferenciadores que Altiora ya tiene en el repositorio (verificables)

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

## 6. Qué no decir

- No prometer FPS, conversión ni ventas sin medición del cliente.
- No afirmar que Altiora trabajó para marcas que no aparecen en un caso documentado.
- No comparar con competidores por premios o clientes sin fuente verificable.
