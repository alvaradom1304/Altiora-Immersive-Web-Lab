# Selección de repositorios para Altiora

Revisión: **18 de octubre de 2026**, zona America/Costa_Rica.

## Conclusión

Para La Central del Queso proponemos una web HTML comercial con escenas 3D selectivas: **Three.js + React Three Fiber + Drei**, coordinadas con **GSAP / ScrollTrigger**. Preparar GLB con **glTF Transform**. El scroll nativo es el punto de partida; Lenis requiere una comparación posterior.

Esta es una elección para este proyecto, no una clasificación universal. Se contrastaron fuentes oficiales, README, metadatos y, en los casos de compatibilidad relevantes, package.json. No se ejecutaron todas las demos, no se revisó todo el código y no se midieron tiempos de carga o GPU. La selección técnica no sustituye la dirección artística ni la producción de fotografías y modelos propios.

## Cómo se eligieron

Criterios aplicados, por este orden:
1. Resolver una necesidad del recorrido finca → lechería → transformación → mesa.
2. Encajar con React/Next.js y permitir que catálogo y pedido sigan disponibles.
3. Ofrecer documentación o patrones de código comprensibles.
4. Tener actividad y compatibilidad que podamos comprobar; distinguir código histórico de una base actual.
5. Permitir estudiar o reutilizar el código bajo condiciones identificables.
6. Reducir complejidad, mantenimiento y coste de renderizado frente al valor visual obtenido.

Las estrellas son un indicador secundario de adopción. La fecha de la tabla corresponde al commit observado de la rama predeterminada, no a un juicio automático de abandono. Los commits completos y fuentes se guardan en el [catálogo](../../references/repositories.json).

## Comparación de 16 candidatos

| Repositorio | Papel en Altiora | Estrellas observadas | Commit de rama observado | Decisión |
|---|---|---:|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | Base | 116,578 | 2026-10-18 | adopt |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | Base | 33,051 | 2026-10-14 | adopt |
| [pmndrs/drei](https://github.com/pmndrs/drei) | Base | 9,979 | 2026-09-30 | adopt |
| [greensock/GSAP](https://github.com/greensock/GSAP) | Base | 29,402 | 2026-04-13 | adopt |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | Opcional | 16,656 | 2026-10-15 | evaluate |
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | Preparación de assets | 1,988 | 2026-10-16 | adopt |
| [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) | Preparación de assets | 5,882 | 2024-11-04 | evaluate |
| [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) | En espera | 985 | 2025-12-17 | hold |
| [pmndrs/react-three-next](https://github.com/pmndrs/react-three-next) | Referencia | 2,879 | 2024-04-21 | reference_only |
| [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | Opcional | 1,419 | 2026-10-12 | evaluate |
| [pmndrs/leva](https://github.com/pmndrs/leva) | Desarrollo | 6,254 | 2025-11-08 | evaluate |
| [motiondivision/motion](https://github.com/motiondivision/motion) | Alternativa | 34,291 | 2026-10-16 | evaluate |
| [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025) | Referencia | 1,951 | 2026-04-07 | reference_only |
| [brunosimon/folio-2019](https://github.com/brunosimon/folio-2019) | Referencia | 4,749 | 2024-05-06 | reference_only |
| [codrops/Scroll3DGrid](https://github.com/codrops/Scroll3DGrid) | Referencia | 183 | 2023-08-03 | reference_only |
| [codrops/OneElementScroll](https://github.com/codrops/OneElementScroll) | Referencia | 73 | 2024-11-20 | reference_only |

## Qué tomaremos de cada uno

### mrdoob/three.js

**Necesidad:** Motor 3D para finca y mesa; base utilizada por Fiber.

**Decisión:** adopt. **Licencia observada:** MIT.

**Límite o condición:** WebGL primero; WebGPU requiere una prueba separada. No instalar versiones desde la rama dev.

**Fuentes:** [README fijado](https://github.com/mrdoob/three.js/blob/0978e2b62e53654ebe1a2c3032ebee0a4981c701/README.md).

### pmndrs/react-three-fiber

**Necesidad:** Integrar escenas 3D como componentes React.

**Decisión:** adopt. **Licencia observada:** MIT.

**Límite o condición:** Fiber 8 corresponde a React 18; Fiber 9 a React 19. Resolver la combinación antes de instalar.

**Fuentes:** [README fijado](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/readme.md).

### pmndrs/drei

**Necesidad:** Carga de modelos GLB, cámaras y utilidades selectivas para escenas.

**Decisión:** adopt. **Licencia observada:** MIT.

**Límite o condición:** El package.json de master inspeccionado requiere React 19 y Fiber 9; la app actual es React 18. Seleccionar una release compatible o migrar por separado.

**Fuentes:** [README fijado](https://github.com/pmndrs/drei/blob/bf6f4addf47467d3885de272d94ca5127f6ef68f/README.md), [Evidencia 2](https://github.com/pmndrs/drei/blob/bf6f4addf47467d3885de272d94ca5127f6ef68f/package.json).

### greensock/GSAP

**Necesidad:** Timeline de cámara, transiciones y scroll con ScrollTrigger.

**Decisión:** adopt. **Licencia observada:** GSAP Standard No Charge.

**Límite o condición:** Licencia Standard No Charge, no MIT. Revisar el alcance si Altiora se convierte en un editor visual de animaciones.

**Fuentes:** [README fijado](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/README.md), [Evidencia 2](https://github.com/greensock/GSAP/blob/13e2b790546426a1a2e0e9b409f3f8dc6d6611f2/package.json), [Evidencia 3](https://gsap.com/community/standard-license/).

### darkroomengineering/lenis

**Necesidad:** Suavizar el desplazamiento si la comparación con scroll nativo demuestra una mejora.

**Decisión:** evaluate. **Licencia observada:** MIT.

**Límite o condición:** Una sola instancia y un solo reloj; evitar suavizar dos veces. Mantener scroll nativo en modo reducido.

**Fuentes:** [README fijado](https://github.com/darkroomengineering/lenis/blob/e01eefb1f55cd08bc051521d74f5f8182b71ee9d/README.md).

### donmccurdy/glTF-Transform

**Necesidad:** Inspección y optimización reproducible de GLB y texturas.

**Decisión:** adopt. **Licencia observada:** MIT.

**Límite o condición:** Comparar original y optimizado; algunas operaciones cambian calidad. No asumir una reducción fija.

**Fuentes:** [README fijado](https://github.com/donmccurdy/glTF-Transform/blob/8e2a94a2616d293c4b503d0fb6a4b42e6ec7c62f/README.md).

### pmndrs/gltfjsx

**Necesidad:** Convertir GLB en componentes editables cuando haga falta controlar nodos.

**Decisión:** evaluate. **Licencia observada:** MIT.

**Límite o condición:** El commit de la rama observada es de 2024. Probar con un modelo real antes de incorporarlo al proceso.

**Fuentes:** [README fijado](https://github.com/pmndrs/gltfjsx/blob/f4fbfa2a19ffa7c05b1a93745da7b4a7abd497f4/readme.md).

### 14islands/r3f-scroll-rig

**Necesidad:** Comparar la sincronización entre elementos HTML y un canvas compartido.

**Decisión:** hold. **Licencia observada:** MIT (LICENSE) / ISC (package.json).

**Límite o condición:** LICENSE declara MIT y package.json ISC en la revisión observada. Resolver la discrepancia antes de copiar código o distribuir. Evitar duplicar su controlador de scroll.

**Fuentes:** [README fijado](https://github.com/14islands/r3f-scroll-rig/blob/123663599e4b31af56f1845a19132d17e6a9b81f/README.md), [Evidencia 2](https://github.com/14islands/r3f-scroll-rig/blob/123663599e4b31af56f1845a19132d17e6a9b81f/package.json), [Evidencia 3](https://github.com/14islands/r3f-scroll-rig/blob/123663599e4b31af56f1845a19132d17e6a9b81f/LICENSE).

### pmndrs/react-three-next

**Necesidad:** Estudiar persistencia de canvas y convivencia de DOM/3D en Next.js.

**Decisión:** reference_only. **Licencia observada:** MIT.

**Límite o condición:** El commit observado es de abril de 2024; usa Next 14 y React 18. No usarlo como plantilla actual ni heredar sus resultados Lighthouse.

**Fuentes:** [README fijado](https://github.com/pmndrs/react-three-next/blob/bb29a61949601e1c563688faf33a12d062ec3710/README.md), [Evidencia 2](https://github.com/pmndrs/react-three-next/blob/bb29a61949601e1c563688faf33a12d062ec3710/package.json).

### pmndrs/react-postprocessing

**Necesidad:** Acabado visual selectivo de la mesa y el producto.

**Decisión:** evaluate. **Licencia observada:** MIT.

**Límite o condición:** Master requiere React 19 y Fiber >=9.7.0. Efectos apagados por defecto hasta medir GPU en móvil.

**Fuentes:** [README fijado](https://github.com/pmndrs/react-postprocessing/blob/3db2d24dc343e73e5a52786ba2f0223ffc0aef1a/README.md), [Evidencia 2](https://github.com/pmndrs/react-postprocessing/blob/3db2d24dc343e73e5a52786ba2f0223ffc0aef1a/package.json).

### pmndrs/leva

**Necesidad:** Ajustar luz, cámara y materiales durante los experimentos.

**Decisión:** evaluate. **Licencia observada:** MIT.

**Límite o condición:** Solo desarrollo; verificar compatibilidad y excluir el panel del producto publicado.

**Fuentes:** [README fijado](https://github.com/pmndrs/leva/blob/402a1e9d0899e6d384993aaffe8dc0d2c39110e1/README.md).

### motiondivision/motion

**Necesidad:** Animación de interfaz React y alternativa para movimiento 2D.

**Decisión:** evaluate. **Licencia observada:** MIT.

**Límite o condición:** No agregar como segundo motor para controlar la misma cámara o el mismo scroll.

**Fuentes:** [README fijado](https://github.com/motiondivision/motion/blob/2d27b041114f5f1cffc1f6d3ad522929ce0cc41f/README.md).

### brunosimon/folio-2025

**Necesidad:** Estudiar entorno vivo, secuencia de actualización, vegetación y pipeline Blender/GLB.

**Decisión:** reference_only. **Licencia observada:** MIT.

**Límite o condición:** Es un mundo interactivo con física; no trasladar su complejidad ni ejecutar su npm install --force. Assets requieren revisión de procedencia independiente.

**Fuentes:** [README fijado](https://github.com/brunosimon/folio-2025/blob/41046b57eeed8d156d9c3fd7fa259900baef7816/readme.md).

### brunosimon/folio-2019

**Necesidad:** Referencia histórica de navegación espacial y descubrimiento por zonas.

**Decisión:** reference_only. **Licencia observada:** MIT.

**Límite o condición:** Estética estilizada y código antiguo; no es modelo de finca fotorrealista ni base de comercio.

**Fuentes:** [README fijado](https://github.com/brunosimon/folio-2019/blob/540f13573a6da282eae942a4c67335b97cd18970/readme.md).

### codrops/Scroll3DGrid

**Necesidad:** Estudiar composición editorial, profundidad y cambios de perspectiva al hacer scroll.

**Decisión:** reference_only. **Licencia observada:** MIT.

**Límite o condición:** Demo de 2023. Extraer un patrón puntual y reemplazar imágenes; no convertir todo el catálogo en una cuadrícula animada.

**Fuentes:** [README fijado](https://github.com/codrops/Scroll3DGrid/blob/69718a2eff87b32ab19764b3a6d7b3773dab6af3/README.md).

### codrops/OneElementScroll

**Necesidad:** Estudiar continuidad de un objeto entre escenas con Flip y ScrollTrigger.

**Decisión:** reference_only. **Licencia observada:** MIT.

**Límite o condición:** Demo de 2024; aplicar a una transición de producto, mantener lectura y pedido accesibles.

**Fuentes:** [README fijado](https://github.com/codrops/OneElementScroll/blob/feb7ad7fbc602b8cdbb5109da83442ff5995cdaf/README.md).


## Compatibilidad que cambia la decisión

La [web existente](https://github.com/alvaradom1304/la-central-del-queso/blob/a3a907163ad120fb5f5bb403d78a298de67d462a/src/web/package.json) declara Next `^14.2.24` y React `^18`. Son rangos del manifiesto inspeccionado, no una instalación local verificada.

El [README de Fiber](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/readme.md) empareja Fiber 8 con React 18 y Fiber 9 con React 19. Los package.json inspeccionados de [Drei](https://github.com/pmndrs/drei/blob/bf6f4addf47467d3885de272d94ca5127f6ef68f/package.json) y [react-postprocessing](https://github.com/pmndrs/react-postprocessing/blob/3db2d24dc343e73e5a52786ba2f0223ffc0aef1a/package.json) requieren React 19 en sus ramas actuales. Por tanto:

- Para un experimento sobre la web actual: seleccionar releases de Fiber 8 y Drei compatibles con React 18, comprobar peers y registrar versiones exactas.
- Para un laboratorio nuevo: evaluar una combinación mantenida de Next/React 19/Fiber 9, fijar versiones y validarla antes de portar componentes.
- No instalar indiscriminadamente las últimas versiones ni usar `--force` o `--legacy-peer-deps` para ocultar conflictos.
- La decisión definitiva de versiones pertenece al primer prototipo; esta entrega no crea un manifiesto de runtime para la web.

## Licencias y procedencia

[GSAP Standard No Charge](https://gsap.com/community/standard-license/) permite uso comercial en sitios bajo sus términos, pero restringe ciertos editores visuales de animación que compitan con Webflow. Para la web del queso es un candidato razonable; si cambia el producto de Altiora, reevaluar su alcance. No clasificar GSAP como MIT.

En r3f-scroll-rig, [LICENSE](https://github.com/14islands/r3f-scroll-rig/blob/123663599e4b31af56f1845a19132d17e6a9b81f/LICENSE) dice MIT y [package.json](https://github.com/14islands/r3f-scroll-rig/blob/123663599e4b31af56f1845a19132d17e6a9b81f/package.json) dice ISC. Se registra como **hold**, pendiente de aclarar antes de copiar o distribuir. Puede estudiarse la idea de sincronización sin incorporarlo.

Los README de las dos demos Codrops atribuyen imágenes a Midjourney. Se estudia el comportamiento; se reemplaza el material visual por assets propios o con permiso y procedencia registrados.

## Patrones elegidos para la finca

| Momento | Patrón a estudiar | Fuente | Adaptación propia |
|---|---|---|---|
| Portón y camino | Entorno vivo organizado por sistemas | folio-2025 | Vegetación e iluminación selectivas, cámara guiada; no construir un juego de conducción |
| Llegada a lechería | Timeline de estados por progreso | GSAP + Fiber | La cámara y el texto comparten hitos; acceso al catálogo durante el recorrido |
| Del origen a la mesa | Continuidad de un objeto | OneElementScroll | Una pieza o imagen acompaña la transición, sin reproducir el diseño de la demo |
| Exploración del producto | Profundidad editorial | Scroll3DGrid + Drei | Fotografía protagonista y GLB puntual; evitar convertir todo el catálogo en efectos |
| Versión móvil | Mejora progresiva | r3f-scroll-rig como referencia conceptual | HTML completo y póster; WebGL opcional según prueba de capacidad |

**Próximo paso definido:** [experimento 001](../../projects/la-central-del-queso/experiments/001-umbral-a-mesa.md). Ningún resultado visual o comercial se da por validado todavía.


## Ampliación: assets, calidad y medición (18 de octubre de 2026)

La primera selección cubría la escena. Faltaban piezas para que llegue ligera al móvil, para probar el pedido y para medir resultados. Se añadieron 9 repositorios con los mismos criterios y con commit fijado en el [catálogo](../../references/repositories.json).

| Repositorio | Necesidad | Estrellas observadas | Commit observado | Decisión |
|---|---|---:|---|---|
| [google/model-viewer](https://github.com/google/model-viewer) | Mostrar un queso o producto en 3D/AR dentro del catálogo con un componente accesible, sin escena completa. | 8,278 | 2026-10-09 | evaluate |
| [zeux/meshoptimizer](https://github.com/zeux/meshoptimizer) | Comprimir geometría GLB (gltfpack / EXT_meshopt_compression) para que la finca cargue en móvil. | 8,581 | 2026-10-14 | adopt |
| [KhronosGroup/KTX-Software](https://github.com/KhronosGroup/KTX-Software) | Convertir texturas a KTX2/Basis para reducir memoria de GPU en las escenas. | 1,385 | 2026-10-18 | evaluate |
| [microsoft/playwright](https://github.com/microsoft/playwright) | Probar el flujo de catálogo → carrito → pedido por WhatsApp y capturar regresiones visuales en móvil y escritorio. | 98,009 | 2026-10-17 | adopt |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | Auditoría automática de accesibilidad dentro de las pruebas de Playwright. | 7,666 | 2026-10-15 | adopt |
| [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) | Aplicar en CI los presupuestos de quality/performance-budgets.md a cada vista previa. | 7,114 | 2026-10-17 | evaluate |
| [GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals) | Medir LCP, INP y CLS reales de los visitantes para la fase M6 de aprendizaje. | 8,648 | 2026-10-16 | adopt |
| [utsuboco/r3f-perf](https://github.com/utsuboco/r3f-perf) | Ver draw calls, memoria de GPU y FPS mientras se ajustan las escenas de Fiber. | 780 | 2024-11-08 | evaluate |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | Coreografiar cámara y objetos con un editor de líneas de tiempo para el recorrido finca → mesa. | 12,777 | 2024-04-11 | hold |

### google/model-viewer

**Decisión:** evaluate. **Paquete:** `@google/model-viewer`. **Licencia observada:** Apache-2.0.

**Límite o condición:** Web component independiente de Fiber: no mezclar con el canvas principal. Medir peso del GLB y del paquete antes de usarlo en tarjetas de catálogo.

**Fuentes:** [README fijado](https://github.com/google/model-viewer/blob/adc877c66f97e1498d8b19a8850976aee3d0197f/README.md).

### zeux/meshoptimizer

**Decisión:** adopt. **Paquete:** `meshoptimizer`. **Licencia observada:** MIT.

**Límite o condición:** Requiere decodificador en el cliente (MeshoptDecoder de three). Comparar calidad visual antes y después de cada compresión.

**Fuentes:** [README fijado](https://github.com/zeux/meshoptimizer/blob/f0a684f11ead064e176775c9b796f82a55910e92/README.md).

### KhronosGroup/KTX-Software

**Decisión:** evaluate. **Paquete:** herramienta de línea de comandos. **Licencia observada:** Apache-2.0 principal con componentes de terceros (ver LICENSES/).

**Límite o condición:** Herramienta de línea de comandos con varias licencias de terceros (Apache-2.0 principal, ver LICENSES/). Requiere KTX2Loader y transcoder en el cliente.

**Fuentes:** [README fijado](https://github.com/KhronosGroup/KTX-Software/blob/cdc486626023185104cbda24aa2dcccc43044b8e/README.md).

### microsoft/playwright

**Decisión:** adopt. **Paquete:** `@playwright/test`. **Licencia observada:** Apache-2.0.

**Límite o condición:** Las capturas de WebGL varían por GPU: comparar con tolerancia o probar la alternativa estática. Mantener las pruebas fuera del bundle.

**Fuentes:** [README fijado](https://github.com/microsoft/playwright/blob/b335271cdc2b57cac2be8ad37c5dd283ac6b8938/README.md).

### dequelabs/axe-core

**Decisión:** adopt. **Paquete:** `@axe-core/playwright`. **Licencia observada:** MPL-2.0.

**Límite o condición:** Detecta solo una parte de los problemas WCAG; no sustituye revisión con teclado y lector de pantalla. Licencia MPL-2.0 para modificaciones del propio motor.

**Fuentes:** [README fijado](https://github.com/dequelabs/axe-core/blob/f01bf5ce56ffcf1411d14d14ed75d1fb86f8023c/README.md).

### GoogleChrome/lighthouse-ci

**Decisión:** evaluate. **Paquete:** `@lhci/cli`. **Licencia observada:** Apache-2.0.

**Límite o condición:** Mediciones de laboratorio con variación entre ejecuciones: usar varias corridas y no tratarlas como datos de campo.

**Fuentes:** [README fijado](https://github.com/GoogleChrome/lighthouse-ci/blob/a3d0ff8a49501c88ccec7a054f588c1ee1ff934f/README.md).

### GoogleChrome/web-vitals

**Decisión:** adopt. **Paquete:** `web-vitals`. **Licencia observada:** Apache-2.0.

**Límite o condición:** Enviar métricas solo con consentimiento y sin datos personales. Son datos de campo, distintos de Lighthouse.

**Fuentes:** [README fijado](https://github.com/GoogleChrome/web-vitals/blob/e773747b90f0e8763aed02ba5a74358d628a828c/README.md).

### utsuboco/r3f-perf

**Decisión:** evaluate. **Paquete:** `r3f-perf`. **Licencia observada:** MIT.

**Límite o condición:** Solo en desarrollo. Última actividad en 2024: comprobar compatibilidad antes de migrar a Fiber 9.

**Fuentes:** [README fijado](https://github.com/utsuboco/r3f-perf/blob/752adc19edbcabc43fc917519c5366718fa0b9d0/README.md).

### theatre-js/theatre

**Decisión:** hold. **Paquete:** `@theatre/core`. **Licencia observada:** Apache-2.0.

**Límite o condición:** Sin cambios en la rama principal desde 2024 y versión 0.x: no adoptar sin revisar mantenimiento. GSAP ya cubre timeline y scroll.

**Fuentes:** [README fijado](https://github.com/theatre-js/theatre/blob/6ea82b938ea49609489f6377ded693ccc6ee8f5b/README.md).

## Hallazgos en la web actual

Revisión de `package.json` de [la-central-del-queso](https://github.com/alvaradom1304/la-central-del-queso) (rama `hito2-exterior-realista`):

- `@studio-freight/react-lenis` está marcado como obsoleto en npm: el paquete ahora es `lenis` (con `lenis/react`). Migrar en el mismo cambio que la evaluación de Lenis frente al scroll nativo.
- `framer-motion` se publica ahora también como `motion` (misma versión, 14.3.0 al revisar). No urge migrar. Evitar tener ambos paquetes instalados.
- Next 14.2.3 con React 18, Fiber 8 y Drei 9 forman una combinación coherente. Las versiones de master de Drei piden React 19 (ver arriba), así que no actualizar Drei aislado.
- No hay pruebas automatizadas ni medición de Web Vitals: Playwright + axe-core y web-vitals son la primera incorporación propuesta.

## Skills externas incorporadas

Además de los repositorios, se copiaron 14 skills de terceros con licencia y procedencia (`SOURCE.md` en cada una; registro en [skill-sources.json](../../references/skill-sources.json)):

| Origen | Skills | Para qué en Altiora |
|---|---|---|
| anthropics/skills (Apache-2.0) | webapp-testing, skill-creator | Probar la web local con Playwright; crear y evaluar skills dentro del ciclo PDCA |
| vercel-labs/agent-skills (MIT) | web-design-guidelines, vercel-composition-patterns | Revisar UI contra reglas fijadas; componentes React mantenibles |
| coreyhaines31/marketingskills (MIT) | events, referrals, offers, emails, schema, ab-testing, analytics | Ferias, referidos y reseñas, cajas de regalo, correos B2B, datos estructurados, experimentos y GA4 |
| obra/superpowers (MIT) | writing-plans, systematic-debugging, verification-before-completion | Planificar, depurar por causa raíz y no declarar terminado sin evidencia |

También se añadió la licencia y procedencia que faltaban a cro, free-tools, lead-magnets y marketing-psychology, importadas antes de marketingskills. Las skills nuevas están asignadas a los agentes en [team/agents.json](../../team/agents.json).
