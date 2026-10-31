# Compactación conservadora de skills

`node scripts/compact-skills.mjs` prepara un plan **de solo lectura** para `skills/` del laboratorio. No cambia skills, configura clientes ni instala herramientas. Un resultado de cero es válido: algunas fuentes canónicas ya estaban compactadas aunque sus copias personales conservaban duplicados.

Para revisar una copia instalada:

```sh
node scripts/compact-skills.mjs --skills-root C:/ruta/skills
node scripts/compact-skills.mjs --skills-root C:/ruta/skills --json
```

Solo se inspeccionan los `SKILL.md` de subcarpetas inmediatas cuyo nombre existe en el catálogo canónico de Altiora. Se excluyen skills de terceros de `references/skill-sources.json` (también su historial `previously_imported`) y carpetas con `SOURCE.md` o un archivo LICENSE/LICENCE. No se siguen enlaces simbólicos/junctions ni archivos con varios enlaces físicos. Entradas ilegibles, no UTF-8 o mayores de 512 KiB se omiten con motivo.

La transformación elimina únicamente copias exactas posteriores de estas dos secciones generadas, dentro del mismo contexto H1:

- `## 2. Procedimiento Operativo Estándar (SOP Activo)`
- `## 3. Entregable Esperado (Output)`

Se conserva la primera aparición, el frontmatter, instrucciones únicas, enlaces y orden. Solo se ignoran los separadores vacíos al comparar el contenido de cada sección; no se normalizan espacios de sus instrucciones. Los encabezados dentro de bloques de código no cuentan. Un bloque de código o frontmatter sin cerrar mantiene el archivo completo sin cambios. Otros títulos, ejemplos y secciones repetidas quedan intactos. Esto no es un rediseño semántico de la skill ni una certificación de su comportamiento.

El mecanismo no interpreta HTML. Por precaución mantiene el archivo entero sin cambios si contiene cualquier carácter `<`, incluidos comentarios HTML, bloques HTML, etiquetas malformadas/sin cerrar, autolinks y ejemplos literales. Así un encabezado oculto en un comentario no puede provocar que se elimine la única copia visible de una instrucción. Algunas skills con comparaciones o placeholders también quedarán sin compactar: es una omisión conservadora deliberada.

## Aplicación explícita

Guardar el JSON íntegro del plan en una ruta privada dentro de este checkout, por ejemplo `out/compaction-plan.json`, y revisarlo. Usar redirección UTF-8 desde la terminal; el CLI no guarda un plan por defecto. Después:

```sh
node scripts/compact-skills.mjs --apply --plan-file out/compaction-plan.json
```

`--plan-file` debe apuntar a un archivo local dentro del checkout. El plan contiene la raíz instalada y hashes de origen/destino. Al aplicar se recalculan la propiedad canónica y la transformación; cambios de origen, de propiedad o de resultado interrumpen la operación. Nunca se usa texto de reemplazo suministrado por un plan. Los originales exactos y un manifiesto quedan en `.altiora-private/skill-compaction/<id>/`, ignorado en Git. No publicar esos respaldos ni planes: pueden contener instrucciones y rutas personales.

Las rutas y el directorio padre deben estar controlados por el propietario durante la operación. Las comprobaciones de hash previenen reemplazar una edición observada; no constituyen una transacción contra otro proceso hostil concurrente. Si una aplicación falla a mitad, el manifiesto registra los archivos ya aplicados; no se restauran automáticamente encima de posibles ediciones posteriores.

El informe mide bytes y caracteres retirados. `token_savings` es siempre `NOT_MEASURED`: menos texto no acredita consumo facturado, calidad semántica ni ejecución de agentes. Probar los casos de la skill pertinente y el descubrimiento del cliente aparte. Pruebas del mecanismo: `node --test scripts/compact-skills.test.mjs`.
