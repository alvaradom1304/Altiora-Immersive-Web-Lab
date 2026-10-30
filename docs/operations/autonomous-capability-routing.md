# Altiora — enrutamiento por intención y evolución de capacidades (piloto v1)

## Objetivo
El usuario describe el RESULTADO comercial o creativo, no los comandos técnicos. El coordinador inspecciona el brief y el catálogo, selecciona capacidades ya disponibles, decide si necesita especialistas o referencias externas, propone borradores de skills faltantes, delega tareas acotadas cuando el entorno ofrece agentes y verifica resultados.

**Límite fundamental:** estas instrucciones no crean un daemon, servidor ni una conexión automática entre ChatGPT, Gemini, Claude y Antigravity. Cada host necesita acceso autorizado al repositorio actualizado. El router CLI es determinista, de solo lectura y corre en Node 20+, sin API keys, red ni IA.

## Flujo operativo
1. Interpretar intención: resultado, negocio, audiencia, evidencia, restricciones y criterios de aceptación.
2. Leer instrucciones del proyecto, brief, entregas y contexto; con terminal correr: npm run route -- "encargo". El resultado es una recomendación, no un clasificador perfecto.
3. REUSE: inspeccionar skills locales por pertinencia y cargar solo 1–3 cuerpos y referencias necesarias. Revisar la selección con juicio técnico.
4. Brecha: auditar solapamientos. REUSE si existe; IMPROVE si falla; CREATE_DRAFT solo si es una capacidad repetible con valor medible; DEFER si no hay evidencia. No crear una skill porque una frase no coincidió con una expresión regular.
5. Investigar referencias con altiora-repository-research. Registrar URL oficial, commit, licencia, compatibilidad, riesgos y coste. Gate en docs/security/third-party-skill-gate.md antes de copiar/ejecutar herramientas externas; referenciar no es instalar.
6. Delegar a un líder y solo los especialistas necesarios; una tarea, un dueño de archivos. Coordinar con team/chat; usar roles secuenciales cuando el host carece de subagentes.
7. Producir enfoques realmente diferentes y elegir por hipótesis, identidad del cliente, utilidad, experiencia, accesibilidad y conversión; evitar plantillas clónicas.
8. Verificar resultados con QA, evidencia, benchmarks reproducibles y métricas reales; registrar las mejoras y regresiones para evolucionar skills.

## Comandos
- npm run route -- "Quiero un anuncio cinematográfico para El Tilichero": JSON de intención, dueño, skills, brechas, repositorios como referencias y permisos pendientes.
- npm run capability:draft -- "capacidad repetible no cubierta": cuando el router identifica una brecha, crea solo un BORRADOR en proposals/capabilities/; no toca skills/, no instala paquetes, no activa agentes.
- npm run agents:build: sincroniza Claude Code y Antigravity después de revisar/promover una skill fuente.
- npm run check: verifica catálogo, integridad, seguridad y pruebas del enrutador.

## Cobertura por plataforma
- Claude Code: CLAUDE.md, AGENTS.md, subagentes y skills de .claude/, Node CLI si tiene Bash autorizado.
- Antigravity / Gemini en el repositorio: GEMINI.md, AGENTS.md y .agents/, Node CLI si existe terminal.
- Codex u otro agente en el checkout: AGENTS.md, roles fuente y CLI.
- ChatGPT web / Gemini web: acceder a los documentos por conector, archivo o información de esta sesión; pueden seguir la política y preparar PRs cuando el host permita. No cargan automáticamente reglas ni ejecutan scripts solo porque están en GitHub.
- La coordinación entre hosts usa branches, PRs y el tablero compartido con permisos; una sesión no supone memoria, conexión o agentes en otra sesión.

## Checkpoints
Automatizable dentro del alcance: investigación, lectura autorizada, planificación, prototipos reversibles, borradores, commits en ramas de trabajo y tests seguros.
Aprobación humana: gastar, publicar, enviar mensajes a clientes, exponer secretos, instalar/ejecutar software de terceros no auditado, modificar permisos, automatizaciones externas o integrar cambios de alto impacto en producción.

## Calidad y negocio
Medir exactitud de ruta en casos reales, tasa de reutilización frente a creación, tiempo a primera propuesta útil, retrabajo, fallos de QA, accesibilidad, rendimiento móvil y originalidad. Para campañas medir consultas cualificadas, tasa de cierre y contribución si existe línea base. Nunca inventar resultados o confundir vistas con ventas.

## Estado real del piloto
Clasificación por reglas léxicas y solapamiento de metadatos. Puede errar o ignorar una habilidad; hace falta revisión y pruebas de uso real. No hay servicio persistente, aprendizaje automático de fondo ni instalaciones de repositorios de terceros en este cambio. Los borradores no son skills activas.
