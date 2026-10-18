# Altiora OS portable · 1.0.0

Ocho agentes y ocho skills originales, con contratos, planificación y exportación para Claude Code y Antigravity. Amplía la biblioteca existente sin reemplazarla. No incluye un daemon ni ejecuta modelos/API por sí solo.

- [Arquitectura y decisión](docs/architecture.md).
- [Coordinación y resultados](docs/protocol.md).
- [Investigación y licencias](docs/research.md).
- [Fuentes fijadas](sources.yaml).
- [Manifiesto](manifest.yaml).
- [Pruebas de comportamiento para el host](tests/scenarios.md).

Desde la raíz del laboratorio, Node 20 o posterior, sin instalar paquetes:

```sh
npm run os:check
node altiora-os/scripts/cli.mjs plan altiora-os/examples/task.json claude
node altiora-os/scripts/cli.mjs validate-result altiora-os/examples/result.json
node altiora-os/scripts/export.mjs --host all --target .
node altiora-os/scripts/export.mjs --host all --target . --apply
```

La exportación primero muestra el plan; `--apply` crea archivos ausentes. Incluye protocolo y roles en `altiora-os/`, además de las instrucciones del host, para que otro proyecto no dependa de esta copia del laboratorio. Si cualquier destino difiere, aborta antes de escribir. Los archivos idénticos se conservan. Se rechazan rutas con symlinks/junctions. Copiar a otro proyecto exige que ese directorio ya exista y que la sesión tenga permiso para escribir allí. No se tocan configuraciones globales.

En Claude Code, reabrir el proyecto y comprobar `/agents` y `/altiora-os-coordinate`. En Antigravity, comprobar descubrimiento de `altiora-os-coordinate` en el proyecto o pedir que lea su SKILL.md. Probar un escenario de `tests/scenarios.md` y registrar cliente, versión y resultado; hasta entonces la compatibilidad es documental más exportación comprobada, no ejecución nativa certificada.

Ejemplo de encargo: «Usa altiora-os-coordinate para investigar una experiencia premium de La Central del Queso. Trabaja solo en el laboratorio. Lee el brief del proyecto, identifica assets disponibles y entrega un experimento verificable antes de proponer integración comercial».

Para cambios posteriores: editar aquí los archivos canónicos. El exportador conserva destinos distintos y obliga a revisar diferencias manualmente; no hay sincronización destructiva. Para retirar el paquete, eliminar únicamente las rutas `altiora-os-*` creadas por la exportación tras verificar que no contienen cambios locales. No hay desinstalación automática.
