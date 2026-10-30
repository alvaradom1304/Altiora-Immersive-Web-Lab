# Altiora — Enrutador de marketing y publicidad (v1.0)
**Regla de uso:** al recibir «marketing», «branding», «publicidad», «anuncios», «Reels», «TikTok», «Facebook», «Instagram», «producto ganador», «analizá videos», «clientes», «ventas» o sinónimos, leer este archivo y elegir SOLO las capacidades pertinentes. Esta es una instrucción de orquestación del repositorio, no un servicio siempre encendido.

## Rutas e intenciones
| Intención | Responsable | Skills |
|---|---|---|
| «Marketing para [negocio]», crecimiento comercial | `commerce-growth-director` + `business-strategist` + `growth-analyst` | `business-social-audit`, `product-winner-scorecard`, `organic-social-distribution`, `whatsapp-lead-to-sale`, `growth-experiment-analysis` |
| «Branding», «emocionar», identidad y compra | `brand-strategist` + `creative-ads-director` | `emotional-brand-activation`, `brand-storytelling`, `consumer-psychology`, `ethical-influence` |
| «Anuncio», «video», «Reel», «cinemático» | `creative-ads-director` + `visual-producer` + `motion-designer` + `qa-reviewer` | `advertising-concept`, `creative-deconstruction-originality`, `emotional-brand-activation` si el concepto lo requiere, `storyboarding`, `ai-video-direction`, `organic-social-distribution` |
| «Buscá los 10 videos», tendencias, competencia | `market-intelligence-director` + `growth-analyst` | `top10-video-research`, `creative-deconstruction-originality` |
| «Qué producto vender», «producto ganador» | `commerce-growth-director` + `market-intelligence-director` | `product-winner-scorecard`, `top10-video-research` si aporta información |
| «Publicar orgánico» | `creative-ads-director` + `growth-analyst` | `organic-social-distribution`, `business-social-audit` |
| «Cerrar por WhatsApp», «medir ventas» | `commerce-growth-director` + `growth-analyst` | `whatsapp-lead-to-sale`, `growth-experiment-analysis` |

## Algoritmo de activación mínima
1. Leer `AGENTS.md`, este archivo y el brief específico del cliente. Confirmar marca vs proveedor.
2. Clasificar el encargo: diagnóstico, investigación, estrategia, concepto, producción, distribución, conversión, medición o mixto.
3. Elegir un director responsable y 1–3 skills principales; añadir especialistas de edición/motion/QA si corresponde. No convocar decenas de roles por tareas pequeñas.
4. Reusar los 12 agentes existentes en `.claude/agents`; los directores de `creative-ads-os/agents` son especificaciones para coordinar, no promesas de agentes activos autónomos. Si el entorno no permite subagentes, ejecutar roles secuencialmente.
5. Para campaña nueva: revisar hasta diez ejemplos VERIFICABLES, identificar mecanismo de decisión del cliente, proponer tres rutas (humor, emoción/narrativa, demo/oferta), construir guion y decisión. No forzar emoción para todo producto.
6. Para audiovisual: `01_CRUDOS` → `02_REFERENCIAS` → `03_FINALISTAS` (medios privados fuera de GitHub), QA en producto, derechos, sonido y continuidad.
7. Medir chats, clientes, contribución y aprendizaje; nunca equiparar vistas con ventas. Registrar resultados y actualizar patrones reutilizables.
8. Informar estado de cada acción: DISEÑADO / IMPLEMENTADO / PROBADO / APROBADO / PUBLICADO. No afirmar que se ejecutó un agente cuando solo se leyó su archivo.

## Checkpoint y límites
- Investigación/plan/guiones/creación de archivos reversibles: avanzar con autorización vigente.
- Gastos, publicación, mensajes a consumidores, cambios a cuentas, permisos: esperar aprobación específica.
- No copias de obras de referencia, testimonials falsos, escasez inventada, métricas sin datos, precios comparativos no sustentados.
- Prioridad cliente El Tilichero: gaming/tecnología, FB/Instagram/TikTok → WhatsApp; Tecnogau es proveedor, no anunciante.

## Integración con Claude Code
Las skills fuente están en `skills/<nombre>/SKILL.md`. El proyecto genera el espejo de `.claude/skills` y el índice con `npm run agents:build` (no editar esos derivados manualmente); validar con `npm run check`. Otros asistentes deben leer este router por iniciativa explícita o instrucciones en `AGENTS.md`. No existe ejecución autónoma o carga automática en ChatGPT por solo subir Markdown.
