# Visual Production OS · Workflow multi-IA v1

> Aplica a anuncios de Tilicheros, branding Altiora, La Central del Queso y clientes futuros. No sustituye contratos o skills existentes. Guía de producción, no ejecución de software.

Leer antes: [Router por intención](../../creative/visual-studio/ROUTER.md), [catálogo de referencias](../../references/visual-libraries-2026.json), [brief](../../creative/visual-studio/BRIEF.template.md) y los roles de [Altiora](../../team/registry.md).

## Fase 0 — Discovery y estrategia comercial

Estratega de negocio: audiencia, beneficio, oferta, canal, CTA, restricciones y baseline. Dirección creativa: idea, emoción, storyboard, naturaleza del contenido y formato. Aprobación humana del concepto antes de gastar créditos o editar assets con derechos restrictivos.

**Gate 0:** ¿El movimiento responde al mensaje? ¿La promesa está sustentada? ¿Se puede entregar dentro de tiempo/costo?

## Fase 1 — Diseño de la experiencia

Elegir UN camino primario por pieza; combinar solo con necesidad demostrable:

- **Spot programático**: guion → storyboard → assets autorizados → Remotion / Motion Canvas → audio y captions → render → QA.
- **Spot 3D realista**: referencias reales → Blender (modelado, luz, PBR, cámara, animación) → renders/pases → montaje en editor disponible o pipeline de código → QA.
- **Web inmersiva**: UX y contenido accesible → Blender/glTF → optimización y glTF Transform → Three/R3F + GSAP (existentes) → QA de rendimiento/fallback.
- **Identidad animada**: Figma/AE u otro DCC aprobado → Rive o dotLottie para web; MP4 si es anuncio. Evitar doble runtime.
- **Adobe**: Photoshop UXP o Premiere UXP son APIs/plugin samples oficiales, pero requieren software instalado, versiones compatibles y permisos. ExtendScript AE se estudia como referencia con copyright. No suponer ejecución directa desde ChatGPT, Claude o Gemini.

**Gate 1:** opción técnica documentada, licencias verificadas, archivos fuentes identificados y riesgo/costo estimados.

## Fase 2 — Producción y versionado

| Entrega | Responsable | Control |
|---|---|---|
| creative-brief.md, storyboard, plano de cámara | Creative director | relato, utilidad, fidelidad |
| asset-manifest.json + licencias | Visual producer | derechos, resolución, fuentes |
| escena .blend / .glb / textura / imagen | Visual producer + Web engineer | escala, normales, PBR, animación, integridad de export |
| composition / timeline / vector states | Motion designer | continuidad, ritmo, subtítulos, legibilidad |
| página / video y fallbacks | Web engineer / Visual producer | compatibilidad y experiencia real |
| reporte QA + coste de render | QA reviewer | pruebas reproducibles, limitaciones |

Toda iteración conserva `source`, `render`, `asset_manifest`, `acceptance`, `reviewer` y `revision`. No añadir material pirata, música sin licencia, testimonios inventados, logos de terceros sin autorización ni referencias comerciales falsas.

## Fase 3 — Gestión de rendimiento y accesibilidad

**Web:** probar en móviles reales (o emulación documentada), prefer-reduced-motion, teclado, fallo WebGL, recursos GPU, carga de texturas, layout estable, contenido transaccional y CTA funcional. Registrar Core Web Vitals con fuente y entorno (campo/lab).

**Video:** revisar primeros segundos, niveles de audio, continuidad de cortes, secuencias de 15s/30s según brief, safe areas, legibilidad, codecs, ratio vertical/horizontal, export y derechos. No inventar tasas de conversión ni porcentajes de retención.

**3D:** inspeccionar modelos antes/después de compresión, materiales, mapa UV, consistencia de luz, movimiento de cámara, polígonos y peso total. Mantener fallback estático útil.

## Fase 4 — Orquestación entre IAs

1. Leer `AGENTS.md` + `creative/visual-studio/ROUTER.md`.
2. Elegir agente/rol de [team/registry.md](../../team/registry.md); intercambiar un manifiesto (ver Router).
3. Encargar decisiones visuales al director creativo, assets al productor visual, motion al especialista, integración al ingeniero y veto final a QA.
4. Guardar en repositorio el manifiesto y las decisiones. No hacer dos agentes editar el mismo archivo sin coordinación.
5. Cada paso tiene estado `DESIGNED`, `IMPLEMENTED`, `RENDERED`, `TESTED` o `BLOCKED`, respaldado con evidencia; NO `CONNECTED` si faltan credenciales o acceso.
6. Handoff: fuentes, referencias, dependencias, riesgos, archivos, cambios, pruebas y próximo responsable.

## Seguridad, licencias y costo

- Repositorio de terceros = **referencia**, no dependencia aprobada. Leer licencias, últimas versiones, dependencias, scripts, permisos e historial de cambios antes de ejecutar.
- Remotion tiene licencia propia y condiciones comerciales; verificar elegibilidad actual antes de facturar o automatizar: https://www.remotion.dev/docs/license .
- Para Adobe, usar APIs y plugins documentados oficialmente. Nunca prometer conexión Photoshop/Premiere/AE sin un bridge específico habilitado.
- Servidores MCP no oficiales de Blender/Premiere están en `hold`; requieren auditoría de ejecución remota, archivos, puertos, tokens, operaciones destructivas y rollback.
- Mantener herramientas opcionales desacopladas. No instalar 20 librerías en proyectos de clientes; usar experimentos separados en Altiora.

## Checklist de aceptación

- [ ] Concepto aprobado y conforme a marca/audiencia
- [ ] Stack elegido por razones documentadas
- [ ] Licencias y uso comercial revisados
- [ ] Fuente editable y manifiesto presentes
- [ ] Export/web ejecutable verificado o NOT_RUN explícito
- [ ] Accesibilidad, rendimiento y formato revisados
- [ ] Costo, créditos y fallos registrados
- [ ] QA independiente y aceptación del cliente

## Experimento piloto

**Tilicheros:** anuncio corto de consola retro o accesorio gaming sin afirmaciones comerciales falsas: producto real, hero shot, macro detalle, transformación, overlay de valor, CTA. Probar primero el storyboard y una pieza de 5 segundos. Si cumple QA, extender a variante completa 9:16. La venta de productos tipo AirPods exige verificar autenticidad y evitar branding que confunda al consumidor.

**La Central del Queso:** escena piloto de finca → puerta → mesa con iluminación física y texturas naturales en Blender; glTF 2.0 para web con GSAP/R3F, fallback estático y pruebas en móvil. No prometer resultado tipo película solo por usar efectos.
