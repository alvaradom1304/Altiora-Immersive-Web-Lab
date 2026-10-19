# Enrutamiento de tareas

<!-- Generado con npm run agents:build. No editar a mano. -->

Claude elige el agente y las skills sin que la persona los seleccione. Antes de ejecutar una petición:

1. **Clasificar** la petición con la tabla. Si toca varios roles, el Director de experiencia la divide (`/equipo`) o se trabaja por pasos, un rol cada vez.
2. **Delegar** en el subagente del rol cuando la tarea es sustancial y de un solo rol. Para preguntas rápidas, responder directamente aplicando sus skills.
3. **Cargar** las skills del rol que apliquen. Si ninguna encaja, buscar en [INDEX.md](../INDEX.md) por tema y leer `skills/<nombre>/SKILL.md`, aunque no esté en el listado automático.
4. **Decir** en una línea qué agente y qué skills se usaron y por qué. Si no se usó ninguno, decirlo.
5. **No forzar**: si ninguna skill aporta, trabajar directamente. No usar una skill solo por usarla.

| Si la tarea trata de… | Agente | Skills principales |
|---|---|---|
| arrancar o coordinar un proyecto: dividir el trabajo entre roles e IAs, crear tareas en el tablero, resolver conflictos y decidir gates de milestone. | `experience-director` (`/chat-experience-director`) | `altiora-agent-orchestrator`, `elite-web-experience-os`, `business-decision-gates`, `launch-readiness`, `quality-council`, `human-in-the-loop` … |
| definir problema, oferta, audiencia, KPIs e hipótesis de negocio, o revisar unit economics y precios. | `business-strategist` (`/chat-business-strategist`) | `business-strategy`, `value-proposition-design`, `buyer-persona`, `unit-economics`, `pricing`, `market-research` … |
| traducir el posicionamiento a atributos, voz y reglas de marca. | `brand-strategist` (`/chat-brand-strategist`) | `brand-strategy`, `brand-positioning`, `brand-voice`, `brand-personality`, `premium-branding`, `brand-guidelines` |
| proponer rutas creativas, moodboards y guion visual, o revisar coherencia artística. | `creative-director` (`/chat-creative-director`) | `creative-direction`, `art-direction`, `cinematic-direction`, `storyboarding`, `photography-direction`, `creative-quality-assurance` |
| entender tareas del usuario, mapear flujos, diseñar pruebas de tareas y reducir fricción en compra o pedido. | `ux-researcher` (`/chat-ux-researcher`) | `ux-research`, `user-flow`, `customer-journey`, `information-architecture`, `conversion-ux`, `accessibility` … |
| definir tokens, componentes, estados e interfaz responsive. | `ui-designer` (`/chat-ui-designer`) | `ui-direction`, `design-system`, `color-system`, `typography-direction`, `responsive-design`, `frontend-design` … |
| producir o dirigir fotografía, imágenes, video e ilustración con manifiesto de derechos y optimización. | `visual-producer` (`/chat-visual-producer`) | `product-photography-direction`, `ai-image-direction`, `ai-video-direction`, `visual-identity`, `web-performance` |
| guiones de movimiento, transiciones, scroll y alternativas con movimiento reducido. | `motion-designer` (`/chat-motion-designer`) | `motion-design`, `gsap-animation`, `scroll-experience`, `cinematic-direction`, `threejs-experience` |
| implementar componentes, escenas WebGL, integración de pedidos y verificación técnica. | `web-engineer` (`/chat-web-engineer`) | `nextjs-architecture`, `react-three-fiber`, `threejs-experience`, `vercel-react-best-practices`, `web-performance`, `frontend-security` … |
| redactar copy por sección, CTA, mensajes de error y ayuda con hechos verificados. | `content-designer` (`/chat-content-designer`) | `copywriting`, `content-strategy`, `brand-voice`, `seo`, `local-seo`, `emails` … |
| revisar de forma independiente una entrega: funcional, visual, accesibilidad, rendimiento y seguridad. Puede bloquear. | `qa-reviewer` (`/chat-qa-reviewer`) | `web-quality-assurance`, `accessibility`, `altiora-quality-review`, `web-performance`, `security-testing`, `owasp-review` … |
| planes de medición, eventos, baseline de conversión y backlog de experimentos. | `growth-analyst` (`/chat-growth-analyst`) | `marketing-analytics`, `conversion-analysis`, `conversion-rate-optimization`, `growth-experimentation`, `retention`, `ltv-optimization` … |
| Repositorios, librerías o dependencias de terceros | (directo) | `/repos`, `altiora-repository-research` |
| Crear o mejorar skills | (directo) | `skill-creator`, `aem-skill-factory`, ciclo en docs/workflows/skill-improvement.md |
