# Experimento 001 — Del umbral a la mesa

**Estado:** diseñado, pendiente de implementación. **Fecha:** 2026-10-18.

## Hipótesis

Una entrada espacial breve y una transición continua hacia el queso pueden transmitir origen artesanal sin dificultar el acceso al catálogo. El 3D se conserva solo si mejora esa percepción dentro del presupuesto móvil.

## Fuentes

- [Entorno y pipeline de Bruno Simon](https://github.com/brunosimon/folio-2025/blob/41046b57eeed8d156d9c3fd7fa259900baef7816/readme.md).
- [Continuidad de objeto con Codrops](https://github.com/codrops/OneElementScroll/blob/feb7ad7fbc602b8cdbb5109da83442ff5995cdaf/README.md).
- [Integración React / Three](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/readme.md).

No se requiere copiar el mundo de Bruno Simon ni las imágenes de Codrops.

## Storyboard provisional

| Progreso orientativo | Escena | Movimiento | Acción disponible |
|---|---|---|---|
| 0–25 % | Portón al amanecer | Aproximación suave; letrero pendiente de validar | Ver productos |
| 25–55 % | Camino y vegetación | Cámara guiada, profundidad por capas | Saltar recorrido |
| 55–75 % | Indicio de elaboración | Acercamiento a un detalle visual; material real si existe | Ver historia / productos |
| 75–100 % | Mesa y queso protagonista | Transición por escala o continuidad del objeto | Explorar catálogo |

Estos porcentajes son decisiones de prueba; no tamaños finales de página ni duración obligatoria.

## Implementación prevista

HTML funcional y póster primero. Una escena 3D opcional, timeline determinista y acceso a catálogo en todo momento. Primera geometría puede ser provisional para validar cámara; el realismo debe evaluarse después con assets adecuados.

Comparar una variante editorial con una variante 3D. Scroll nativo primero. Usar la ruta React/Fiber compatible que se elija en el prototipo y documentarla.

## Comprobaciones de aceptación

- Navegar con teclado y llegar al catálogo sin completar la animación.
- Con movimiento reducido, mostrar composición estática y eliminar viajes de cámara.
- Sin WebGL, tras fallo de carga o pérdida de contexto, mantener imagen, texto y acciones.
- Registrar carga inicial y diferida, equipo móvil, fluidez y tamaño de assets.
- Comparar las dos variantes y explicar qué mejora la sensación de origen y la claridad de compra.

## Evidencia pendiente

Capturas escritorio/móvil, grabación breve, medición del dispositivo, versiones exactas, build y resultado de navegación. No hay un enlace de demo ni mediciones todavía.
