# Tilicheros — orquestación de agentes y skills

**Inicio:** 2026-10-29 · **Etapa:** M0 Discovery. El tablero en `team/chat/tasks/` contiene 12 encargos **pendientes**, no procesos ejecutándose.

## Arquitectura de trabajo
Director de experiencia coordina el conjunto. El equipo de Altiora cuenta con 12 roles registrados y 251 skills catalogadas en `INDEX.md`. Se cargan solo skills pertinentes, no las 251 a la vez. Cada rol trabaja en sus propios archivos y QA es independiente.

| Orden | Rol | Skills de inicio | Entrega |
|---|---|---|---|
| 1 | experience-director | altiora-agent-orchestrator, agency-os, business-decision-gates | plan, gates y decisiones |
| 1 | business-strategist | aem-stage-01-discovery, business-diagnostic, market-research, unit-economics, pricing | diagnóstico y oferta |
| 1 | ux-researcher | buyer-persona, customer-journey, information-architecture, accessibility | segmentos y journeys |
| 2 | brand-strategist | brand-architecture, brand-positioning, brand-voice | arquitectura paraguas |
| 2 | creative-director | creative-direction, art-direction, visual-identity | rutas creativas |
| 2 | content-designer | content-strategy, copywriting, seo, local-seo | taxonomía y mensajes |
| 3 | ui-designer | design-system, responsive-design, conversion-ux | sistema de interfaz |
| 3 | visual-producer | product-photography-direction, ai-image-direction, creative-quality-assurance | manifiesto de activos |
| 3 | motion-designer | motion-design, gsap-animation, accessibility | motion medido y fallbacks |
| 4 | web-engineer | nextjs-architecture, immersive-commerce, web-performance, secure-development | plan de plataforma e implementación |
| 4 | qa-reviewer | web-quality-assurance, webapp-testing, accessibility, owasp-review | revisión independiente |
| 4 | growth-analyst | marketing-analytics, conversion-analysis, retention, ab-testing | plan de medición y optimización |

**Skills transversales según diagnóstico:** inventory-management, supplier-evaluation, pricing-optimization, demand-planning, meta-ads-creator, social-media-strategy, n8n-webhook-architect, privacy-engineering, launch-readiness.

## Propuesta UX inicial, no validada
Un portal de marca y tres escaparates claramente diferenciados: **Bebés** (confianza y criterios de edad), **Gaming** (compatibilidad y rendimiento), **Anime** (franquicia, licencia y coleccionismo), con búsqueda, filtros, carrito y políticas compartidas. El acceso directo a productos y compra nunca depende de 3D o scroll narrativo.

## Gates
- **G0 Diagnóstico:** problema raíz, catálogo, canales y restricciones comprobados.
- **G1 Estrategia:** segmentos, propuesta de valor, arquitectura y modelo comercial aceptados.
- **G2 Experiencia:** taxonomía, identidad, flujos, copy y accesibilidad revisados.
- **G3 Implementación:** catálogo, stock, pedidos, pagos, logística y gestión definidos/probados.
- **G4 QA/Launch:** pruebas representativas, seguridad, SEO, performance y política de contenidos/licencias.
- **G5 Growth:** métricas base instrumentadas, experimentos priorizados.

## Cómo activar en Claude Code
En el repositorio, tras integrar la rama de trabajo, ejecutar `/equipo Tilicheros: trabajar tareas abiertas por rol, empezando por M0; reclamar antes de editar, respetar dependencias y enviar resultados a QA`.
También se puede abrir `/chat-business-strategist`, `/chat-ux-researcher` o `/chat-experience-director`. Ver `team/chat/README.md`.

## Estado real
**Se ha preparado el tablero y este expediente.** Ningún subagente de Claude ha sido lanzado automáticamente, ninguna investigación externa ha sido validada y no se ha desplegado web ni comprado producto.
