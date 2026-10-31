# Playbook · Web Motion, Shaders & Immersive UX

**Cuándo:** web de alto impacto, ecommerce 3D, hero interactivo, scroll cinematográfico, logos y microinteracciones.

**Inputs:** objetivos de conversión, mapa UX, referencia estética, assets, presupuesto móvil, motor actual, accesibilidad, requisitos SEO.

## SOP

1. UX primero: contenido semántico, scroll, legibilidad y compra funcionan sin WebGL ni animación.
2. Elegir un motor 3D (Three/R3F **o** Babylon **o** PlayCanvas). No migrar por popularidad; validar compatibilidad con el stack cliente.
3. Para efectos, NO utilizar Lygia en proyectos comerciales sin autorización: su licencia Prosperity restringe el uso comercial; crear shaders propios o evaluar alternativas con licencia apta. Para GLSL/Slang verificar licencias y benchmark GPU. Preferir materiales simples cuando resuelvan el resultado.
4. Animación: un reloj; escoger GSAP **o** Motion **o** Anime.js/React Spring según necesidades. No sumarlos en un mismo elemento sin delimitación.
5. SVG: CSS básico; Rive para interactividad de estados; Lottie/dotLottie para playback; SVG.js cuando se necesite editar formas; evitar duplicados.
6. Web 3D: GLB validado, optimizado, texture atlases, mipmaps, KTX según destino; comprobar límites de móviles y fallback de imagen.
7. QA: Lighthouse/Web Vitals reales, batería/CPU, input/teclado, `prefers-reduced-motion`, WebGL fail, autoplay con consentimiento y conversiones funcionales.

**Herramientas candidatas:** Three/R3F/GSAP ya en base, Lygia, WebGL Noise, Slang, OGL, regl, Babylon, PlayCanvas, anime.js, React Spring, SVG.js; comparar antes de integrar.

**Entregables:** motion spec, diagrama de componentes, escena test, waterfall y FPS con entorno, fallback, checklist UX/accesibilidad, captura de prueba.

**Gate:** si la animación degrada el checkout o la performance, eliminarla o reducirla; calidad premium no equivale a saturación de efectos.

[Back to playbooks](README.md).
