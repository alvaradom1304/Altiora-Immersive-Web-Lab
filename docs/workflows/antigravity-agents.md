# Usar Altiora con agentes y skills en Antigravity

## Contenido

- Cuatro skills en `.agents/skills/`.
- Cuatro agentes en `.agents/agents/`.
- Seis repositorios evaluados en el [informe](../research/agent-skills-review.md).
- Catálogos existentes de WebGL, motion y herramientas empresariales.

El paquete usa el formato documentado por [Antigravity Skills](https://www.antigravity.google/docs/skills?tab=ide) y [Custom subagents](https://www.antigravity.google/docs/subagents/). Los archivos y sus enlaces se pueden validar localmente; la ejecución en Antigravity queda pendiente de probar en la instalación del usuario.

## Abrir e invocar

Abrir la raíz de Altiora en Antigravity con estos archivos presentes. En las versiones con soporte documentado, las skills se descubren desde `.agents/skills/`. Pedir:

~~~text
Usa altiora-agent-orchestrator para trabajar en La Central del Queso.
Primero compara las referencias pertinentes del catálogo.
Elige skills y agentes según la tarea, reduce trabajo repetido y valida una escena antes de ampliar la experiencia.
~~~

Las versiones con invocación manual admiten `/altiora-agent-orchestrator`. Si la interfaz no muestra el comando, indicar la ruta `.agents/skills/altiora-agent-orchestrator/SKILL.md` para cargarla y comprobar la disponibilidad real del cliente.

Para decidir qué trabajo puede realizar una IA auxiliar, cargar también altiora-ai-economy cuando corresponda. Esa skill no activa conexiones ni cambia el modelo del chat.

## Descubrimiento de agentes

Las definiciones usan solo campos documentados y nombres de herramientas que figuran en la documentación oficial. Comprobar que la versión instalada dispone de ellos. Si el entorno no los expone, adaptar la lista de herramientas a sus capacidades; no cambiar permisos globales.

El coordinador decide si necesita concurrencia. Cuando la herramienta de subagentes no exista, ejecuta los roles de manera secuencial y lo informa. Este paquete no instala un motor de agentes ni contrata funciones adicionales.

## Uso con menos consumo

- Tarea pequeña: ejecución directa.
- Investigación y dirección visual independientes: pueden delegarse por separado.
- Implementación: recibe decisiones y archivos concretos.
- Revisión: examina el cambio y el recorrido afectado.
- Una responsabilidad de escritura por archivo; evitar investigación duplicada.
- Reutilizar las fuentes ya verificadas. Cargar skills y referencias bajo demanda.

La skill conserva la autorización vigente y las restricciones de la herramienta. La propuesta de incorporación a la rama principal sigue separada de la creación o uso local de estos archivos.
