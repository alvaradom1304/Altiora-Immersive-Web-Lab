---
name: financial-forecasting
description: Construye proyecciones financieras con tres escenarios (Conservador, Base, Optimista), unit economics, punto de equilibrio y necesidad de caja. Usar cuando se planee crecer, abrir un canal o local, fijar metas de ventas o comprobar si un plan destruye rentabilidad. No usar como asesoría de inversión ni para presentar proyecciones como resultados garantizados.
metadata:
  version: 1.0.0
---

# FINANCIAL-FORECASTING (Executive Protocol)

**Rol de Agencia:** Analista de planeación financiera.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)

### Propósito
Evitar el crecimiento que destruye rentabilidad: ver antes de invertir cuánto se vende, cuánto se gana por unidad y cuánta caja se necesita.

### Componentes
- **Supuestos explícitos:** volumen, precio, mezcla, costes variables, costes fijos, plazos de cobro y pago, inventario. Cada supuesto con su fuente (histórico, cotización, estimación).
- **Unit economics:** margen de contribución por unidad y por pedido, coste de adquisición y coste de servir.
- **Tres escenarios:** variar solo los supuestos inciertos, con rangos justificados, no multiplicar todo por un factor.
- **Punto de equilibrio y caja:** unidades y ventas para cubrir fijos; capital de trabajo y mes de caja mínima.
- **Sensibilidad:** qué supuesto mueve más el resultado.

Relacionadas: `unit-economics`, `break-even-analysis`, `cash-flow-analysis`, `cost-to-serve`, `capital-requirements`, `pricing`.

## 2. Procedimiento Operativo Estándar (SOP Activo)

1. **Diagnóstico:** objetivo de la proyección (decisión a tomar), horizonte y moneda. Si la instrucción es vaga, hacer como máximo 2 preguntas.
2. **Datos base:** reunir históricos y costes reales; lo que falte se marca como estimación con rango.
3. **Modelo:** calcular ingresos, costes variables, margen de contribución, fijos y resultado mensual; mostrar fórmulas.
4. **Escenarios:** Conservador, Base y Optimista cambiando los 2–4 supuestos más inciertos.
5. **Caja:** proyectar entradas y salidas con plazos reales; localizar el punto más bajo de caja.
6. **Sensibilidad y alertas:** identificar el supuesto crítico y los umbrales que harían inviable el plan.
7. **Revisión:** comprobar unidades, signos, sumas y coherencia entre escenarios.

## 3. Entregable Esperado (Output)

Documento Markdown (y hoja de cálculo si se pide) con:
1. Decisión que apoya y horizonte.
2. Tabla de supuestos `Supuesto | Conservador | Base | Optimista | Fuente`.
3. Resultados por escenario: ventas, margen de contribución, resultado operativo, punto de equilibrio y caja mínima.
4. Sensibilidad y alertas.
5. Limitaciones: es una proyección, no una promesa.
6. **Próximo Paso** recomendado.
