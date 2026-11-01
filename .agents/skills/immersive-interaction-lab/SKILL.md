---
name: immersive-interaction-lab
description: Diseña, implementa y audita interacción WebGL, cursor 3D y tipografía cinética inspirada en estudios experimentales como Buttermax, con fit check y degradación accesible. Úsala para estos efectos concretos; no para interfaces administrativas ordinarias.
---

# Immersive interaction lab

Extraer principios e interacción sin reproducir composición, identidad, assets ni código de un estudio. Complementa las skills existentes de diseño, Three.js y QA solo donde aporten; no carga toda la biblioteca.

## Decisión antes del efecto

Identificar tarea principal, marca, dispositivos, contenido y restricciones. Decidir entre experiencia inmersiva, acento visual o interfaz convencional. Inmersión suele encajar en estudios creativos, cultura, moda y lanzamientos con narrativa. En B2B funcional, checkout o dashboards priorizar tareas y usar efectos solo si ayudan. Accesibilidad AAA requiere evaluación por criterio, no equivale a prohibición universal de 3D. Documentar la decisión y cómo acceder directamente al contenido/CTA.

## Evidencia y lenguaje

Al investigar sitios, separar OBSERVADO (URL, fecha, captura/recurso o código), INFERIDO y PROPUESTO. No atribuir Three.js, GSAP, física real o un shader específico por una captura. Verificar paquetes/versiones/licencias si se incorporan. No copiar assets de referencia sin autorización/licencia. Una simulación de resorte no prueba que el sitio auditado use un motor físico.

## Diseño y arquitectura

Elegir una idea visual propia: contraste, tipografía expresiva, un gesto táctil y ritmo con descanso. Mantener texto significativo, navegación, enlaces y formularios en DOM semántico. El canvas decorativo no debe capturar interacción ni foco de controles. Evitar que tipografía superpuesta tape acciones o reduzca contraste.

Elegir Vite + Three.js + GSAP para una demo pequeña; R3F si el producto ya usa React; Next.js si necesita renderizado de contenido/rutas. No añadir todas las herramientas por defecto. GSAP coordina transiciones/scroll; un único propietario actualiza cada propiedad. Lenis es opcional: no secuestrar scroll ni duplicar RAF. WebGPU solo tras comprobar soporte y fallback; WebGL suele bastar para este alcance.

## Interacción estable

- Normalizar pointer respecto al viewport o contenedor real a [-1,1]. Usar pointer events, regresar al reposo al salir y limitar amplitud para no ocultar texto.
- Interpolar con tiempo: alpha = 1 - exp(-lambda * min(deltaSeconds, 0.05)); value += (target - value) * alpha. Elegir lambda por intención; no usar factor fijo por frame si se pretende consistencia a 60/120 Hz.
- Mantener coordenadas y objetos reutilizados fuera de renders de React; no setState en cada frame. Un único loop de render o ticker coordinado; limitar delta después de pestaña oculta.
- Para muelles, integrar con timestep estable/subpasos y límites; reservar motores físicos para colisiones o cuerpos necesarios. No introducir física para un simple parallax.
- prefers-reduced-motion, pointer coarse/touch, teclado y WebGL fallido deben conservar contenido/acciones. Reducir o detener movimiento según preferencia; no exigir hover o arrastre para obtener información esencial.
- Al desmontar: cancelar RAF/ticker, listeners y observers; revertir contexto GSAP; dispose de geometrías/materiales/texturas propias y renderer. No destruir recursos compartidos mientras otros los usan. Pausar trabajo fuera de vista/pestaña oculta y manejar resize/context loss.

## Rendimiento comprobable

Definir dispositivos y presupuesto antes de producir. 60 Hz ofrece ~16.7 ms por frame total; 60 FPS es objetivo, nunca garantía por técnica. Acordar presupuesto de carga, draw calls, memoria y percentiles de frame time por escena; medir antes/después. Empezar simple y ajustar DPR (p.ej. límite inicial 1.5), geometría, luces, sombras y postprocesado según perfil.

glTF/GLB es el contenedor de intercambio recomendado. Evaluar Draco o Meshopt para geometría frente al coste de decodificación; KTX2/Basis para texturas y soporte GPU; AVIF/WebP para DOM. Draco no comprime texturas. Reutilizar materiales/geometría; instancing para repetición; combinar mallas cuando no perjudique culling/interacción. Cargar diferido lo no visible, predecir recursos de la próxima escena, revisar licencias y evitar descargar todo al entrar. Medir renderer.info, red y memoria en escenas reales; triángulos y draw calls aislados no predicen FPS.

## Cierre verificable

Entregar fit check, mapa de interacción, código y comandos de ejecución, pruebas reales y límites. Verificar build, consola, mouse, reposo, resize, teclado, touch/coarse, reduced motion, WebGL ausente y teardown según alcance. Registrar navegador, viewport, hardware si disponible y si la prueba fue ejecutada o pendiente. No afirmar FPS, Lighthouse, mejora comercial ni acceso real a otra IA sin medición/ejecución.

## Roles y subagentes

Para trabajo sustancial que cruce investigación, arte y código, el coordinador usa los roles instalados immersive-director, immersive-motion-engineer e immersive-reviewer cuando existan herramientas reales y autorización. Asignar objetivo, entradas, archivos de propiedad, dependencias y criterio de cierre. No solapar escrituras ni revertir trabajo ajeno. El director coordina; implementación y revisión se ejecutan separadamente cuando la revisión depende del código. Paralelizar solo tareas independientes. Para cambios pequeños, trabajar directo. Si no existe delegación, hacer las etapas secuencialmente y declararlo; un rol escrito no es un agente ejecutándose. No iniciar servicios, gastos ni publicación por cargar esta skill.

Para documentación técnica actual consultar fuentes primarias: https://threejs.org/docs/ , https://gsap.com/docs/v3/ , https://r3f.docs.pmnd.rs/ , https://www.khronos.org/gltf/ , https://www.w3.org/TR/WCAG22/ . Para datos de Buttermax consultar la auditoría actual o inspeccionar de nuevo; esta skill no afirma su stack.
