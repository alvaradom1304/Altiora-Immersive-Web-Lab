# Caso 001 — La Central del Queso

## Fuente existente

Repositorio comercial: [alvaradom1304/la-central-del-queso](https://github.com/alvaradom1304/la-central-del-queso).

Revisión inspeccionada: `a3a907163ad120fb5f5bb403d78a298de67d462a`. [Portada](https://github.com/alvaradom1304/la-central-del-queso/blob/a3a907163ad120fb5f5bb403d78a298de67d462a/src/web/app/page.tsx) y [catálogo](https://github.com/alvaradom1304/la-central-del-queso/blob/a3a907163ad120fb5f5bb403d78a298de67d462a/src/web/components/ProductCatalog.tsx) en `src/web`.

Se observó en código una portada de texto con CTA, historia, catálogo, formulario de pedidos que llama a /api/orders, redirección a WhatsApp y localizador de ferias. Esto es revisión de código, no una prueba de la API ni de una web desplegada.

## Visión del usuario

Crear un recorrido de la finca a la mesa: entrar por el portón, avanzar por el entorno, llegar a la lechería, conectar el proceso con el queso y terminar en una mesa que permite descubrir productos.

El nombre de finca, las prácticas de elaboración, la historia, precios y puntos de venta requieren confirmación con material del negocio antes de publicarlos. No inventar certificaciones ni usar material conceptual como prueba documental.

## Aplicación de las referencias

- **folio-2025:** estudiar organización del entorno, viento, iluminación y preparación de assets; adaptar un paisaje costarricense propio.
- **GSAP / Fiber:** cámara y capas editoriales coordinadas con el progreso.
- **OneElementScroll:** continuidad visual del producto al pasar del origen a la mesa.
- **Drei / glTF Transform:** cargar y preparar un queso GLB si un modelo realista aporta valor.
- **Scroll3DGrid:** estudiar perspectiva para una composición puntual, con fotografía propia.

Ver [comparación completa](../../docs/research/repository-review.md).

## Contenido y assets necesarios

| Recurso | Estado inicial | Uso |
|---|---|---|
| Logo e identidad aprobados | Pendiente de inventario | Encabezado, señalética y cierre |
| Fotos de finca y proceso | Pendiente de inventario | Veracidad, entorno y lechería |
| Fotos de productos | Pendiente de inventario | Catálogo y mesa |
| GLB o escaneo de queso | No verificado | Solo si mejora la presentación |
| Contacto, precios y ubicaciones | Presentes parcialmente en código; requieren validación | Flujo comercial |

## Alcance de la primera prueba

[Experimento 001](experiments/001-umbral-a-mesa.md): probar cámara, continuidad y acceso a catálogo con una secuencia breve. No reconstruir toda la finca ni migrar el comercio en esta fase.

Las decisiones de diseño deben comparar finca cinematográfica, editorial gastronómica y escenografía 3D selectiva. Elegir con una muestra visual y medición, no por el número de librerías instaladas.
