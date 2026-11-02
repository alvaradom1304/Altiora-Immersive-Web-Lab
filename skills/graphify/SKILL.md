---
name: graphify
description: "Consulta un grafo de conocimiento del repositorio (código, y documentos solo con permiso) generado con Graphify para responder preguntas de arquitectura, dependencias y relaciones entre archivos sin releer todo el repo. Usar ante preguntas como «dónde se usa X», «qué depende de Y», «cómo se conecta A con B» o al orientarse en un repo grande. No instala nada ni conecta servicios."
---

# Graphify en Altiora

Graphify ([Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), Apache-2.0) convierte un repositorio en un grafo consultable: el código se analiza en local con tree-sitter y las consultas recorren el grafo sin releer los archivos. Esta skill es propia de Altiora; la skill original no se importa porque el escáner de seguridad la calificó DO_NOT_INSTALL (ver [revisión](../../docs/security/reviews/graphify-2026-11-01.md)).

## Herramienta instalada

- CLI `graphify` 0.9.100 en `C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify` (entorno aislado, versión fijada). Si no existe en la máquina actual, decirlo y no instalar nada sin permiso del usuario.
- Grafo vigente de este repo: `C:/Users/Usuario/.altiora-tools/graphs/altiora/graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). Fuera del repositorio; no se versiona.

## Reglas obligatorias

1. **Sin modelos por defecto.** Ejecutar siempre con `GRAPHIFY_BACKEND=none`. Sin esa variable, Graphify usa en silencio el CLI `claude` (la suscripción del usuario) o cualquier clave de API presente para nombrar comunidades o extraer documentos, lo que consume cuota y envía contenido fuera. Usar un modelo solo con aprobación expresa del usuario para esa ejecución.
2. **Solo código salvo permiso.** Generar con `--code-only`. Documentos, PDFs, imágenes o material de clientes solo con permiso, porque se envían a un modelo.
3. **No tocar configuración.** No ejecutar `graphify install`, `graphify claude install`, hooks, `--strict` ni nada que escriba en `CLAUDE.md`, `settings.json` u hooks: la integración de Altiora es esta skill.
4. **Comprobar frescura.** `GRAPH_REPORT.md` indica el commit de origen. Si difiere de `git rev-parse HEAD` y la respuesta depende de cambios recientes, actualizar con `graphify update` (sin modelo) o avisar.
5. **El grafo orienta, el archivo decide.** Confirmar en el archivo real (ruta y línea) antes de afirmar algo o editar.

## Uso

Consultas (desde la carpeta del grafo):

```bash
cd C:/Users/Usuario/.altiora-tools/graphs/altiora
GRAPHIFY_BACKEND=none C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify query "pregunta"
GRAPHIFY_BACKEND=none C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify path "NodoA" "NodoB"
GRAPHIFY_BACKEND=none C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify explain "Nodo"
```

Regenerar tras cambios grandes (solo código, sin modelo):

```bash
GRAPHIFY_BACKEND=none C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify extract <raíz-del-repo> --code-only --out C:/Users/Usuario/.altiora-tools/graphs/altiora
```

`.graphifyignore` en la raíz del repo excluye copias históricas y material de terceros para reducir ruido.

## Entregable

Una respuesta con el formato de `team/ROUTING.md` §5 que contiene: (1) la consulta ejecutada (`query`, `path` o `explain`) con `GRAPHIFY_BACKEND=none`; (2) los nodos o rutas relevantes devueltos; (3) los archivos confirmados leyendo el archivo real, con ruta y línea; (4) la frescura del grafo (commit de `GRAPH_REPORT.md` frente a `git rev-parse HEAD`); (5) los límites (grafo desactualizado, comunidades sin nombre, documentos no indexados). Una afirmación sin archivo confirmado se marca como no verificada.
