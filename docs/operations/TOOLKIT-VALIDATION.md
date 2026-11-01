# Afilado de herramientas: evidencia

Fecha: 2026-10-31. Encargo: mejorar herramientas, skills, agentes/subagentes, superpoderes y MCP de Altiora. Las mejoras apoyan el trabajo empresarial; no se pretende completar ventas ni autenticar servicios mediante documentación.

## Cambios comprobados

1. **Reducción mecánica de repeticiones.** Se encontraron secciones SOP/Entregable duplicadas en copias instaladas, aunque el catálogo canónico ya estaba limpio. Se aplicaron planes revisados con hashes, respaldo exacto y comprobación posterior. Se modificaron 390 archivos de skills instaladas: 132 en una biblioteca personal, 132 en otra y 126 en el proyecto empresarial. Se retiraron 294.450 bytes / 288.990 caracteres exactamente redundantes. Las otras tres raíces revisadas no necesitaban ese cambio. Son copias de capacidades, no 390 capacidades nuevas. Token savings: NOT_MEASURED.
2. **Descubrimiento del proyecto.** Se incorporaron cinco capacidades pertinentes —Bibliotecario, coordinador, revisor, diagnóstico empresarial y Company Builder— mediante el instalador existente, conservando recursos y variantes anteriores. El doctor estructural pasó con 72 archivos gestionados. Un catálogo privado de 179 entradas de metadatos localizó al Bibliotecario como primer candidato; esto no acredita que una sesión de cada cliente lo haya cargado.
3. **Contexto y continuidad.** Se completó el manifiesto activo del proyecto con objetivo/aceptación y se generó un traspaso validado; la plantilla de sistema se conservó. Los datos privados de negocio y rutas concretas permanecen locales. No se modificó Git de la empresa.
4. **Identidad antes de publicar.** Nueva comprobación local de destino explícito, host, worktree, estado y rama. Evita dar por confirmado un destino por el mero contenido de origin. Omite credenciales, errores crudos y nombres de archivos; no es un escáner de secretos ni un hook que impida técnicamente a terceros hacer push.
5. **MCP de coordinación real.** `altiora_shared` devolvió sus raíces autorizadas y completó una lectura/escritura/lectura coherente de un registro de estado. Su índice común ahora enlaza ese registro. El directorio de coordinación continúa separado del código y de los estados de clientes. No se amplió ninguna raíz ni permiso del servidor.

## Pruebas del mecanismo

- Compactación: 13 pruebas aprobadas, incluidos permisos distintos que no se compactan, ejemplos arbitrarios, encabezados en código/frontmatter, HTML, recursos, fuente desactualizada, plan alterado, terceros, junctions y hardlinks.
- Identidad: ocho pruebas aprobadas, incluidos destino ausente, repo/host distinto, credenciales en URL, fallo de Git, cambios y HEAD separado; nunca concede autorización de publicación.
- Bibliotecario existente: 16 pruebas aprobadas. Su suite de recuperación se conserva; no se altera la semántica de skills para mejorar una puntuación.
- Sistema del proyecto: doctor y handoff-check aprobados. Los informes y respaldos locales no se incorporan al repositorio público.

La reducción conserva la primera aparición de cada sección idéntica y no elimina instrucciones únicas. Las pruebas del mecanismo y la revisión de diferencias no certifican obediencia de cientos de skills ni calidad comercial. Las skills externas y el plugin Superpowers se conservaron.

La revisión independiente detectó un caso en que un encabezado oculto dentro de HTML podía hacer retirar la copia visible. Se reprodujo antes de corregirlo; el mecanismo ahora conserva íntegro cualquier archivo con `<`, una omisión deliberadamente conservadora. Se comprobaron los 390 originales y hashes de los archivos aplicados; no contenían comentarios HTML. También se corrigió la comprobación de catálogo para no interpretar respaldos privados y salidas generadas como documentación publicada.

## Límites reales

GitHub se ha utilizado en este laboratorio y el MCP de archivos se verificó solo en su ámbito de coordinación. Las sesiones de Claude/Gemini/Antigravity y sus autenticaciones siguen sin certificarse. Adobe After Effects no quedó detectado con las consultas disponibles. Blender local produjo un PNG conceptual y una fuente reabierta, sin equivaler a un MCP conectado.

No se instalaron colecciones, motores, modelos ni servidores nuevos. No se cambiaron cuentas, permisos ni remotos de la empresa. La continuidad ocurre dentro de sesiones autorizadas y del traspaso guardado; no hay ejecución garantizada con el chat cerrado. Para uso, consultar [operación compartida](SHARED-OPERATIONS.md).
