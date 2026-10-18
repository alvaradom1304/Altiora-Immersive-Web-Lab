# Repositorios de agentes y skills para Altiora

Revisión: 18 de octubre de 2026. Se priorizan fuentes mantenidas, formato portable, utilidad para webs y coste de uso proporcionado. Esta selección complementa las 16 referencias inmersivas y los 12 candidatos empresariales.

## Selección de seis fuentes

| Fuente | Qué aporta | Decisión |
|---|---|---|
| [agentskills/agentskills](https://github.com/agentskills/agentskills) | Usar el formato SKILL.md y la carga progresiva como base portable. | adopt |
| [anthropics/skills](https://github.com/anthropics/skills) | Estudiar frontend-design, webapp-testing y patrones de empaquetado de skills. | evaluate |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Seleccionar criterios de React, Next.js y revisión de interfaces para las webs de Altiora. | evaluate |
| [obra/superpowers](https://github.com/obra/superpowers) | Estudiar división de trabajo, contexto aislado, implementación y revisión por tareas. | reference_only |
| [github/spec-kit](https://github.com/github/spec-kit) | Estudiar especificaciones y criterios de aceptación para proyectos amplios. | reference_only |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) | Descubrir skills especializadas de 3D, animación y automatización para revisar por separado. | evaluate |

Las estrellas son una señal secundaria, no el criterio de elección. Las revisiones completas y los enlaces de evidencia están en el [catálogo](../../references/agent-skills-repositories.json).

## agentskills/agentskills

**Licencia observada:** Código Apache-2.0; documentación CC-BY-4.0.

**Cómo se adapta:** La biblioteca skills-ref se presenta como demostración. El estándar no garantiza por sí solo que cada cliente pueda lanzar subagentes.

**Fuentes fijadas:** [README](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/README.md), [Evidencia 1](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/LICENSE), [Evidencia 2](https://github.com/agentskills/agentskills/blob/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/specification.mdx).

## anthropics/skills

**Licencia observada:** Licencia por skill; frontend-design inspeccionada con LICENSE.txt Apache-2.0; algunas skills documentales son source-available.

**Cómo se adapta:** Importar una skill completa y sus recursos solo tras revisar su licencia y adaptación. Los comandos de plugins Claude no son comandos de Antigravity.

**Fuentes fijadas:** [README](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/README.md), [Evidencia 1](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/SKILL.md), [Evidencia 2](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt), [Evidencia 3](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/webapp-testing/SKILL.md).

## vercel-labs/agent-skills

**Licencia observada:** MIT declarada en react-best-practices/SKILL.md; revisar cada skill seleccionada.

**Cómo se adapta:** No asumir licencia homogénea de toda la colección ni compatibilidad automática con el proyecto React 18 existente.

**Fuentes fijadas:** [README](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/README.md), [Evidencia 1](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/react-best-practices/SKILL.md).

## obra/superpowers

**Licencia observada:** MIT.

**Cómo se adapta:** Adaptar el patrón a la tarea. No instalar el proceso entero ni imponer múltiples rondas y agentes en cambios pequeños; no modifica permisos vigentes.

**Fuentes fijadas:** [README](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/README.md), [Evidencia 1](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/LICENSE), [Evidencia 2](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md).

## github/spec-kit

**Licencia observada:** MIT.

**Cómo se adapta:** Su proceso completo puede añadir coste a tareas pequeñas. Usar el brief existente y adaptar solo la planificación necesaria.

**Fuentes fijadas:** [README](https://github.com/github/spec-kit/blob/c6a4c18f1d01a8bec241c618eb6dfea952508744/README.md), [Evidencia 1](https://github.com/github/spec-kit/blob/c6a4c18f1d01a8bec241c618eb6dfea952508744/LICENSE).

## sickn33/agentic-awesome-skills

**Licencia observada:** MIT en el repositorio raíz; revisar procedencia y condiciones de cada recurso importado.

**Cómo se adapta:** Proyecto comunitario independiente de Google; el antiguo antigravity-awesome-skills redirige aquí. No cargar todo el catálogo ni ejecutar instaladores masivos.

**Fuentes fijadas:** [README](https://github.com/sickn33/agentic-awesome-skills/blob/71b1c1a9e2e85e492bc647aeae0b86c21642c249/README.md), [Evidencia 1](https://github.com/sickn33/agentic-awesome-skills/blob/71b1c1a9e2e85e492bc647aeae0b86c21642c249/LICENSE).


## Lo que se incorpora realmente

Altiora recibe tres skills originales y cuatro definiciones de agentes. La redacción se adapta al negocio y a la autorización de la conversación; no es una copia ni una instalación completa de las colecciones externas.

- **altiora-agent-orchestrator:** coordina la tarea y carga skills pertinentes.
- **altiora-repository-research:** compara fuentes con función, coste, licencia y revisión.
- **altiora-quality-review:** valida el resultado y sus límites.

Agentes: investigación, experiencia, ingeniería y revisión. Se activan por necesidad, no todos en cada tarea. Los comandos de plugins de Claude o Codex no se trasladan a Antigravity.

## Compatibilidad comprobada en documentación oficial

La documentación de [skills de Antigravity](https://www.antigravity.google/docs/skills?tab=ide) indica `.agents/skills/<nombre>/SKILL.md` como ruta de proyecto y carga progresiva de instrucciones.

La documentación de [subagentes de Antigravity](https://www.antigravity.google/docs/subagents/) describe `.agents/agents/<nombre>.md`, frontmatter y delegación nativa. No se ha ejecutado este paquete en una instalación de Antigravity. Comprobar capacidades y nombres de herramientas disponibles antes del primer lanzamiento; si no están, aplicar el proceso secuencialmente sin fingir agentes concurrentes.

El flujo no depende de contratar modos avanzados de equipo ni de cambiar de modelo. Un paquete de instrucciones no añade capacidades o permisos que el cliente no tenga.
