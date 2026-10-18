# 6. Matriz Obligatoria de Herramientas, Conectores y Librerías

Para garantizar consistencia técnica y el estándar visual más alto en cada proyecto, se debe seleccionar e integrar las herramientas y conectores según el nivel de complejidad requerido.

---

## A. Entornos de Composición & No-Code / Low-Code Premium
- **Framer**: Para sitios editoriales, portfolios interactivos y landing pages con microinteracciones rápidas sin backend pesado.
- **Webflow**: Para proyectos escalables con CMS complejo y control estricto de estructura semántica.
- **Readymag**: Para experiencias puramente editoriales, revistas digitales y diseño asimétrico libre.
- **Spline**: Para prototipar, animar y exportar modelos 3D interactivos listos para incrustar mediante el `@splinetool/runtime`.

---

## B. Motor Frontend & Ecosistema de Renderizado (Proyectos Custom de Alto Impacto)
- **Framework Core**: Next.js (App Router) o React con TypeScript para tipado estricto y Server-Side Rendering (SSR).
- **Gráficos 3D & Shaders**:
  - **Three.js + React Three Fiber (`@react-three/fiber`)**: Para el pipeline 3D interactivo.
  - **Drei (`@react-three/drei`)**: Conectores para cámaras cinemáticas, controles de órbita, luces volumétricas y carga optimizada de modelos (`useGLTF`).
  - **GLSL Shaders**: Shaders personalizados para efectos de distorsión líquida, aberración cromática en hover y transiciones de pantalla con ruido procedural.
- **Fotorrealismo Espacial & Gaussian Splatting**:
  - **Luma WebGL SDK o SparkJS**: Conector para importar y navegar capturas volumétricas ultra realistas con bajo consumo de memoria.

---

## C. Conectores de Movimiento, Físicas e Interacción
- **Motor de Scroll & Animación**:
  - **GSAP + ScrollTrigger**: Conector indispensable para scrollytelling preciso milisegundo a milisegundo y timelines complejos fijados a la pantalla.
  - **Lenis (`@studio-freight/lenis` o `lenis/react`)**: Conector de scroll inercial suave para sincronizar animaciones CSS y Three.js sin desalineación visual.
  - **Framer Motion**: Para transiciones de rutas, modales, menús y microinteracciones de UI ligera.
- **Efectos e Interacciones Especiales**:
  - **Image Comparison Slider**: Implementación con `clip-path` SVG/CSS o shaders de cortina interactiva arrastrable (`pointer events` + `touch gestures`).
  - **Matter.js**: Conector de motor de físicas 2D en caso de requerir elementos flotantes, carpetas o stickers con colisión y gravedad interactiva.

---

## D. Regla de Selección de Herramientas en Cada Solicitud (Protocolo Obligatorio)
Antes de proponer una arquitectura o escribir código, el agente **DEBE**:
1. **Declarar la "Ficha de Stack"**: Especificar con exactitud el trío tecnológico (**Framework base + Motor de animación + Motor 3D/Canvas**).
2. **Justificar los conectores elegidos**: Demostrar técnicamente por qué esa combinación reduce la latencia, optimiza los fotogramas (**60–120 FPS estables**) y eleva la percepción de calidad del usuario final.
