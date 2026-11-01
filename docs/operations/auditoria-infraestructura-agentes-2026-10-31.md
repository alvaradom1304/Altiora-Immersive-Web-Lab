# Auditoría de la infraestructura de agentes y skills

Fecha: 2026-10-31. Rama: `feature/altiora-creative-ads-media-pipeline` (base `1fe5c16`). Estado: **núcleo aplicado** (punto 1 de la sección 6, aprobado por el dueño el 2026-10-31); el resto sigue como propuesta. No se borró ni movió ninguna skill.

## 1. Resumen

- El catálogo tiene **263 skills y 24 agentes**. En el trabajo real de este repositorio aparecen **34 skills (13 %)** y **18 agentes**.
- Hay grupos de skills que hacen casi lo mismo (por ejemplo, cuatro de conversión y cinco de SEO) y siete adaptadores locales que repiten roles canónicos.
- Las instrucciones que se cargan en cada sesión repiten reglas: `CLAUDE.md` tiene cuatro secciones sobre After Effects y la sección «Selección y contexto» aparece en `CLAUDE.md`, `AGENTS.md` y las preferencias globales.
- Aplicado: un **núcleo** de 51 skills visibles para el modelo y una **reserva** de 212 disponible por comando, incluidas las duplicadas (sección 6).

Esto coincide con el hueco 4 de la [diferenciación](../strategy/DIFERENCIACION.md): muchas capacidades documentadas y pocas entregas terminadas.

## 2. Inventario (verificado en esta rama)

| Elemento | Cantidad | Fuente |
|---|---:|---|
| Skills con `SKILL.md` en `skills/` | 263 | `scripts/skill-catalog.mjs` |
| Skills marcadas EXPERIMENTAL | 200 | `grep EXPERIMENTAL skills/*/SKILL.md` |
| Agentes en `team/agents/` (= `.claude/agents/`) | 24 | 17 roles de `team/agents.json` + 7 adaptadores de `team/local-agents.json` |
| Skills ocultas al modelo | 0 | test `every canonical skill is model-discoverable` |
| Texto de nombre + descripción de todas las skills | 69.431 caracteres | `loadSkills()` |
| `CLAUDE.md` + `AGENTS.md` + `INDEX.md` | 6.992 + 13.579 + 70.271 bytes | `wc -c` |

## 3. Uso real

**Método.** Se buscó el nombre exacto de cada skill y agente en los archivos de trabajo: `projects/`, `experiments/`, `team/chat/`, `docs/strategy/`, `docs/workflows/`, `creative-ads-os/` y `continuity/` (65 archivos). Se excluyeron el catálogo, los derivados generados y `quality/`, que lista todas las skills por diseño.

**Resultado.**

- Fuera del catálogo, 162 skills aparecen en 1 o 2 archivos, casi siempre solo en `quality/`. Es decir, nadie las ha usado en una tarea.
- Las 34 skills con uso: accessibility, advertising-concept, aem-skill-system, ai-video-direction, altiora-bibliotecario, analytics, audio-production, brand-storytelling, business-social-audit, cinematic-direction, consumer-psychology, creative-deconstruction-originality, creative-direction, creative-quality-assurance, cro, emotional-brand-activation, emotional-branding, ethical-influence, growth-experiment-analysis, growth-experimentation, high-ticket-offer, immersive-commerce, instagram-growth, marketing-psychology, motion-design, organic-social-distribution, product-winner-scorecard, react-three-fiber, retention, schema, seo, storyboarding, top10-video-research, whatsapp-lead-to-sale.
- Muchas de esas 34 solo aparecen en `creative-ads-os/WORK_ROUTER.md`, que es un enrutador y no una entrega. El uso en entregas reales es menor.
- Agentes sin ninguna mención en trabajo real: altiora-engineering, altiora-research, audiovisual-experience-director, immersive-director, immersive-motion-engineer, immersive-reviewer, ux-researcher.

**Límites.** Una mención no prueba que la skill se ejecutara, y su ausencia no prueba que no se usara en un chat. El trabajo de La Central del Queso vive en otro repositorio (`alvaradom1304/la-central-del-queso`) y no se midió. El historial de Git casi no nombra skills, así que no sirvió como señal.

## 4. Solapamientos

### Skills que cubren la misma tarea

| Tarea | Skills | Propuesta |
|---|---|---|
| Conversión | cro, conversion-rate-optimization, conversion-ux, conversion-analysis | Mantener `cro`; las demás a reserva |
| SEO | seo, seo-audit, technical-seo, local-seo, schema (+ plugins searchfit-seo y marketing:seo-audit) | Mantener `seo` y `schema`; `local-seo` a reserva |
| Branding emocional | emotional-branding, emotional-brand-activation | Fusionar en una |
| Psicología de compra | consumer-psychology, marketing-psychology, ethical-influence | Mantener `consumer-psychology`; las demás a reserva |
| Experimentos | ab-testing, growth-experimentation, growth-experiment-analysis | Mantener una de diseño y una de análisis |
| Analítica | analytics, marketing-analytics | Mantener `analytics` |
| Email | emails, email-marketing | Mantener una |
| Logística | logistics, logistics-supply-chain, supply-chain | Mantener `logistics-supply-chain` (la usa La Central) |
| Marca | premium-branding, brand-strategy, brand-development, aem-stage-04-brand y 8 skills brand-* | Mantener `premium-branding` como entrada; el resto a reserva |
| Competencia | competitor-analysis, competitive-intelligence | Mantener `competitor-analysis` |
| Oferta y precio | offers, high-ticket-offer, pricing, pricing-optimization | Mantener `high-ticket-offer` y `pricing` |
| Orquestación de agencia | agency-os, aem-company-builder, company-builder-orchestrator, aem-stage-01 a 07, enterprise-growth-orchestrator | **Decidido (2026-10-31):** `aem-company-builder` es el método único y entra al núcleo con `business-decision-gates`; el resto queda en reserva |
| Orquestación de agentes | altiora-agent-orchestrator, agent-orchestration, quality-council | Mantener `altiora-agent-orchestrator` |
| Revisión de calidad | altiora-quality-review, verification-before-completion, web-quality-assurance | Mantener las dos primeras |
| Crear skills | skill-creator, aem-skill-factory (+ plugin anthropic-skills:skill-creator) | Mantener `skill-creator` del repo |
| Web inmersiva | immersive-commerce, immersive-web-design, premium-digital-experience-builder, elite-web-experience-os | Mantener `immersive-commerce` |
| Seguridad OWASP | cybersecurity-owasp, owasp-review | Mantener una |
| Economía de modelos | smart-model-router, altiora-ai-economy | Mantener `altiora-ai-economy` |

### Agentes que repiten un rol

| Grupo | Agentes | Propuesta |
|---|---|---|
| Web inmersiva | immersive-director, immersive-motion-engineer, immersive-reviewer | Equivalen a creative-director, web-engineer y qa-reviewer con la skill `immersive-interaction-lab`. **Nota:** tus preferencias globales (`~/.claude/CLAUDE.md`) los nombran, así que cambiarlos exige editar también ese archivo |
| Adaptadores de Codex | altiora-experience, altiora-engineering, altiora-research, altiora-review | Equivalen a creative-director, web-engineer, la skill `altiora-repository-research` y qa-reviewer |
| Direcciones | experience-director, audiovisual-experience-director, creative-director, creative-ads-director, commerce-growth-director, market-intelligence-director | Seis directores para un equipo pequeño. El audiovisual es la «entrada obligatoria» según `AGENTS.md`, pero no aparece en ningún trabajo |

## 5. Costo de contexto

- Cada sesión de Claude Code recibía el nombre y la descripción de las 263 skills: unos 69.000 caracteres. El 2026-10-29 se subió `SLASH_COMMAND_TOOL_CHAR_BUDGET` a 140.855 en `.claude/settings.json` para que no se recortara ninguna ([diagnóstico](claude-discovery.md)), así que ese texto entraba completo en cada sesión.
- `CLAUDE.md` repite reglas: cuatro secciones sobre After Effects y MCP que dicen casi lo mismo, y «Selección y contexto» duplicada con `AGENTS.md` y las preferencias globales.
- No se midió el consumo de tokens. Las cifras son de caracteres.

## 6. Propuesta

1. **Núcleo (visible para el modelo) — APLICADO:** 51 skills en `references/skill-core.json`: las 34 con uso y 17 de método (aem-company-builder, business-decision-gates, altiora-agent-orchestrator, altiora-quality-review, altiora-repository-research, competitor-analysis, gsap-animation, immersive-interaction-lab, logistics-supply-chain, premium-branding, systematic-debugging, threejs-experience, verification-before-completion, web-design-guidelines, web-performance, webapp-testing, writing-plans).
2. **Reserva — APLICADO:** las otras 212 reciben `disable-model-invocation: true` en su puente generado, sin tocar los `SKILL.md` fuente ni los originales importados. Siguen disponibles con `/nombre` y en `INDEX.md`. Se promueven al núcleo cuando una tarea real las use.
3. **Archivo — DESCARTADO (2026-10-31):** el dueño decidió dejar las duplicadas de la sección 4 en reserva en lugar de archivarlas. No se mueve ninguna skill; las propuestas «mantener / a reserva» de la sección 4 quedan como guía para elegir cuál promover al núcleo.
4. **Agentes:** convertir los 7 adaptadores locales en alias de los roles canónicos, o archivarlos, y reducir las direcciones a las que se usan.
5. **Instrucciones:** unificar las secciones repetidas de `CLAUDE.md` en una sola por tema. Tu `CLAUDE.md` tiene cambios sin commitear, así que esto se hace después de que los integres.

**Choque con una decisión anterior.** El 2026-10-29 se hizo visible todo el catálogo y un test lo exige (`scripts/discovery.test.mjs`). El motivo fue correcto: estar asignada a un rol no era un buen criterio. Esta propuesta usa otro criterio, el **uso demostrado**, pero igualmente requiere cambiar ese test y [claude-discovery.md](claude-discovery.md).

## 7. Decisiones que necesito de ti

1. ~~¿Aceptas el criterio de uso demostrado para el núcleo?~~ Aprobado el 2026-10-31; test y [claude-discovery.md](claude-discovery.md) actualizados.
2. ~~¿Archivar o solo pasar a reserva las skills duplicadas?~~ Quedan en reserva (2026-10-31).
3. ~~¿Qué método de agencia queda como único?~~ AEM Company Builder (2026-10-31).
4. ¿Se mantienen los agentes `immersive-*` porque los usas desde las preferencias globales?

## 8. Reproducir

Los conteos de la sección 3 salen de buscar cada nombre con límites de palabra en `git ls-files` de las carpetas citadas. El de la sección 2 sale de `loadSkills()` en `scripts/skill-catalog.mjs`. Volver a medir después de cualquier cambio en el catálogo.
