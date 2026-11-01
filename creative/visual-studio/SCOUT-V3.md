# Altiora Visual Tech Scout V3 — releases y mejora controlada

Estado: sistema de vigilancia en GitHub Actions, con auditoría y aprobación humana para adopción. No existe agente LLM ejecutándose continuamente por instalar documentación.

## Evolución

- El catálogo suplementario contiene **70 repositorios visuales curados** al 2026-10-30; 14 se agregaron en esta revisión después de comprobar existencia, actividad y licencia declarada en GitHub.
- El Scout ahora consulta **últimas versiones estables** en la API GitHub Releases para referencias P0/P1 y reconoce cambios desde una línea base. Repositorios sin releases exponen `release_tag=null`, sin fingir versiones.
- Una rama que carecía del campo `release_tag` no genera falsamente 40 actualizaciones: el primer escaneo enriquece datos y posteriores escaneos comparan versiones.
- Commits rutinarios de repositorios P0 **no** obligan a proponer PR. Se da prioridad a licencia, archivado, estado disabled, versiones nuevas y P0 revividos tras inactividad prolongada.
- El primer scan y las próximas revisiones guardan artefactos en GitHub Actions; creación de PR depende del permiso específico de GitHub para Actions. No se permite automerge.

## Cómo mejora continuamente el Director

1. El Scout genera señales (metadatos/releases) en un snapshot reproducible.
2. El [Director Audiovisual](agents/audiovisual-experience-director.md) filtra relevancia según objetivo, activos reales, soporte, costos y licencias, y selecciona 1–3 experimentos.
3. El especialista construye un piloto aislado; compara producción real, rendimiento móvil, render, aspectos legales y presupuesto frente al pipeline actual.
4. QA determina `ADOPT`, `HOLD` o `REJECT`; solo `ADOPT` con evidencia puede traducirse en dependencias de un proyecto.
5. El Director registra nuevas decisiones y actualiza playbooks por PR, no por modificar instalaciones globales silenciosamente.

## Criterios de revisión de releases

- ¿El cambio es del núcleo o experimental?
- ¿Contiene ruptura de API o compatibilidad Blender/React/Adobe/Three?
- ¿La licencia y dependencias siguen siendo aceptables para uso comercial?
- ¿Cambia calidad visual, estabilidad del render, costo por pieza o velocidad de iteración medidos?
- ¿Hay plan de rollback y versión fijada?

Señales no verificadas no representan CVE confirmado ni una recomendación de instalación. Revisar advisories y changelog oficial antes de decidir.

## Ejemplos

- **OpenEXR + OpenColorIO** cuando hay renders con múltiples pases y corrección de color entre Blender y editor.
- **RenderKit/oidn** cuando un render trazado muestra ruido y la versión/dispositivo lo soporta.
- **Three-mesh-bvh** solo si las consultas espaciales de un ambiente 3D pesan en la experiencia.
- **Krita/Synfig/Pencil2D** si el cliente pide motion ilustrado, no por defecto en videos de producto.
- **FFmpeg y LosslessCut** según operación: automatización por comandos vs corte manual.
