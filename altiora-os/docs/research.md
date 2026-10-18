# Selección de repositorios y adaptación

Revisión documental: 2026-10-18, America/Costa_Rica. Commits completos y URLs por archivo en [sources.yaml](../sources.yaml). Las fechas de HEAD son observaciones de mantenimiento, no versiones recomendadas para instalar ni certificación de seguridad.

## Fuentes oficiales comparadas

| Repositorio | Licencia comprobada | Aplicación y decisión |
| --- | --- | --- |
| [anthropics/skills](https://github.com/anthropics/skills) | README distingue ejemplos Apache-2.0 y skills documentales source-available | Adoptar estructura y carga progresiva; no copiar archivos de terceros |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | LICENSE.md reserva derechos y remite a Commercial Terms | Compatibilidad de archivos; no redistribuir implementación |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | MIT | SDK opcional para handoffs; no necesario para ejecutar skills en un host |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | MIT | Opción para estado durable y reanudación si aparece esa necesidad |
| [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) | MIT | Adaptar separación de roles/tareas; integración requiere piloto y coste medido |
| [microsoft/autogen](https://github.com/microsoft/autogen) | MIT código, CC-BY-4.0 documentación; README declara archivado | Excluir como dependencia nueva; remite a Microsoft Agent Framework, no evaluado aquí |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | Sustainable Use License, excepciones Enterprise y componentes terceros | Integración externa opcional; revisar modalidad comercial antes de hosting o embedding |

No todos los ejemplos pedidos son OSS OSI. No se ha trasladado código ni texto sustancial: los patrones adaptados se implementan con instrucciones y utilidades originales. La licencia del paquete existente queda intacta; `sources.yaml` no relicencia `skills/`, assets ni clientes.

Para compatibilidad se consultaron [skills de Claude](https://code.claude.com/docs/en/skills), [subagentes de Claude](https://code.claude.com/docs/en/sub-agents), [Agent Skills](https://agentskills.io/specification) y [skills de Antigravity](https://www.antigravity.google/docs/skills?tab=ide). `.claude/agents` es un formato específico de Claude; los roles en Antigravity se aplican mediante instrucciones y las capacidades reales del cliente.

## Seguridad revisada

Se inspeccionaron licencias y estado declarado, superficie de ejecución, riesgo de instrucciones externas, secretos en trazas, conflictos de escritura y límites de permisos. El [modelo de seguridad de Claude](https://code.claude.com/docs/en/security) no convierte un MCP externo en servicio auditado. El [tracing del Agents SDK](https://openai.github.io/openai-agents-python/tracing/) requiere configurar captura/retención antes de usar datos de clientes. [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) aporta mecanismos de ejecución durable, pero la aplicación debe aislar persistencia y efectos. [CrewAI](https://docs.crewai.com/en/concepts/agents) requiere revisar la configuración actual de herramientas y sandbox; no se deben heredar snippets de ejecución antiguos.

No se instalaron frameworks ni se ejecutó un escáner de su árbol de dependencias. Antes de adoptar un runtime: fijar release/lockfile, revisar advisories de esa versión, analizar permisos y scripts de instalación y ejecutar un piloto aislado con datos sintéticos. No afirmar ausencia de CVEs a partir de esta comparación.

## Repositorios del usuario

- `alvaradom1304/Altiora-Immersive-Web-Lab`: base de esta rama `1f947f4c55366059691b288e8f361e3ce6ac6d80`; contiene catálogo inmersivo, 237 skills y 12 roles operativos. Se conservan. La copia local anterior difería de GitHub y no se usó para sobrescribirlo.
- `alvaradom1304/AEM-OS`: árbol accesible con README que define sistema de aprendizaje, automatización, AI Engineering y negocio. Apto como destino futuro; no se modifica.
- `alvaradom1304/AEM-Labs`: árbol accesible con README para experimentos y prototipos. No hay implementación adicional que integrar en la revisión realizada.
- `alvaradom1304/la-central-del-queso`: raíz actual contiene app, components y package.json de Next 14/React 18/Fiber 8; no coincide con la ruta histórica `src/web` del brief. Las rutas y dependencias deben revalidarse contra la rama seleccionada al trabajar en esa web. No se modificó ni desplegó.

La inspección de repositorios privados se limita a estructura y propósito; no se copia su contenido al PR público. No se revisaron secretos ni configuración de producción.
