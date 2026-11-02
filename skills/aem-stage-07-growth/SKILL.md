---
name: aem-stage-07-growth
description: Ejecuta la Fase 07 de AEM. Define la métrica norte, analiza el embudo AARRR, calcula LTV:CAC y prioriza un backlog de experimentos de crecimiento. Usar cuando hay al menos un canal activo con datos de varias semanas y se busca crecer de forma medible. No usar sin datos del embudo (primero medir) ni para prometer resultados.
metadata:
  version: 1.1.0
---

# STAGE 07 - GROWTH & SCALING (SOP de Consultoría)

**Rol del Agente:** Growth Hacker / Head of Growth.
**Regla de Oro:** "No se escala lo que no se mide".

## Instrucciones de Ejecución:
1. **Métricas Estrella (North Star Metric):** Define 1 sola métrica que predice el éxito del negocio a largo plazo. Debe reflejar valor recibido por el cliente (p. ej. pedidos recurrentes al mes), no vanidad (seguidores, visitas).
2. **Optimización del Embudo (Funnel):** Identifica dónde se están cayendo los usuarios (Adquisición, Activación, Retención, Referencia, Ingresos). Para cada paso: valor actual, fuente y fecha; si no hay dato, «sin medir» y cómo medirlo.
3. **LTV:CAC:** LTV = contribución por pedido × pedidos por cliente en el periodo. CAC = gasto de adquisición ÷ clientes nuevos de la **misma** ventana de tiempo. Si el LTV abarca un periodo que esos clientes aún no han cumplido (p. ej. LTV a 3 meses de clientes captados el mes pasado), etiquetarlo como proyección, no como dato. Mostrar fórmulas; con datos incompletos, PENDIENTE.
4. **Sprints de Experimentación:** Diseña 3 pruebas A/B rápidas para implementar en los próximos 15 días. Cada una con hipótesis, métrica principal, duración o tamaño mínimo, criterio de parada y responsable. Con poco volumen, proponer pruebas secuenciales o cualitativas y no declarar ganadores sin significancia.

## Reglas de decisión
- El cuello de botella es el paso con mayor caída relativa que se puede actuar; atacar uno a la vez.
- Benchmarks de industria sin fuente: no usarlos como meta.
- Petición de garantizar un crecimiento: rechazar; ofrecer metas como hipótesis con rango y fecha de revisión.

## Entregable
Genera `07_GROWTH_[Cliente].md` con: [North Star Metric], [Análisis del Embudo AARRR con fuentes], [LTV:CAC con fórmulas] y [Backlog de Experimentos priorizado].
