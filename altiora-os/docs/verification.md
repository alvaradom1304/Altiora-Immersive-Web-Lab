# Evidencias de esta entrega

Fecha: 2026-10-18. Base de trabajo: `1f947f4c55366059691b288e8f361e3ce6ac6d80`. Rama: `feat/altiora-os-portable-agents`.

## Ejecutado

- `npm run check`: 16 referencias previas, 589 documentos con enlaces locales, manifiesto, instrucciones, grafos y fuentes fijadas válidos. Exportaciones Claude/Antigravity idénticas a los archivos canónicos.
- `node --test altiora-os/tests/core.test.mjs`: 11 pruebas, 11 PASS, 0 FAIL, 0 omitidas. Incluyen dependencias/ciclos, rutas fuera de alcance, contratos sin evidencia, resultados bloqueados, exportación en vacío, repetición, conservación de archivos diferentes y rechazo de junction/symlink.
- Plan del ejemplo generado para Claude y Antigravity en pruebas; ejemplo de resultado pendiente validado por CLI sin promoverlo a accepted.
- Exportación aplicada solo en esta rama: 16 skills de descubrimiento (ocho por host) y ocho agentes Claude; ocho definiciones canónicas y protocolo disponibles para lectura de roles en Antigravity.
- Revisión independiente estática de instrucciones y exportador. Se corrigió una dependencia faltante del protocolo en proyectos destino; la prueba ahora exige que se distribuya. Se añadieron baseline explícita para marketing y regresión de pedido antes/después en web.
- `git diff --check`: sin errores de whitespace al preparar la entrega.

La prueba de junction no podía crear su fixture dentro del sandbox inicial de Windows. Se repitió con ejecución local permitida y pasó; no se omitió el test ni se convirtió el error en éxito. Las pruebas eliminan únicamente sus carpetas temporales creadas por `mkdtemp`.

## Límites

No se ejecutaron Claude, Antigravity, Blender ni Higgsfield. La carga en clientes y diez escenarios de comportamiento de `tests/scenarios.md` están pendientes de ejecución nativa. La revisión de esos escenarios fue estática y no equivale a una prueba del modelo.

No se instalaron frameworks, conectaron APIs, crearon servicios ni activaron campañas. No se modificaron repositorios de clientes ni producción. No hay benchmark de FPS, ahorro, ventas o costes de inferencia.

La CI propuesta ejecuta checks en Linux y Windows con Node 22, actions fijadas por SHA y permisos de lectura. Su resultado remoto debe consultarse en el PR; las pruebas locales no se presentan como CI ya pasada.

El validador de skill-creator basado en Python no pudo usarse por falta de PyYAML; se verificaron los frontmatters simples, nombres, descripciones, rutas y exportaciones mediante las utilidades Node incluidas. No se afirma validación exhaustiva de sintaxis YAML arbitraria: manifiestos usan JSON válido en YAML 1.2.

Skills aplicadas al trabajo: altiora-agent-orchestrator, altiora-repository-research, skill-creator y altiora-quality-review. Se usaron un agente de investigación/autoría y un revisor independiente con ámbitos de archivos separados.
