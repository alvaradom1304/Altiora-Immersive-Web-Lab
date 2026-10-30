# Altiora — Enrutador de marketing y publicidad (v1.0)
**Regla de uso:** al recibir «marketing», «branding», «publicidad», «anuncios», «Reels», «TikTok», «Facebook», «Instagram», «producto ganador», «analizá videos», «clientes», «ventas» o sinónimos, leer este archivo y elegir SOLO las capacidades pertinentes. Esta es una instrucción de orquestación del repositorio, no un servicio siempre encendido.

## Rutas e intenciones
| Intención | Responsable | Skills |
|---|---|---|
| «Marketing para [negocio]», crecimiento comercial | `commerce-growth-director` + `business-strategist` + `growth-analyst` | `business-social-audit`, `product-winner-scorecard`, `organic-social-distribution`, `whatsapp-lead-to-sale`, `growth-experiment-analysis` |
| «Branding», «emocionar», identidad y compra | `brand-strategist` + `creative-ads-director` | `emotional-branding`, `brand-storytelling`, `consumer-psychology`, `ethical-influence` |
| «Anuncio», «video», «Reel», «cinemático» | `creative-ads-director` + `visual-producer` + `motion-designer` + `qa-reviewer` | `advertising-concept`, `creative-deconstruction-originality`, `emotional-brand-activation` si el concepto lo requiere, `storyboarding`, `ai-video-direction`, `organic-social-distribution` |
| «Editá mis videos», «uní clips», «motion graphics», «exportá MP4», «postproducción» | `creative-ads-director` + `motion-designer` + `visual-producer` + `qa-reviewer` | `ai-video-direction` (extensión `references/postproduction-playbook.md`), `cinematic-direction`, `creative-quality-assurance` según necesidad |\n| «Buscá los 10 videos», tendencias, competencia | `market-intelligence-director` + `growth-analyst` | `top10-video-research`, `creative-deconstruction-originality` |
| «Qué producto vender», «producto ganador» | `commerce-growth-director` + `market-intelligence-director` | `product-winner-scorecard`, `top10-video-research` si aporta información |
| «Publicar orgánico» | `creative-ads-director` + `growth-analyst` | `organic-social-distribution`, `business-social-audit` |
| «Cerrar por WhatsApp», «medir ventas» | `commerce-growth-director` + `growth-analyst` | `whatsapp-lead-to-sale`, `growth-experiment-analysis` |

## Algoritmo de activación mínima
1. Leer `AGENTS.md`, este archivo y el brief específico del cliente. Confirmar marca vs proveedor.
2. Clasificar el encargo: diagnóstico, investigación, estrategia, concepto, producción, distribución, conversión, medición o mixto.
3. Elegir un director responsable y 1–3 skills principales; añadir especialistas de edición/motion/QA si corresponde. No convocar decenas de roles por tareas pequeñas.
4. Reusar los 15 agentes registrados en `team/agents.json` en `.claude/agents`; los directores de `creative-ads-os/agents` son especificaciones para coordinar, no promesas de agentes activos autónomos. Si el entorno no permite subagentes, ejecutar roles secuencialmente.
5. Para campaña nueva: revisar ejemplos VERIFICABLES pertinentes, identificar la esencia del metraje, proponer tres rutas creativas DIFERENTES basadas en clips reales, comparar con historial de estilos y elegir por ajuste de marca/contenido. Humor, emoción y demo son alternativas, NUNCA tres plantillas obligatorias.
6. Para audiovisual: `01_CRUDOS` → `02_REFERENCIAS` → `03_FINALISTAS` (medios privados fuera de GitHub). Para material ya filmado, invocar el módulo de postproducción de `skills/ai-video-direction/references/postproduction-playbook.md`: inspección ffprobe, selects reales, montaje FFmpeg, motion Remotion si disponible, exportación MP4, QA técnico + visual, fuentes editables y manifiesto de derechos. No declarar render hecho sin archivo real y verificación.
7. Medir chats, clientes, contribución y aprendizaje; nunca equiparar vistas con ventas. Registrar resultados y actualizar patrones reutilizables.
8. Informar estado de cada acción: DISEÑADO / IMPLEMENTADO / PROBADO / APROBADO / PUBLICADO. No afirmar que se ejecutó un agente cuando solo se leyó su archivo.

## Checkpoint y límites
- Investigación/plan/guiones/creación de archivos reversibles: avanzar con autorización vigente.
- Gastos, publicación, mensajes a consumidores, cambios a cuentas, permisos: esperar aprobación específica.
- No copias de obras de referencia, testimonials falsos, escasez inventada, métricas sin datos, precios comparativos no sustentados.
- Prioridad cliente El Tilichero: gaming/tecnología, FB/Instagram/TikTok → WhatsApp; Tecnogau es proveedor, no anunciante.

## Integración con Claude Code
Las skills fuente están en `skills/<nombre>/SKILL.md`. El proyecto genera el espejo de `.claude/skills` y el índice con `npm run agents:build` (no editar esos derivados manualmente); validar con `npm run check`. Otros asistentes deben leer este router por iniciativa explícita o instrucciones en `AGENTS.md`. No existe ejecución autónoma o carga automática en ChatGPT por solo subir Markdown.

## Gate de repositorios externos
Para nuevas skills, agentes, scripts, plugins y dependencias audiovisuales, leer `docs/security/third-party-skill-gate.md`, examinar procedencia y licencia, y ejecutar `npm run security:scan -- --target <ruta-en-cuarentena>` antes de una importación. SAFE no implica aprobación automática; la revisión humana y las pruebas de funcionalidad siguen siendo obligatorias. Las herramientas recomendadas están catalogadas en `docs/research/video-production-repositories-2026-10-30.md`.

## Workspace por empresa y campaña
En cualquier tarea de edición real, leer `docs/video/VIDEO_WORKSPACES.md`; generar `media-workspaces/<cliente>/<campaña>/` con `npm run video:project -- init --client <cliente> --campaign <campaña>`. Hay tres carpetas comerciales obligatorias: `01_CRUDOS` (material del cliente), `02_REFERENCIAS` (ejemplos autorizados/links) y `03_RESULTADOS` (MP4 exportados). Sumar `04_EDITABLES` (proyecto Remotion/edición) y `05_QA` (verificación). Claude Code usa `.claude/`, Antigravity `.agents/`, Codex `AGENTS.md` + `.agents/skills/` + `.codex/agents/`. No publicar sin autorización.

## Antirrepetición editorial — activación obligatoria
Ante «me entrega siempre el mismo edit», «estilo diferente», «adaptar a esencia», «creatividad original», «no uses el mismo motion», o al montar una nueva campaña para cliente con historial, el `creative-ads-director` activa **primero** `skills/ai-video-direction/references/creative-variation-playbook.md`, **después** `postproduction-playbook.md`.
- Visionar material, describir personalidad, construir tres rutas distintas (8 ejes) y auditar con `npm run video:variation`.
- Comparar con `media-workspaces/<cliente>/_creative-history.json` (solo local). No asignar escenas o técnicas sin soporte en metraje.
- Para un render terminado, QA visual debe comprobar que el cambio es **real**. Una salida JSON PASS no acredita creatividad profesional.
- Mantener invariantes de marca, seguridad, licencias y honestidad; tres conceptos no implican tres MP4.
- Instrucciones delegables en `docs/video/CREATIVE_VARIATION.md`.

## Gate previo de investigación: First Step Is Discovery
Para `anuncio`, `campaña creativa`, `video publicitario`, `marketing visual`, `motion graphics`, `referencias de video`, `landing visual` o nuevas decisiones de técnicas de edición, consultar `docs/marketing/DISCOVERY_PREPRODUCTION_GATE.md` **antes** de `creative-variation-playbook.md` y del montaje.
- `market-intelligence-director` investiga con `top10-video-research` + `creative-deconstruction-originality`; `creative-ads-director` revisa hipótesis, evidencia, alternativas y experimentos. No utilizar motion graphics por defecto ni afirmar resultados de ventas sin datos.
- Registrar referencias accesibles e inaccesibles, métodos de observación, derechos y riesgos; crear `05_QA/discovery-report.json` privado y ejecutar `npm run marketing:discovery -- --report <ruta>`. Con PASS continuar a dirección creativa; con NEEDS_REVIEW consultar decisiones faltantes; con BLOCKED no afirmar investigación completa.
- Para observar material local con acceso autorizado, `npm run video:observe -- --client el-tilichero --campaign earbuds` genera fotogramas, inventario y timecodes para inspección humana o modelo visual. No ve el significado automáticamente. Herramientas opcionales Playwright (web) o VSS NVIDIA (video) requieren instalación/credenciales/hardware/autorizaciones y pasar el gate de terceros.
- Si es una modificación mecánica menor de un anuncio ya aprobado, reutilizar el Discovery vigente y no forzar pesquisa nueva.
