# Identidad del proyecto antes de publicar

`node scripts/project-identity.mjs --expected owner/repository` comprueba metadatos Git locales del directorio actual. Para otra carpeta controlada por el dueño, añadir `--project <ruta-absoluta>`. No deducir el destino esperado de `origin`: debe proceder del encargo o de una fuente de proyecto confirmada.

El comando consulta si existe un worktree, el `origin` configurado, si HEAD está asociado a una rama y si `git status` puede inspeccionar cambios **de archivos versionados**. Usa procesos sin shell, con tiempo/salida limitados, `--no-optional-locks` y el hook fsmonitor desactivado para esta consulta. No hace red, cambios de configuración, commits, conexiones ni publicaciones. No abre archivos de secretos por nombre ni imprime contenido de archivos; `git status` realiza su inspección local habitual.

## Estados

| Estado | Acción |
|---|---|
| `TARGET_NOT_CONFIRMED` | Falta un `owner/repository` explícito válido o el host esperado. Confirmar identidad antes de publicar. No inventar el repositorio de la empresa. |
| `WORKTREE_CHECK_FAILED` | Git no pudo comprobar worktree/status. Conservar el fallo y diagnosticarlo; un `origin` coincidente no sustituye esta comprobación. |
| `REMOTE_NOT_CONFIRMED` | Falta origin, no se pudo leer o su formato no está admitido. Revisar con el propietario. |
| `TARGET_MISMATCH` | Host o repositorio observado distinto del esperado. No publicar allí. |
| `WORKTREE_REVIEW_REQUIRED` | Hay cambios versionados o HEAD no está asociado a una rama confirmada. Revisar el estado antes de preparar la publicación. |
| `IDENTITY_CONFIRMED_NOT_PUBLISH_AUTHORIZATION` | Identidad coincidente, rama asociada y archivos versionados limpios según Git. Solo confirma este alcance local; no concede autorización. |

Salida 0 corresponde a identidad confirmada; salida 2 indica revisión pendiente. Salida 1 indica argumentos inválidos o un fallo no recuperable del comando. El campo `publication_authorized` siempre es `false`.

## Rutas remotas y privacidad

Se admiten remotos HTTPS, SSH URL y SSH estilo `git@host:owner/repo.git`. Se normalizan mayúsculas y el sufijo de transporte `.git`. Solo se devuelve host y `owner/repository`; se omiten usuario, contraseña, query, fragmento, errores crudos, nombres de ramas y rutas de archivos cambiados. El host esperado predeterminado es `github.com`; un host empresarial diferente exige `--expected-host <host-confirmado>`. Un dominio parecido no es una coincidencia.

No escanea archivos sin seguimiento, no busca secretos, no inspecciona su contenido y no verifica permisos o propiedad remotos. Un resultado favorable no valida tests, licencias, aprobación del cliente ni la selección de archivos que se publicaría. Un fallo de Git no demuestra por sí solo que un repositorio sea bare o que una configuración concreta sea la causa.

## Ejemplos

```sh
node scripts/project-identity.mjs --expected owner/repository
node scripts/project-identity.mjs --project C:/ruta/empresa --expected owner/repository
node --test scripts/project-identity.test.mjs
```

Los ejemplos usan marcadores: reemplazarlos por un destino ya confirmado. No reparar automáticamente remotos ni mover carpetas para forzar un resultado favorable. Esta herramienta no es un hook y no impide técnicamente que otro proceso ejecute una publicación; sirve como comprobación revisable dentro del flujo autorizado.
