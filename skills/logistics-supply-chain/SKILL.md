---
name: logistics-supply-chain
description: Diagnostica y mejora operaciones de inventario, merma, rutas de distribución y proveedores con Teoría de Restricciones (The Goal) y Lean (Toyota Way). Usar cuando haya quiebres de stock, producto vencido, entregas tardías, rutas costosas (p. ej. Turrialba–GAM) o se deba elegir proveedor. Para cálculos de pronóstico detallados delegar en inventory-forecasting o demand-planning.
metadata:
  version: 1.0.0
---

# LOGISTICS-SUPPLY-CHAIN (Executive Protocol)

**Rol de Agencia:** Analista de operaciones y cadena de suministro.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)

### Propósito
Que el producto correcto llegue fresco, a tiempo y al menor coste total, sin acumular inventario que se pierde.

### Marcos
- **Teoría de Restricciones (Goldratt):** 1) identificar la restricción, 2) explotarla, 3) subordinar el resto, 4) elevarla, 5) repetir. Mejorar lo que no es la restricción no aumenta el resultado.
- **Lean / Toyota Way:** eliminar desperdicio (sobreproducción, esperas, transporte, inventario, movimientos, defectos), flujo continuo, pull y mejora kaizen.
- **Indicadores:** merma (% sobre producido), días de inventario, rotación, nivel de servicio (pedidos completos y a tiempo), coste por entrega y por kg.
- **Perecederos:** FEFO (primero en vencer, primero en salir), cadena de frío y vida útil por producto.

Relacionadas: `inventory-management`, `inventory-forecasting`, `demand-planning`, `capacity-planning`, `logistics`, `procurement`, `supplier-evaluation`, `cost-to-serve`.

## 2. Procedimiento Operativo Estándar (SOP Activo)

1. **Diagnóstico:** síntoma principal (quiebres, merma, retrasos, coste) y periodo. Si la instrucción es vaga, hacer como máximo 2 preguntas.
2. **Mapa del flujo:** de producción o compra a entrega final, con tiempos, volúmenes y responsables.
3. **Datos:** reunir indicadores reales; si faltan, definir cómo medirlos durante 2–4 semanas en lugar de suponer.
4. **Restricción:** localizar el cuello de botella con evidencia (cola, espera, capacidad saturada).
5. **Mejoras:** proponer acciones sobre la restricción y sobre los desperdicios principales (frecuencia de ruta, lote, punto de reorden, FEFO, acuerdos con proveedor).
6. **Impacto:** estimar efecto en coste, merma y servicio, con supuestos visibles.

## 3. Entregable Esperado (Output)

Documento Markdown con:
1. Mapa del flujo actual y restricción identificada (con evidencia).
2. Tabla `Problema | Causa | Acción | Responsable | Indicador | Meta`.
3. Estimación de impacto con supuestos.
4. Plan de medición y revisión (kaizen) a 30 días.
5. **Próximo Paso** recomendado.
