# Proceso Altiora para experiencias inmersivas

## 1. Comprender y documentar

Leer el caso y la web existente. Confirmar hechos de la marca, datos de productos, acciones comerciales y assets disponibles. Registrar incógnitas sin inventarlas. Formular qué debe sentir y poder hacer la persona en cada momento.

Entregable: brief, inventario de assets y recorrido funcional actual.

## 2. Investigar con una pregunta concreta

Consultar references/repositories.json. Para cada patrón elegir una fuente, revisión, archivo o demo y explicar qué problema resuelve. Verificar licencia y estado técnico antes de reutilizar. Si una referencia no ayuda al resultado, retirarla de la prueba.

Entregable: ficha de experimento con fuentes enlazadas. Una colección de enlaces sola no valida una propuesta.

## 3. Dirigir la experiencia

Plantear tres direcciones breves: finca cinematográfica, editorial gastronómica y escenografía 3D selectiva. Comparar composición, paleta, tipografía, luz, cámara, complejidad y claridad de compra. Desarrollar la que mejor responda al caso con storyboard y material visual propio.

Entregable: propuesta visual y storyboard por escenas con transiciones motivadas.

## 4. Construir una prueba representativa

Implementar una sola secuencia corta antes de ampliar la finca. Empezar con HTML funcional, póster y catálogo accesible. Cargar el canvas progresivamente. Registrar las versiones exactas y lockfile al crear la app.

Tomar solo el patrón necesario de las referencias. No instalar todos los candidatos. No ejecutar scripts externos sin inspección. Asegurar desmontaje de efectos, recursos GPU y listeners.

Entregable: prueba local ejecutable, fuente identificada, alternativa móvil y movimiento reducido.

## 5. Medir y revisar

Criterios de producto:
- Identidad y contenido propios; no fingir que un recurso conceptual es una imagen documental.
- Catálogo accesible sin terminar el viaje; pedido y contacto visibles.
- Teclado, foco, contraste y enlaces de salto utilizables.
- Audio desactivado al entrar y control explícito si se añade.
- Sin WebGL o con contexto perdido, el contenido y las acciones siguen disponibles.
- Scroll y menú consistentes al cambiar tamaño, volver atrás o recargar.

Presupuestos iniciales propuestos, aún sin mediciones:
- LCP <= 2,5 s, INP <= 200 ms y CLS <= 0,1 como objetivos del sitio; separar laboratorio de datos reales.
- Primer recurso GLB <= 3 MB comprimidos y textura protagonista <= 2048 px como límites iniciales revisables.
- En móvil de prueba, buscar al menos 30 fps sostenidos durante el recorrido; registrar modelo, navegador y condiciones.
- Ninguna descarga 3D debe bloquear el catálogo HTML. Medir su transferencia diferida por separado.

Si el presupuesto falla, reducir assets, efectos o recorrido y comparar de nuevo. Los objetivos no son resultados.

## 6. Integrar y conservar lo aprendido

Portar el componente validado al proyecto comercial en un cambio revisable. Verificar categorías, selección de producto, cantidad, punto de retiro, precio, respuesta de la API y apertura de WhatsApp. Atribución comercial debe conservarse.

Guardar evidencia visual, métricas, diferencias con la versión anterior y decisión de continuar o descartar. Un patrón reutilizable incluye una explicación, una alternativa ligera y un límite de uso.

## Estados permitidos

**Diseñado → implementado → probado → listo para integrar → integrado.** Cambiar de estado requiere evidencia. No presentar una investigación o un storyboard como una experiencia implementada.
