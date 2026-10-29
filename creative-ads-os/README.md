# Altiora Creative Ads OS — Producción audiovisual

**Estado:** arquitectura inicial versionada; no implica videos generados ni agentes ejecutándose en segundo plano.

## Principio
Elegir un enfoque por evidencia del producto y público: humor, nostalgia/emoción, demostración, oferta/precio, storytelling, UGC, sorpresa o aspiracional. La calidad no depende de usar IA; combinar rodaje real, montaje, VFX, motion graphics, diseño sonoro y generación asistida cuando aporte.

## Sistema de tres carpetas por campaña
```text
clientes/<marca>/ads/<campana>/
  01_CRUDOS/       ← videos/fotos/audio originales, sin modificar
  02_REFERENCIAS/  ← anuncios de inspiración y notas de aprendizaje, nunca copiar
  03_FINALISTAS/   ← versiones aprobadas, exports y metadatos finales
```
El repositorio incluye carpetas de ejemplo en `projects/tilicheros/ads/`, además de plantilla en `creative-ads-os/campaign-template/`.

**Almacenamiento:** no subir video pesado ni material privado de clientes a un repositorio público. Guardar los archivos audiovisuales en almacenamiento privado con enlaces controlados; GitHub almacena briefs, guiones, inventarios de tomas, manifiestos, proyectos pequeños y criterios de calidad. Usar Git LFS solo si se configura correctamente y se validan límites/costos. Nunca agregar raw audiovisual por accidente.

## Flujo
1. Brief comercial: producto, audiencia, promesa, pruebas, precio, canal y objetivo.
2. Ingesta de 01_CRUDOS: inventario de clips, licencias y mejores tomas.
3. Análisis de 02_REFERENCIAS: describir técnica transferible (ritmo, cámara, luz, montaje), identificar elementos distintivos que NO reutilizar.
4. Proponer 3 rutas distintas; escoger por objetivo y factibilidad.
5. Guion/shot list/audio plan/storyboard; plan de rodaje para cubrir huecos.
6. Edición, color, sonido, motion y VFX; IA solo por plano justificado y comprobable.
7. QA creativo y técnico; export y conservar en 03_FINALISTAS (almacenamiento privado).
8. Variantes A/B y seguimiento de clics, retención y conversiones cuando estén disponibles.

## Agentes existentes reutilizables
- `.claude/agents/creative-director.md`
- `.claude/agents/visual-producer.md`
- `.claude/agents/motion-designer.md`
- `.claude/agents/growth-analyst.md`
- `.claude/agents/qa-reviewer.md`

Skills existentes: `skills/advertising-concept`, `skills/storyboarding`, `skills/ai-video-direction`, `skills/cinematic-direction`, `skills/creative-quality-assurance`, `skills/motion-design`.

Agente de coordinación propuesto en `creative-ads-os/agents/creative-ads-director.md`. Es una definición de rol, no un servicio autónomo desplegado.

## Quality bar
Objetivo estético: acabado publicitario premium; no prometer costo equivalente a un presupuesto específico. No inventar especificaciones ni precios, no presentar comparaciones no verificadas, proteger derechos de autor y privacidad de personas filmadas.

## Extensión 2026-10-29: inteligencia comercial y redes
- [Commerce Growth OS](COMMERCE_GROWTH_OS.md) — auditoría de negocios, selección de productos, investigación de videos, distribución orgánica y medición.
- [Commerce Growth Director](agents/commerce-growth-director.md) — superagente comercial propuesto, aún no desplegado.
- [Market Intelligence Director](agents/market-intelligence-director.md) — protocolo Top 10 videos y score de oportunidades.
- [Auditoría de fotografías de El Tilichero](../projects/tilicheros/ads/AUDITORIA_VISUAL_2026-10-29.md) — hallazgos iniciales y grabaciones propuestas.
