# Flujo award-grade

Capa sobre [producción por milestones](production.md) para webs que buscan el nivel de un Site of the Day de Awwwards. Estándar técnico y de diseño: [skill award-grade-web](../skills/award-grade-web/SKILL.md). Evidencia de partida: [auditoría de Buttermax](../docs/research/buttermax-audit-2026-10.md).

## Principio

Impacto de premio, contenido de producto. El texto, la navegación, el catálogo y los pedidos viven en HTML accesible; la inmersión es una capa que mejora la experiencia y puede faltar sin romper nada.

## Etapas

| Milestone | Rol (subagente) | Trabajo | Gate de salida |
|---|---|---|---|
| M0 Fit | experience-director + business-strategist | Fit check: inmersión completa, acento o convencional. Tarea principal y CTA. | Decisión escrita con acceso directo al CTA. |
| M1 Concepto | creative-director + brand-strategist | Una idea, un gesto, pareja tipográfica, paleta corta con contraste medido, guion de secciones. | award-jury puntúa el concepto (moodboard y hero estático). |
| M2 Prototipo | ux-researcher + ui-designer + content-designer | Flujo navegable sin WebGL, con teclado y en móvil; copy real. | Tareas completadas sin el efecto. |
| M3 Producción | motion-designer + web-engineer + visual-producer | Implementación desde la [plantilla](../templates/immersive-cursor-lab/README.md) o sus recetas; assets KTX2/Draco con manifiesto. | Checklist técnico completo y `npm run guard` sin errores. |
| M4 Jurado y QA | award-jury + qa-reviewer | Puntuación Awwwards con evidencia; QA funcional, accesibilidad y rendimiento medido. | Ninguna nota menor que 7; QA sin bloqueos. |
| M5 Launch | experience-director | Versión aceptada, rollback, analítica. | Autorización del cliente. |
| M6 Aprendizaje | growth-analyst | Uso real frente a hipótesis. | Backlog priorizado. |

## Bucle de calidad

1. Construir la escena representativa más pequeña que demuestre el gesto.
2. Verificar en navegador real: escritorio, móvil (375 px), teclado, `prefers-reduced-motion`, `?nowebgl`, pestaña oculta, teardown.
3. award-jury puntúa; cada nota menor que 7 vuelve a su dueño como tarea con criterio de aceptación.
4. Repetir hasta pasar el gate. Registrar cada iteración en la ficha de experimento.

## Automatización

- **Hook** (Claude Code, `.claude/settings.json` del laboratorio y de cada proyecto): tras cada `Edit`/`Write` de `.ts`, `.tsx`, `.js`, `.jsx`, `.css` o `.html`, [immersive-guard](../scripts/immersive-guard.mjs) revisa el archivo y avisa al agente de los riesgos sin bloquear.
- **CLI**: `npm run guard -- <carpeta>` para QA o CI; sale con código 1 si encuentra errores.
- **Subagentes**: los roles de esta tabla están en `.claude/agents/` (generados con `npm run agents:build`).

## Instalar el sistema en un proyecto nuevo

1. Copiar `scripts/immersive-guard.mjs` al proyecto y añadir el hook (ver la sección de hooks en `.claude/settings.json` del laboratorio).
2. Partir de la plantilla o copiar `damp`, `pointer` y el patrón de `mount()/destroy()`.
3. Abrir la ficha de experimento con [la plantilla](../templates/experiment.md) y seguir las etapas.
