---
name: product-winner-scorecard
description: "Priorizar SKUs por margen, demanda, stock, competitividad, potencial de demostración y riesgos antes de publicitar."
metadata:
  version: 1.0.0
  owner: Altiora Commerce Growth OS
  status: operational-specification
---

# product-winner-scorecard

## Activación
Para decidir qué productos de un catálogo merecen producción, prueba orgánica y pauta.
## Entradas
SKU/modelo, costo de compra, precio, comisiones, logística, devoluciones estimadas, stock, reposición, ventas/consultas históricas, garantías.
## SOP
1. Validar costos y stock reales; marcar desconocidos PENDIENTE, sin imputar ceros.
2. Calcular contribución unitaria = precio cobrado - costo mercadería - comisiones - subvención de envío - otros costos variables esperados.
3. Puntuar 0–100: contribución 25, demanda verificada 25, stock/reposición 15, precio/diferenciación 15, demostración visual 10, logística/garantía/riesgo 10.
4. Justificar cada subtotal con evidencia y fecha; separar datos internos de señales públicas.
5. Bloquear aprobación de pauta si falta margen real, precio confirmado o posibilidad de entrega.
6. Clasificar: >=75 candidato a piloto; 50–74 requiere mejoras/datos; <50 no priorizar. Ninguna categoría implica ventas garantizadas.
7. Seleccionar máximo 3 SKU para piloto y definir experimento por SKU.
## Salida verificable
Tabla por SKU con insumos, contribución en moneda local, seis puntajes, total, nivel de confianza, faltantes y decisión.
## Controles
El producto «viral» no es automáticamente rentable. Evaluar costo de adquisición contra margen de contribución, no solo facturación.
