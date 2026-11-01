# Skill portable: CGI profesional, denoising, EXR y color

**Activa por intención:** producción Blender de alta fidelidad, ambiente cinematográfico, render de producto, VFX, compositing, assets 3D web derivados.

## Papel del Director Audiovisual
Decide si se necesita **3D realista** y si el uso de un motor de render aumenta el valor percibido del producto. Para producto físico, prioriza fotografías o archivos CAD autorizados; no inventa geometría o prestaciones comercialmente relevantes.

## SOP ejecutable por una IA con permisos reales

1. **Brief fotográfico**: formato destino, referencias, cámara, iluminación, acabado, presupuesto de render, fidelidad exigida.
2. **Activos autorizados**: escala correcta y CAD o fotografías; manifiesto de origen, permisos, textura y licencias.
3. **Blender**: geometría y PBR fieles, mapas normales/roughness con imperfecciones moderadas y física plausible; iluminación key, fill, rim; cámara, DOF y control de reflejos.
4. **Render maestro**: conservar color de escena y pases multilayer EXR cuando ayuden a corrección; documentar configuración de OpenColorIO/ACES y transformaciones antes de mezclar con footage.
5. **Denoising**: si el motor lo admite, evaluar RenderKit/oidn con pruebas A/B de detalle fino y ghosting temporal; no activar denoiser por asumir que CI/Blender lo tiene.
6. **Shading avanzado**: OpenShadingLanguage solo si el renderer y el material lo justifican. Para web, convertir y verificar visualmente PBR/glTF; OSL no se transpila automáticamente a WebGL.
7. **Entrega**: video → EXR/PNG → montaje aprobado → FFmpeg; web → glTF Blender IO → glTF Validator/Transform y fallback fotográfico.
8. **QA técnico**: comparar master vs export, espacio color, alpha, artefactos de denoising, consistencia temporal, sombras, memoria, duración de render y salida final; ejecutar en el destino real.
9. **Criterio de paro**: si el CGI tarda/cuesta más y no aporta claridad o fidelidad, escoger filmación real, plano 2.5D o visual estático.

## Repos de referencia
- [OpenEXR](https://github.com/AcademySoftwareFoundation/OpenEXR): rango dinámico y pases de render.
- [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO): gestión de color.
- [OpenShadingLanguage](https://github.com/AcademySoftwareFoundation/OpenShadingLanguage): shading offline.
- [Open Image Denoise](https://github.com/RenderKit/oidn): denoising que requiere compatibilidad.
- [Imath](https://github.com/AcademySoftwareFoundation/Imath): dependencia de pipeline, no efecto artístico.
- [Rez](https://github.com/AcademySoftwareFoundation/rez): versionado de entornos DCC cuando sea necesario.

Licencias y versiones deben revisarse para el caso de uso antes de instalar. No confundir referencia consultada con dependencia activada.

## Salida entre IAs
`creative_treatment.md`, `asset_manifest.json`, `render_settings.json`, `colorspace_spec.md`, `evidence.json` con estados `DESIGNED/RENDERED/TESTED` y rutas de fuentes verificadas. QA independiente valida antes de publicar.
