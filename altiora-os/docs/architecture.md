# Altiora OS / Agency OS — decisión de arquitectura 1

Fecha: 2026-10-18. Alcance: paquete de instrucciones operativas y herramientas deterministas, sin servicio persistente ni llamadas de pago.

## Resultado y criterios

Unificar investigación, estrategia, creatividad, web 3D, producción visual, QA y crecimiento mediante contratos portables. Conservar `team/`, `skills/`, sus contratos AEM y todo trabajo anterior. El paquete usa nombres `altiora-os-*` para evitar colisiones; no migra las 237 skills existentes ni cambia su estado de validación.

Aceptación: catálogo resoluble, grafo sin ciclos, entrega con evidencias y estados verificables, exportación sin sobrescritura, pruebas negativas de rutas y contratos y PR revisable. La carga efectiva por Claude/Antigravity y la calidad de una web producida requieren pruebas en esos clientes: no se deducen del formato válido.

## Alternativas

| Enfoque | Beneficio | Coste y decisión |
| --- | --- | --- |
| Núcleo portable + host existente | Sin servidor ni SDK obligatorio; reutiliza biblioteca | Elegido para esta entrega; el host ejecuta las instrucciones |
| OpenAI Agents SDK | Handoffs y herramientas programáticas | Candidato para un piloto futuro; requiere credenciales y política de trazas |
| LangGraph | Persistencia, reanudación y revisión humana | Candidato para procesos largos; requiere storage, aislamiento y operación |
| CrewAI | Roles y tareas de alto nivel | Evaluar en un caso real antes de añadir otro orquestador |

No se usa AutoGen para nuevas dependencias: el README fijado declara ausencia de mantenimiento. Claude Code es destino de compatibilidad, no código OSS incorporado. n8n es integración opcional con licencia específica, no infraestructura instalada.

## Capas

1. `manifest.yaml`: registro único de ocho agentes/skills y DAG de entrega. JSON es un subconjunto de YAML 1.2; se usa esa sintaxis para analizar sin instalar dependencias.
2. `skills/`: instrucciones originales autocontenidas, cargadas bajo demanda. `agents/`: roles exportables a Claude Code, sin permisos preautorizados.
3. `scripts/core.mjs`: validación, planificación topológica y contrato de resultados. No ejecuta modelos, red, shell ni workflows de n8n.
4. `scripts/export.mjs`: copia explícita del paquete a ubicaciones del host, con preflight de conflictos y rechazo de enlaces simbólicos.
5. `docs/protocol.md`: coordinación manual/asistida por host, evidencias, revisión y tratamiento de fallos. `tests/`: comprobaciones deterministas y casos para evaluación humana.

## Compatibilidad

Claude Code recibe `.claude/skills/altiora-os-*/SKILL.md` y `.claude/agents/altiora-os-*.md`. Antigravity recibe `.agents/skills/altiora-os-*/SKILL.md`; no se inventa un formato nativo de subagentes. En Antigravity los roles se leen desde `altiora-os/agents/` cuando no haya delegación real. No se modifican `CLAUDE.md`, `GEMINI.md`, settings, MCP, hooks ni permisos existentes.

La biblioteca `skills/` del laboratorio es complementaria: el coordinador elige una capacidad por descripción y carga sus contratos solo al necesitarla. El paquete portable funciona sin copiar esa biblioteca. Agency OS representa el proceso de negocio; AEM OS conserva su biblioteca; Altiora OS coordina su aplicación al proyecto. Son capas, no tres motores concurrentes.

## Riesgos y límites

Los manifiestos no constituyen aislamiento de seguridad. El host debe restringir herramientas, red, secretos y escritura. Sin motor de ejecución no hay persistencia automática ni garantía de obediencia de los modelos. Hay pruebas del planificador/exportador y una revisión independiente de instrucciones; no auditoría de dependencias de los frameworks ni benchmark de producción. Las integraciones Blender/Higgsfield se condicionan a herramientas reales y assets autorizados.
