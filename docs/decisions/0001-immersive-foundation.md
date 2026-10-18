# ADR 0001 — Base del laboratorio inmersivo

Fecha: 2026-10-18. Estado: **aceptada como dirección de investigación; versiones y rendimiento pendientes del prototipo**.

## Contexto

Altiora empieza sin archivos. La Central del Queso ya tiene una web Next/React en otro repositorio. Su catálogo, formulario de pedido, API de órdenes y salida a WhatsApp representan funcionalidad que debemos validar al integrar escenas.

## Decisión

1. Altiora guarda investigación, casos, experimentos y patrones originales.
2. HTML conserva navegación y comercio. WebGL mejora momentos concretos del relato.
3. Three.js renderiza; Fiber integra React; Drei aporta utilidades selectivas; GSAP coordina cámara y transiciones. glTF Transform prepara assets.
4. Scroll nativo primero. Lenis es opcional. Un único controlador evita conflictos con ScrollControls, ScrollSmoother o r3f-scroll-rig.
5. Repositorios externos se registran con commit y fuentes. No se importan como dependencias por el hecho de estar en el catálogo.
6. El sitio comercial se modifica después de aprobar técnicamente una prueba representativa y verificar sus pedidos. La implementación y revisión reversibles continúan con la autorización vigente.

## Opciones consideradas

| Opción | Valor | Coste | Resultado |
|---|---|---|---|
| Foto/video + HTML + animación | Gran control artístico y alternativa móvil viable | Requiere producción audiovisual | Base editorial y fallback |
| HTML + 3D selectivo | Cámara, objeto protagonista y entorno propio | Assets y medición GPU | Dirección preferida para probar |
| Mundo 3D completo como folio-2025 | Exploración espacial muy rica | Física, navegación, carga y accesibilidad complejas | Referencia; no primer alcance |
| Copiar react-three-next | Andamiaje rápido de canvas persistente | Dependencias y commit de 2024 | Estudiar arquitectura, no heredar plantilla |

## Consecuencias

La sensación cinematográfica dependerá del storyboard, luz y assets. Un portón geométrico provisional sirve para comprobar cámara, pero no valida el acabado premium.

Separar dos rutas de versiones: aplicación actual React 18 con Fiber 8 compatible, o laboratorio nuevo React 19/Fiber 9 con una versión de Next mantenida verificada al implementarlo. No mezclar pares ni instalar todos los candidatos.

Postprocesado, panel de ajustes y suavizado requieren una necesidad demostrada. Importar solo los módulos que se utilicen.

## Cómo se acepta la decisión en ejecución

Presentar el experimento 001 con evidencia de escritorio y móvil, fallback sin WebGL, movimiento reducido y navegación al catálogo. Registrar pesos transferidos, tiempos de carga, fluidez y equipo de medición. Si el 3D no mejora la experiencia dentro del presupuesto, mantener el recorrido editorial.
