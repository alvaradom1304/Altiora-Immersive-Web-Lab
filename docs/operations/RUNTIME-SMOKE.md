# Prueba funcional aislada de adaptadores

El doctor estructural comprueba archivos y configuración. Este comando añade una prueba de la respuesta del handler Python ya revisado del kit local, sin iniciar conversaciones, modelos o servicios de Codex, Claude o Antigravity:

```sh
python scripts/runtime-smoke.py --project C:/ruta/proyecto-confiable --scratch-root C:/ruta/espacio-temporal-existente
python -m unittest discover -s scripts -p test_runtime_smoke.py
```

Ambas rutas deben ser absolutas, existentes y controladas por el propietario. `--project` debe contener un kit previamente revisado. Las pruebas de CI crean sus propios fixtures: no dependen de un proyecto o ruta del dueño.

## Qué ejecuta

1. Lee únicamente `.altiora/installation.json`, `.altiora/policy.json` y `.altiora/system/scripts/guard.py`, con límites de tamaño/UTF-8 y rechazo de enlaces/junctions, archivos con varios enlaces físicos y rutas enlazadas. No consulta archivos de secretos ni transcripciones.
2. Comprueba que SHA-256 del handler coincide con su entrada gestionada en el recibo. Ese recibo acredita integridad respecto al kit local, **no una auditoría ni autorización independiente**: revisar el código antes de usar un proyecto nuevo.
3. Crea una carpeta temporal bajo `--scratch-root`, copia la política como datos y los bytes exactos del handler comprobado. Así una modificación posterior del original no cambia el código que se ejecuta. El proyecto real y sus ajustes permanecen intactos.
4. Usa el intérprete Python actual con `-I -B`, entorno mínimo, sin shell, salida/tiempo limitados y ventana oculta en Windows. Nunca ejecuta cadenas de comandos de archivos de configuración. El handler revisado solo recibe inputs sintéticos y una ruta de proyecto temporal.
5. Para cada runtime comprueba seis casos: contexto de inicio, edición normal, denegación de `.env` ficticio, excepción `.env.example`, JSON malformado y payload no objeto. Los nombres son datos del protocolo; no se escribe ningún `.env` ni archivo de cliente.
6. Antes de limpiar, verifica que la ruta resuelta es la carpeta temporal nueva situada directamente bajo la raíz indicada. Los originales del proyecto no se eliminan ni modifican.

Esta es una prueba de un handler autocontenido; no instala dependencias. No es un sandbox de procesos: no ejecutar kits desconocidos o no revisados solo porque su recibo contiene un hash. El diagnóstico no solicita tareas de modelos ni llamadas a herramientas externas; tampoco monitorea toda actividad del sistema o demuestra ausencia de red de procesos ajenos.

## Interpretación

- `PASS`: los 18 casos del adaptador local respondieron como se esperaba con la política proporcionada.
- `FAIL`: hubo una decisión inesperada, fallo, cambio de la copia, timeout o salida inválida/excesiva. El informe no reproduce stdout/stderr crudos ni payloads. Un fallo de infraestructura detiene repeticiones y deja los runtimes restantes sin ejecutar.
- `KIT_NOT_PRESENT`: no hay handler en esa raíz; no se instala nada.
- `SOURCE_NOT_VERIFIED`: falta recibo/política válidos, hash no coincide o el archivo no puede leerse con seguridad. No se ejecuta el handler.
- `UNSAFE_LOCATION`: las rutas o límites no cumplen las condiciones. No se ejecuta el handler.

Salida 0 significa PASS; salida 2 indica que no se completó una verificación positiva. Las salidas conservan `native_discovery`, `native_trust` y las sesiones de cada runtime como `NOT_VERIFIED`. No prueban que un host haya cargado un hook, aceptado confianza o conectado un MCP. Las shell, herramientas MCP arbitrarias y herramientas desconocidas figuran como `NOT_COVERED`, nunca como protegidas por estos casos.

La validación no acepta una denegación de Codex `PreToolUse` si también contiene `continue`, `stopReason` o `suppressOutput`: esos campos no admitidos hacen fallar el hook aunque haya una denegación aparente, según [OpenAI Hooks](https://learn.chatgpt.com/docs/hooks). En el inicio de Codex/Claude, una respuesta con contexto no pasa si pide detenerse, incluye una razón de parada o usa un valor de `continue` distinto del booleano `true`. La ausencia de `continue` mantiene el comportamiento normal. Esto comprueba la coherencia de las respuestas de la prueba, sin activar confianza nativa.

Una política del propietario que cambie las excepciones puede producir un FAIL deliberado: revisar esa diferencia sin reescribir la política para forzar un PASS. No ampliar permisos, confiar hooks ni tocar cuentas como efecto lateral de esta prueba.
