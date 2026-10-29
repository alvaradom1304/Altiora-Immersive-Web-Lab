# Altiora — Commerce Growth OS (v0.1)
**29-10-2026** · Sistema transversal para clientes con tiendas ya operativas.
**Estado:** metodología y especificaciones versionadas. No representa bots autónomos desplegados, acceso a redes, campañas encendidas ni ventas registradas.

## Misión
Diagnosticar un negocio -> investigar mercado y contenido -> seleccionar productos rentables -> producir anuncios ORIGINALES -> publicar orgánico / pauta aprobada -> convertir consultas en compras -> medir margen y mejorar. Marca central: la del cliente. No crear otra tienda si ya vende.

## Gobierno: reutilizar antes de crear
**Superagente existente:** Creative Ads Director (`creative-ads-os/agents/creative-ads-director.md`). Coordina conceptos, guion, audiovisual y QA.
**Nuevo rol/especificación:** Commerce Growth Director. Responsable de convertir el diagnóstico y los hallazgos en un sprint comercial con objetivos, pruebas, prioridades y medición. No confundir con un agente ya ejecutándose.
**Nuevo rol/especificación:** Market Intelligence Director (`creative-ads-os/agents/market-intelligence-director.md`). Responsable de benchmark verificable y selección de oportunidades.

**Agentes existentes reutilizados:** `business-strategist`, `growth-analyst`, `creative-director`, `visual-producer`, `motion-designer`, `qa-reviewer`.
**Roles que falta especificar/integrar como agentes o subprocesos:**
- Product Opportunity Analyst: catálogo, inventario, margen, logística, demanda, priorización SKU.
- Video & Competitor Scout: recopilar anuncios/videos públicos, enlace, fecha, métricas visibles y técnica transferible.
- Organic Social Producer: adaptar pilares y frecuencia por Facebook, Instagram y TikTok; copies, pruebas, comunidad.
- WhatsApp Conversion Specialist: respuestas rápidas, etiquetas, trazabilidad, objeciones y cierre; no inventar automatización de la cuenta.
- Measurement & Experiment Specialist: atribución por códigos/creativos, tabla de pedidos, CAC, utilidad marginal y pruebas.

**Skills a añadir (propuestas, NO implementaciones):**
1. `business-social-audit`: identidad, biografía, enlaces, highlights, frecuencia, CTA, conversación.
2. `top10-video-research`: muestreo público, registro de fuentes, descomposición segundo a segundo.
3. `product-winner-scorecard`: priorización por margen, demanda comprobable y cumplimiento operativo.
4. `creative-deconstruction-originality`: separar ritmo/hook/estructura de elementos protegidos a NO copiar.
5. `organic-social-distribution`: adaptación por red, calendario, distribución y engagement.
6. `whatsapp-lead-to-sale`: consulta -> calificado -> cotización -> pedido -> venta y seguimiento.
7. `growth-experiment-analysis`: hipótesis, métricas de negocio, aprendizaje, decisión.
Prioridad de instalación: skills 1, 2, 3 y 6; las demás en el siguiente sprint. Usar skills existentes de storytelling, video, storyboard y QA.

## Protocolo de investigación "Top 10 por producto"
Entrada: marca/modelo/SKU exacto o categoría marcada como exploratoria, país objetivo, público, rango de precio, fecha, plataformas.
1. Buscar TikTok Creative Center Top Ads + Trends, anuncios activos en Meta Ad Library, Reels/TikTok públicos y referentes locales de Costa Rica.
2. Registrar hasta 10 VIDEOS ACCESIBLES Y VERIFICABLES; si no hay diez, no inventar ni sustituir una categoría por un SKU sin avisar.
3. Por video: URL, creador, país, publicación o fecha de consulta, plataforma, formato, duración, hook 0–3 s, promesa, demostración, prueba, ritmo, texto, sonido, CTA, vistas/likes/comentarios SOLO si visibles, tipo de anuncio (orgánico/pagado/indeterminado), elemento distintivo NO copiable, idea adaptable.
4. Evaluar señales públicas por separado del resultado comercial: viralidad no acredita ventas, ROAS, CAC o margen; biblioteca de anuncios activos tampoco acredita rentabilidad.
5. Proponer 3 conceptos ORIGINALES (humor, demo/prueba, valor/oferta o historia si procede), con guion, toma real, CTA, permiso/derechos, test A/B.
6. Entregar resumen con enlaces, 3 hallazgos, 3 riesgos, recomendación y confianza (alta/media/baja).

## Score "producto ganador" — filtro orientativo /100
- Contribución por unidad (precio - costo - comisiones - subsidio envío - devoluciones esperadas): 25.
- Demanda comprobable (ventas propias, búsquedas, consultas, evidencia comparable): 25.
- Disponibilidad/rotación y reposición: 15.
- Diferenciación y competitividad local del precio: 15.
- Facilidad de mostrar beneficio visual auténtico en 15–30 s: 10.
- Entrega, garantía y riesgo posventa: 10.
**Gate:** ningún producto se proclama "ganador" sin datos comerciales. Puntaje 75+ = candidato a piloto, NO venta garantizada. Productos sin costo o stock verificable: PENDIENTE.

## Estrategia por plataforma (hipótesis inicial, adaptar por analítica)
- Facebook: Reels originales + publicación producto/beneficio + comunidad y comentarios; respuesta rápida y CTA verificable a WhatsApp.
- Instagram: Reels 9:16, historias de stock/uso, carruseles de utilidad, destacados "Comprar", "Entregas", "Garantía" según políticas reales.
- TikTok: contenido nativo/auténtico, pruebas en cámara, humor y demostración; investigar tendencias sin reutilizar videos ajenos con cambios mínimos.
- Meta Ads a WhatsApp: solo después de aprobar creativo, claims, catálogo, cobertura, acceso y presupuesto.
- Una misma producción puede originar 3 adaptaciones con primer segundo, caption y CTA específicos.

## Funnel y medición
Origen identificado por `campaña+plataforma+creativo+producto` -> conversación -> lead calificado -> cotización -> pedido -> pago -> entregado.
Registrar fecha, origen, SKU, costo, precio, costo logística, gasto de pauta, resultado y motivo de pérdida cuando corresponda. Indicadores: costo por chat, % chats calificados, % cierre, CAC, ticket, contribución neta después de anuncios, tiempo de respuesta, recompra. En orgánico, no atribuir todas las ventas a una publicación sin evidencia.

## Calendario mínimo de prueba (sin pauta aprobada)
D1: perfil/WhatsApp + datos comerciales; D2: top10 y score; D3: grabar 3 hooks; D4: editar y QA; D5: publicar prueba orgánica; D6: responder/medir; D7: revisar y decidir próximos creativos. Ritmo sujeto a recursos.

## Pipeline audiovisual
Por campaña conservar `01_CRUDOS/`, `02_REFERENCIAS/`, `03_FINALISTAS/`. Videos privados/pesados van a almacenamiento privado autorizado, no a GitHub público. En GitHub: links permitidos, research, briefs, guiones, reportes y manifiestos; nunca contraseñas o datos personales de clientes.

## Reglas
No copiar anuncios literalmente; no reutilizar música, escenas, rostros, marca o texto sin derechos. No inventar atributos, precio, descuentos, stock o desempeño. No prometer ventas. Ninguna acción en cuentas del cliente o gasto sin autorización. La investigación depende de visibilidad/accesibilidad de las plataformas y no implica navegación ilimitada de videos restringidos.

## Referencias oficiales
- TikTok Top Ads: https://ads.tiktok.com/resources/help/article/how-to-use-the-top-ads-dashboard
- TikTok Creative Center: https://ads.tiktok.com/resources/help/article/creative-center
- Meta Ad Library: https://www.facebook.com/ads/library/
- Meta originalidad 2026: https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/
- WhatsApp Ads: https://whatsappbusiness.com/es-la/products/create-ads-that-click-to-whatsapp/
