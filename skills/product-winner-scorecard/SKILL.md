---
name: product-winner-scorecard
description: "Usar cuando el usuario quiera elegir qué producto anunciar, identificar un producto ganador o priorizar el catálogo según demanda, margen, inventario y riesgo."
metadata:
  version: 1.0.0
---

# PRODUCT WINNER SCORECARD — Altiora

## Misión y criterio de activación
Elegir candidatos rentables antes de gastar en publicidad. Activar exclusivamente para una tarea pertinente y usar contexto real del negocio.

## Entradas requeridas
SKU, precio, costo unitario, comisiones, envíos asumidos, devoluciones, stock/reposición, ventas previas, competencia y cobertura.

## Procedimiento operativo (SOP)
1. Confirmar modelo/SKU, disponibilidad y legalidad de promesas de producto.
2. Calcular contribución unitaria = precio – costo – comisión – empaque – subsidio de entrega – devoluciones esperadas atribuibles. Separar impuestos y gastos fijos según el contexto.
3. Puntuar con criterios y evidencia: contribución 25, demanda demostrada 25, stock/reposición 15, diferenciación/precio 15, potencial audiovisual 10, logística/garantía 10.
4. Marcar cada rubro con fuente y confianza; NO sumar un cero ficticio como si fuera desempeño observado cuando faltan datos.
5. Definir elegibilidad comercial: información crítica pendiente → NO VALIDADO; validado y conveniente → CANDIDATO A TEST; histórico rentable → PRIORIDAD DE ESCALADO solo si datos suficientes.
6. Elegir dos o tres SKUs para microprueba controlada y revisar después de datos de conversaciones y compras.

## Entregable y métricas
Scorecard /100 con campos confirmados/desconocidos, cálculo auditado, recomendación condicionada, presupuesto máximo sugerido solo bajo supuestos explícitos.

## Calidad, ética y límites
Ni el score ni vistas implican ganador probado; no proclamar rentabilidad sin costo y stock verificables. Evidencia antes que opinión; declarar NO VERIFICADO, PENDIENTE o BLOQUEADO cuando corresponda.

## Validación y casos de evaluación
Ejecutar al menos tres casos de `references/evaluation-cases.json` al integrar; documentar resultados PASS/FAIL/NOT_RUN. Una revisión de estructura no prueba efectividad real.

## Dependencias y traspaso
Leer `AGENTS.md` y `creative-ads-os/WORK_ROUTER.md` desde la raíz del repositorio. Complementar con `consumer-psychology`, `ethical-influence`, `advertising-concept`, `brand-storytelling` y `growth-experimentation` solo si aportan valor concreto.

## Versión
1.0.0 — 2026-10-29: primera implementación de skill operativa reutilizable.
