---
name: modular-docs-architect
description: Divide documentación Markdown monolítica en módulos ligeros con divulgación progresiva (índice, módulos y anexos bajo demanda) para reducir el consumo de tokens de agentes y evitar el context rot. Usar cuando un .md supere ~400 líneas, mezcle temas, cuando los agentes lean archivos enormes para una tarea pequeña o al ordenar docs/ y references/ de un proyecto.
metadata:
  version: 1.1.0
---

# Modular Docs Architect & Token Optimizer

Skill especializada en diseñar, reestructurar y dividir documentación Markdown (.md) extensa en arquitecturas modulares de **Divulgación Progresiva (Progressive Disclosure)**. Elimina el desperdicio de tokens al evitar que los agentes de IA tengan que leer archivos monolíticos gigantes de miles de líneas.

---

## 1. La Regla de Oro de los 3 Niveles (Progressive Disclosure)

Cualquier base de conocimiento o documentación de proyecto debe estructurarse en **3 niveles de profundidad**:

```text
proyecto-o-skill/
├── README.md o INDEX.md    # [NIVEL 1] Resumen ejecutivo + Tabla de contenidos (Max 150-250 líneas)
├── modules/ o references/  # [NIVEL 2] Módulos temáticos independientes (< 300 líneas cada uno)
│   ├── 01_arquitectura.md
│   ├── 02_guia_componentes.md
│   └── 03_estrategia_leads.md
└── deep-dives/             # [NIVEL 3] Fichas técnicas, esquemas extensos o logs históricos (Bajo demanda)
    ├── api_specs.md
    └── changelog_historico.md
```

### Tabla de Costo y Consumo de Tokens por Nivel
| Nivel | Qué contiene | Cuándo se lee | Consumo Típico de Tokens |
| :--- | :--- | :--- | :--- |
| **Nivel 1: Entrypoint** | Propósito, índice con enlaces markdown y estado actual | Al inicio de la tarea | ~200 – 600 tokens |
| **Nivel 2: Módulo Temático** | Instrucciones exactas para la subtarea activa | Solo si la tarea lo requiere | ~800 – 1,800 tokens |
| **Nivel 3: Deep Dive / Raw** | Datos exhaustivos, configuraciones o logs | Solo en depuración específica | 0 tokens (hasta que se pide) |

---

## 2. Criterios para Dividir un `.md` Monolítico

Si un archivo `.md` cumple **al menos uno** de los siguientes criterios, **DEBE SER DIVIDIDO**:
1. **Líneas**: Supera las **400 líneas** de texto continuo.
2. **Multi-temático**: Mezcla arquitectura de código, estrategia de marketing, guías de diseño y registros de estado en un solo documento.
3. **Frecuencia de consulta dispar**: El 80% de las consultas del agente solo necesitan el 10% del documento (ej. solo querías saber la paleta de colores y tuviste que leer 1,500 líneas de historia de la empresa).

---

## 3. Protocolo de División Quirúrgica de un Markdown

Cuando el usuario pida ordenar o dividir un archivo `.md` extenso:

### Paso 1: Mapeo de Secciones
Identificar los temas autónomos dentro del documento:
- `Introducción y Visión General`
- `Arquitectura Técnica y Modelos`
- `Estrategias de Negocio y CRO`
- `Fichas de Producto / Catálogo`
- `Historial y Changelog`

### Paso 2: Creación del Directorio Modular
Crear una carpeta `docs/` o `references/` con nombres semánticos numerados:
```bash
docs/
├── 01_vision_y_alcance.md
├── 02_arquitectura_tecnica.md
├── 03_experiencia_3d_y_canvas.md
└── 04_catalogo_y_sommelier.md
```

### Paso 3: Redacción del Índice Maestro (`INDEX.md` o `README.md`)
Reemplazar el archivo monolítico por un **Índice Maestro Liviano** que contenga:
1. Resumen en 1 párrafo.
2. Enlaces relativos a cada módulo (por ejemplo, a `docs/01_arquitectura.md`). Nunca rutas absolutas `file:///`: se rompen al clonar el repositorio en otra máquina.
3. Matriz de búsqueda rápida: *"Si necesitas modificar X, abre el módulo Y"*.

---

## 4. Política de Higiene del Espacio de Trabajo (Cero Basura)

Para evitar que herramientas de búsqueda de código (`grep`, `find`, `Get-ChildItem`) rastreen miles de archivos inútiles:
- **Archivos de Respaldo**: Eliminar siempre `.blend1`, `.bak`, `.tmp`, `~*.tmp`.
- **Confirmar antes de borrar**: listar lo que se eliminará y obtener aprobación si no es claramente generado o temporal.
- **Duplicados**: Si existe `web/docs` y `docs/` raíz con el mismo contenido, mantener solo el canónico y eliminar el clon.
- **Renders Intermedios**: Preservar solo los renders finales aprobados en `public/` y archivar o depurar los fotogramas de prueba desechados.

---

## 5. Entregable Esperado (Output)

1. Mapa de secciones del documento original con el módulo de destino de cada una.
2. Árbol de archivos propuesto (o creado) con líneas aproximadas por módulo.
3. `INDEX.md`/`README.md` liviano con enlaces relativos y matriz «si necesitas X, abre Y».
4. Verificación: ningún contenido perdido (comparar encabezados y bloques antes/después) y enlaces locales válidos (`npm run check` en este laboratorio).
5. Lista de archivos de basura detectados y acción tomada o pendiente de aprobación.
