# Herramientas compartidas — Codex y Claude Code

Fecha: 29 de octubre de 2026. Alcance: El Tilichero en Altiora. Skill aplicada: mcp-integration. Compartir configuración y entregables no comparte sesiones, credenciales ni autorizaciones.

## Contrato de trabajo

Se conserva el mismo repositorio, catálogo y tablero; cada herramienta se verifica en cada cliente. No se copia la sesión de ChatGPT a Claude ni se trata un inventario de archivos como conexión activa. Las capacidades propias de un host se aprovechan entregando archivos que el otro puede leer.

| Capacidad | Codex / ChatGPT | Claude Code Desktop | Forma de colaboración |
|---|---|---|---|
| Skills y agentes Altiora | Fuentes disponibles y checks ejecutados | Sesión real verificada: 261 fuentes, 22 agentes del proyecto; una skill antes oculta localizada | Fuentes únicas y generadores; roles y comandos auxiliares separados |
| Archivos y Git | Rama feature/altiora-creative-ads-media-pipeline, PR #10; API de GitHub utilizada | Misma carpeta/rama comprobada en UI y por el propio Claude; API del conector no probada por esta revisión | Propiedad de archivos, tareas y commits; revisar cambios antes de integrar |
| Metricool | Usuario informa conexión realizada; herramientas aún no expuestas a este chat y catálogo del plugin sigue indicando installed=false | Configuración HTTP de proyecto preparada en .mcp.json; autenticación y tools/list pendientes | Misma marca y periodo, datos reales de solo lectura como primer smoke test; no se declara conectado por tener JSON |
| Higgsfield | Respuesta real de workspace y búsqueda de proyecto verificadas; no se generó contenido en esta preparación | Conexión no verificada; documentación oficial diferencia connector de Claude Desktop y CLI para Claude Code | Primero transferir referencias/archivos de producción; conectar el runtime adecuado si hace falta generar desde Claude |
| Imágenes, documentos y análisis nativos | Usar las capacidades disponibles en este host | Usar capacidades propias comprobadas del otro host | Compartir briefs, medios originales, exports y evidencia; no inventar una API que transporte herramientas nativas |

Estados de Metricool deliberadamente separados: el relato del usuario es conexión realizada; el observable de este chat es ausencia de herramientas y un catálogo todavía no sincronizado. Puede ser una diferencia de sesión/cuenta o actualización pendiente; la causa no está demostrada. No se pide al usuario reinstalar sin más ni se duplica el conector automáticamente.

## Metricool: configuración concreta para Claude Code

Se añadió .mcp.json en la raíz con un solo servidor HTTP llamado metricool y la URL oficial https://ai.metricool.com/mcp. No existía .mcp.json previamente. No se añadieron tokens, headers de autenticación, comandos ejecutables, flags de bypass ni aprobaciones automáticas. Las configuraciones personales se conservan: la inspección local imprimió solo nombres de servidores, sin leerlos al chat como credenciales.

Claude Code admite servidores de proyecto en .mcp.json. Las sesiones locales de Desktop usan la misma configuración; una sesión ya abierta puede necesitar recargar el servidor o abrir una sesión nueva para descubrirlo. Si hay un servidor de igual nombre con otra procedencia, comprobar su origen antes de añadir un duplicado.

La primera vez puede aparecer aprobación del servidor y luego OAuth. El usuario completa cualquier autenticación/consentimiento en la interfaz oficial. No se solicitan contraseñas ni claves por chat. El objetivo inicial es lectura, pero esa instrucción no reduce por sí sola el alcance del permiso OAuth concedido por el proveedor.

## Smoke test y aceptación

1. En la pestaña Code, usar la raíz actualizada de Altiora. Consultar /mcp; localizar metricool, revisar la URL y completar la autenticación oficial si la solicita.
2. Comprobar conexión y catálogo de herramientas, sin programar publicaciones para probar acceso.
3. Listar marcas. Elegir El Tilichero solo si nombre y perfil corresponden a @el.tilichero.cr; si hay varias coincidencias, no elegir a ciegas.
4. Confirmar las redes conectadas a esa marca. Una conexión del asistente con Metricool no implica que Instagram/Facebook de El Tilichero estén vinculados dentro de Metricool.
5. Consultar un periodo explícito de hasta 30 días como primera prueba, sujeto al plan y datos disponibles; usar America/Costa_Rica para el informe. Conservar unidades, fechas, definición de métricas y ausencia de datos. Un array vacío no equivale a 0 ventas o 0 engagement.
6. Devolver estado del servidor, marca/cuentas comprobadas, operación realizada y límites. No incluir secretos, IDs de otras marcas, conversaciones ni datos personales innecesarios en GitHub.
7. Hasta observar las respuestas, registrar OAuth, tools/list, brands y analytics como NOT_RUN. Añadir evidencia nueva separada de este estado inicial; no cambiar el estado por una declaración genérica de conexión.

Errores previstos: servidor pendiente de aprobación → intervención en cliente; no autenticado → OAuth oficial; marca ausente → verificar cuenta/identidad; sin red vinculada → dueño conecta la red; sin datos o límite de plan → informar vacío/límite, sin inventar métricas; error de lectura → un reintento acotado según respuesta, no convertirlo en una escritura.

El MCP documentado ofrece marcas, analítica y planner. La ayuda actual distingue esos servicios de inbox, comentarios, archivos de Canva/Drive y gestión de campañas de Ads, que no se deben prometer desde este conector. Leer analítica de Ads no es administrar campañas.

## Higgsfield: reutilizar sin instalación indiscriminada

La guía oficial publica un MCP para Claude Desktop/claude.ai y una ruta CLI/skills para Claude Code. No se instala globalmente una CLI o colección de skills solo para duplicar capacidades que ya funcionan aquí. Si producir en Claude requiere esa ruta, verificar versión/licencia, plan de cuenta, costo y autenticación en un encargo concreto. La respuesta del plugin aquí no demuestra que la misma cuenta/plan esté lista en Claude.

Mientras tanto, Codex puede trabajar con los medios autorizados mediante sus herramientas disponibles y entregar los archivos al mismo proyecto. Claude usa los mismos briefs y versiones. No se generan prestaciones, testimonios o productos sustitutos como si fueran material real del SKU.

## Fuentes oficiales consultadas

- [Conexión Metricool con Claude](https://help.metricool.com/how-to-connect-metricools-mcp-with-claude-0l84v): superficies, URL, OAuth y alcance real del servidor.
- [MCP en Claude Code](https://code.claude.com/docs/en/mcp): formato HTTP de proyecto, aprobación y autenticación.
- [Claude Code Desktop](https://code.claude.com/docs/en/desktop): configuración compartida con CLI en sesiones locales y procedencias.
- [Conexiones oficiales Higgsfield](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent): connector Desktop y ruta CLI para agentes de código.

## Verificación de esta entrega

Configuración JSON y endpoint oficial: preparados y comprobados estructuralmente. No se cambió configuración global ni se iniciaron servicios locales. OAuth, descubrimiento y analítica de Metricool: NOT_RUN hasta que el cliente exponga la conexión. La validación de formato no se presenta como integración autenticada.

Próximo paso: descubrir metricool en Claude Code y completar su autorización oficial; después listar marcas y consultar solo los datos de El Tilichero. En Codex, continuar cuando las herramientas de la conexión reportada queden expuestas a esta sesión.
