---
name: "altiora-ai-economy"
description: "Selecciona un flujo de IA para Altiora que reduzca coste y contexto repetido preservando la calidad final. Se usa al comparar proveedores gratuitos o locales, distribuir tareas entre modelos o preparar una conexión económica."
metadata:
  version: 1.1.0
---

# Calidad y coste de IA en Altiora

Partir del entregable y su criterio de calidad. Mantener las decisiones difíciles y la revisión final en el modelo principal acordado. Esta skill recomienda y coordina; no añade una API, claves, cuota o capacidad de enrutamiento que el cliente no tenga.

## Elegir el trabajo que sí conviene derivar

Usar primero scripts, cálculos y validaciones deterministas para tareas repetibles. Evitar gastar llamadas de modelo en trabajo que ya resuelve una herramienta.

Para una tarea acotada de clasificación, resumen o borrador, comparar una opción económica con el flujo actual. El contexto enviado debe ser el material mínimo necesario. Comprobar fidelidad y utilidad antes de reutilizarla.

No degradar una entrega final por perseguir el precio cero. Si la alternativa aumenta errores, espera o correcciones, registrar ese coste y conservar la opción que cumpla el objetivo.

## Proveedores y capacidades

En el laboratorio consultar `references/ai-provider-repositories.json` y `docs/operations/ai-quality-and-cost.md`. Confirmar qué proveedores, modelos y herramientas están conectados realmente.

- Local: verificar runtime, modelo, licencia y memoria antes de inferir. Distinguir ejecución local de la nube del mismo producto.
- Cuota gratuita: comprobar modelo, cuenta, cuota y condiciones vigentes. La licencia de un SDK no significa que la API sea gratuita.
- Varios proveedores: introducir un gateway solo si simplifica un caso real; no instalar otra infraestructura para una llamada.

Si no hay acceso configurado, preparar la elección y describir qué falta. No afirmar conexión exitosa, ahorro, cambio del modelo principal ni prueba de inferencia.

## Contexto y reintentos

Reutilizar fuentes verificadas y cargar skills bajo demanda. Pedir salidas breves y específicas a los auxiliares, en lugar de enviarles el proyecto y luego leer respuestas extensas.

Si una llamada falla por cuota o proveedor, informar la causa y evitar bucles de reintentos. No usar respaldos de pago, auto-recarga o cambio de cuenta para mantener una ruta anunciada como gratuita. Respetar la autorización de gastos existente.

Mantener secretos fuera del prompt y del repositorio. Antes de transferir material de clientes, comprobar que el destino y sus condiciones son adecuados; preferir material público o de prueba para el piloto.

## Medir y cerrar

Comparar la tarea aceptada: coste completo, latencia, correcciones y consumo del coordinador. Separar tokens procesados de coste monetario y de cuotas de la suscripción. No inventar porcentajes de ahorro.

Terminar con proveedor efectivamente usado, tarea resuelta, verificación de calidad y límites. La revisión final se realiza sobre el artefacto real y las pruebas pertinentes, no sobre la promesa de otro modelo.


## Laboratorio disponible en este equipo
Para localizar las fuentes y proyectos de Altiora, consultar [la ubicación local](references/altiora-workspace.md) cuando sea pertinente.
