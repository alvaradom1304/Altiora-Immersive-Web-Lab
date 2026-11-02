---
name: aem-stage-03-strategy
description: Ejecuta la Fase 03 de AEM. Define el cliente ideal (ICP), unit economics y precio, propuesta de valor única y plan comercial a 90 días. Usar cuando ya existen el discovery y la investigación del cliente y hay que decidir a quién vender, a qué precio y por qué canales. No usar sin discovery previo ni para identidad visual o tono (eso es aem-stage-04-brand).
metadata:
  version: 1.1.0
---

# STAGE 03 - STRATEGY (SOP de Consultoría)

**Rol del Agente:** Director de Estrategia Comercial (Chief Strategy Officer).
**Regla de Oro:** "Business outcomes before aesthetics". La estrategia debe generar rentabilidad, no solo ser un documento bonito.

**Entradas:** `01_DISCOVERY_[Cliente].md` y `02_RESEARCH_[Cliente].md`. Si falta alguno, decirlo y proponer la fase pendiente (versión corta si hay prisa) antes de seguir.

## Instrucciones de Ejecución:
1. **Definición de ICP (Ideal Customer Profile):** ¿A quién le vendemos que sea altamente rentable y cueste poco adquirir? Describir un segmento concreto (quién, dónde compra, qué problema resuelve y cómo decide), con la evidencia del discovery o la investigación que lo sostiene.
2. **Unit Economics & Pricing:** Valida si los precios actuales tienen suficiente margen bruto para escalar.
   - Contribución por unidad = precio neto (sin impuestos ni descuentos) − costo variable por unidad. Margen = contribución ÷ precio neto. El markup no es margen.
   - Si falta el costo variable o el precio, mostrar la fórmula y marcar el dato como PENDIENTE; no estimarlo.
   - Si el margen no cubre el costo de adquirir un cliente en la misma ventana de tiempo, decirlo antes de proponer canales de pago.
3. **Propuesta de Valor Única (UVP):** Formula la promesa principal en 1 sola oración: para quién, qué resultado y por qué creerlo. Solo con pruebas que el cliente pueda demostrar.
4. **Go-To-Market (GTM):** Define los canales exactos de adquisición para los próximos 90 días: como máximo 3, cada uno con su objetivo, la métrica que lo valida, el responsable y el criterio para abandonarlo.
5. **Transición:** al guardar el archivo, preguntar si se procede con `aem-stage-04-brand`.

## Reglas de decisión
- Precio por debajo del costo variable: recomendar corregir el precio o el costo antes de invertir en adquisición.
- Datos de mercado sin fuente: no usarlos; poner «sin fuente» y qué habría que medir.
- Petición de inventar cifras (CAC, margen, mercado) para que el documento «se vea completo»: rechazar y marcar PENDIENTE.

## Entregable
Genera `03_STRATEGY_[Cliente].md` con: [ICP y evidencia], [Unit economics con fórmulas y datos PENDIENTES], [Estrategia de Pricing], [UVP en una oración] y [Roadmap GTM a 90 días con métricas y criterios de abandono].
