# IA de Altiora — calidad final con menor coste

Revisión: 18 de octubre de 2026. Prioridad del usuario: ahorrar sin perjudicar la calidad de los trabajos finales.

## Recomendación

Aplicar un flujo híbrido y empezar con un único proveedor auxiliar. Mantener el modelo principal para decisiones difíciles y revisión final. Usar herramientas deterministas para cálculos, búsquedas locales, validaciones y transformaciones repetitivas. Una IA auxiliar solo compensa cuando reduce el coste completo de una tarea sin aumentar errores o retrabajo.

| Trabajo | Primera opción | Evidencia de aceptación |
|---|---|---|
| Formato, redimensionado y comprobaciones repetibles | Herramientas y scripts existentes | Resultado verificable y pruebas apropiadas |
| Resúmenes de material acotado, clasificación o primer borrador | Proveedor auxiliar económico o gratuito disponible | Fidelidad al material y salida útil, revisada |
| Arquitectura, decisiones de marca e integración compleja | Modelo principal del proyecto | Coherencia con el brief y funcionamiento |
| Entrega final | Revisión principal y pruebas del artefacto | Evidencia visual, funciones comerciales y límites claros |

Esto es una política de trabajo. No configura automáticamente el modelo de este chat ni sustituye las pruebas del resultado.

## Opciones de conexión

| Opción | Aporta | Condición para que ahorre |
|---|---|---|
| [Ollama](https://github.com/ollama/ollama) | Modelos locales con un servidor en el equipo | Equipo adecuado y una tarea que el modelo local resuelva bien |
| [OpenRouter Free](https://openrouter.ai/openrouter/free) | Acceso API a modelos gratuitos disponibles | Cuota suficiente y modelo apto para la tarea; no usarlo como dependencia única de una entrega urgente |
| [Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing) | Modelos seleccionados con nivel gratuito | Proyecto/modelo realmente elegible y condiciones de datos aceptables |
| [LiteLLM](https://github.com/BerriAI/litellm) | Una interfaz para varios proveedores | Usarlo cuando evite integración repetida; no desplegar un gateway solo para un proveedor |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | Ejecución local con mayor control técnico | Necesidad concreta que justifique su configuración |

Los cuatro repositorios revisados se registran en el [catálogo](../../references/ai-provider-repositories.json). OpenRouter es un servicio y se documenta como tal; no se presenta una lista de enlaces como conexión activa.

## Qué significa gratuito

Los modelos siguen procesando tokens. Una cuota gratuita evita pagar parte de esa inferencia; no elimina los límites ni acredita ahorro del coordinador. Una llamada a otra IA también puede añadir trabajo de preparación y revisión. Medir el conjunto.

Ollama puede funcionar en modo exclusivamente local: [FAQ oficial](https://docs.ollama.com/faq). El runtime es MIT y los modelos tienen sus propias licencias. El cálculo local usa memoria, energía y tiempo; no se ha verificado un modelo adecuado en este equipo.

[OpenRouter Free](https://openrouter.ai/openrouter/free) muestra precio cero para su router de modelos gratuitos. Su [plan gratuito](https://openrouter.ai/pricing/) publica límites de uso; al revisar esta página figura 50 solicitudes al día. La cuota, la disponibilidad y los modelos deben comprobarse de nuevo al conectar. No habilitar modelos de pago o auto-recarga como respuesta a un límite.

La [página de Gemini](https://ai.google.dev/gemini-api/docs/pricing) distingue modelos gratuitos y de pago y señala uso de contenido para mejorar productos en el nivel gratuito. Revisar la cuenta y el material antes de enviar documentos de clientes; no asumir que la política de un proyecto de pago es la misma.

LiteLLM usa MIT fuera de enterprise/ según su licencia. No incluye los costes de los proveedores ni garantiza que las funciones Enterprise sean gratuitas.

## Conectores y modelo principal

La búsqueda del directorio de plugins no devolvió coincidencias para Ollama, OpenRouter, Gemini o Groq en este entorno. Eso no acredita su inexistencia universal; se pueden revisar más opciones en el [directorio](https://chatgpt.com/plugins). Para Altiora, una integración API o un servicio local puede ser más directa que un plugin.

La [documentación oficial de MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) describe herramientas e información conectadas. La [configuración del proveedor](https://learn.chatgpt.com/docs/config-file/config-reference) es una función distinta. Conectar una herramienta de otra IA no cambia por sí solo el modelo que coordina este chat.

## Un piloto pequeño

1. Elegir una tarea repetida real, por ejemplo resumir un brief no confidencial.
2. Conservar la salida del flujo actual y probar una alternativa con el mismo material mínimo.
3. Comparar coste de inferencia, consumo del coordinador, latencia, correcciones y calidad aceptada. No sumar tokens de distintos proveedores como si costaran lo mismo.
4. Reutilizar la alternativa solo para la tarea que superó la comparación.
5. Si falla la calidad, se agota la cuota o no hay proveedor configurado, comunicarlo. Un respaldo de pago requiere autorización específica si no estaba prevista.

La configuración en [config/ai-routing.plan.json](../../config/ai-routing.plan.json) es un plan inactivo, no una configuración ejecutable del cliente ni una garantía automática de presupuesto.

## Estado

Investigación y skill incorporadas. No se instalaron runtimes, descargaron modelos, conectaron cuentas, guardaron claves ni hicieron solicitudes de inferencia. El comando Ollama no estaba disponible y la consulta de hardware no tuvo acceso, así que no se recomienda un tamaño de modelo todavía. La elección de la primera conexión sigue pendiente.

La conexión real requiere seleccionar proveedor y configurar su acceso mediante el mecanismo seguro del entorno. No pedir claves en el chat ni incluirlas en el repositorio.
