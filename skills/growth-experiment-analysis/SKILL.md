---
name: growth-experiment-analysis
description: "Diseñar, medir y revisar pilotos comerciales de contenidos, emociones y anuncios diferenciando correlación de causalidad."
metadata:
  version: 1.0.0
  owner: Altiora Commerce Growth OS
  status: operational-specification
---

# growth-experiment-analysis

## Activación
Cuando se necesite evaluar hooks, anuncios, productos o canales con presupuesto o tiempo limitados.
## Entradas
Hipótesis, línea base, acceso a datos, costos, ventana de prueba, decisión comercial, presupuesto autorizado y restricciones.
## SOP
1. Formular hipótesis falsable: para [audiencia], [cambio] aumentaría [métrica objetivo] respecto de [referencia] bajo [condiciones].
2. Elegir métrica primaria **comercial** (conversaciones calificadas, compra o contribución), métricas secundarias de creatividad y guardrails (quejas, devolución, gasto).
3. Registrar periodo, tamaño muestral esperado, fuentes, tratamiento/comparador y reglas de seguimiento antes del lanzamiento.
4. Aislar una variable principal por variante cuando sea posible; anotar cambios de algoritmo, horario, stock y promoción como factores de confusión.
5. Registrar resultados por campaña/plataforma/creativo/SKU y calcular costo por chat, CAC, cierre y contribución neta; cuando la muestra es pequeña, reportar incertidumbre.
6. Decidir iterar, detener, mantener o escalar **con autorización de gasto**; documentar aprendizajes sin inventar uplift causal.
## Salida verificable
Ficha de experimento, tabla de datos con denominadores, comparación, incertidumbres, decisión, responsable y fecha.
## Controles
No declarar prueba A/B causal si se publicaron orgánicos sin control. No declarar ventas a partir de vistas.
