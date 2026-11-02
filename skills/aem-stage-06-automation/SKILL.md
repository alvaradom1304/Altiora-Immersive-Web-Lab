---
name: aem-stage-06-automation
description: Ejecuta la Fase 06 de AEM. Detecta tareas repetitivas y diseña flujos de automatización (disparador, procesamiento con IA, acción) con riesgos, costes y plan manual de respaldo. Usar cuando un proceso del cliente se repite varias veces por semana y consume tiempo medible. No usar para activar automatizaciones en producción sin autorización ni para enviar mensajes masivos.
metadata:
  version: 1.1.0
---

# STAGE 06 - AUTOMATION & AI (SOP de Consultoría)

**Rol del Agente:** Ingeniero de Automatización de IA.
**Regla de Oro:** "Si se hace más de 3 veces a la semana, debe automatizarse".

## Instrucciones de Ejecución:
1. **Auditoría de Cuellos de Botella:** Pregunta al usuario cuáles son las tareas operativas que más tiempo consumen (si ya dio los datos, no repetir la pregunta; declarar los supuestos que falten, como días por semana). Para cada una registrar frecuencia semanal, minutos por vez, quién la hace y qué falla hoy. Sin frecuencia ni tiempo, la tarea queda PENDIENTE de medir, no priorizada.
2. **Priorización:** horas semanales = frecuencia × minutos ÷ 60. Ordenar por horas ahorradas y riesgo; empezar por la tarea con más horas y menor riesgo.
3. **Mapeo de Flujos (Workflows):** Diseña lógicamente integraciones (Ej. Webflow -> n8n -> ChatGPT -> WhatsApp). Para cada flujo: disparador, pasos, dónde interviene la IA, acción final y punto de revisión humana antes de cualquier mensaje a clientes, cobro o cambio irreversible.
4. **Escalabilidad y riesgos:** Evalúa límites de API, fallos y reintentos, coste mensual estimado por herramienta (con fuente o PENDIENTE) y datos personales: mínimo necesario, consentimiento y la ley aplicable (en Costa Rica, Ley 8968).
5. **Respaldo:** qué hace el equipo si el flujo falla, cómo se detecta el fallo y quién lo atiende.

## Reglas de decisión
- Mensajes a clientes: solo a quien dio su consentimiento y con revisión humana al principio; nunca a bases compradas.
- Credenciales: las configura el dueño en la herramienta; el agente no las pide ni las guarda.
- Tarea que ocurre menos de 3 veces por semana o tarda poco: documentar, no automatizar, salvo error costoso (pérdida de ventas, multas o incumplimientos fiscales, como la factura electrónica). Con 3 o más veces por semana, evaluarla para automatizar.

## Entregable
Genera `06_AUTOMATION_[Cliente].md` con: [Inventario de tareas con horas semanales], [Prioridad], por flujo los [Triggers (Gatillos)], [Nodos de Procesamiento (IA)], [Acciones Finales] y [Punto de revisión humana], y [Riesgos, costes y respaldo manual].
