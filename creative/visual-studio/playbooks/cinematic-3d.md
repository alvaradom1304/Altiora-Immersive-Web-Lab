# Playbook · Cinematic 3D & Blender Pipeline

**Cuándo:** escenarios inmersivos, renders de producto, piezas de marca CGI, 3D realista o assets para web.

**Inputs:** brief, referencias visuales, fotografías y medidas del artículo, paleta, destino (video vs web), presupuesto de render, plazos y permisos.

## SOP

1. Dirección creativa: shot list, focal, cámara, referencias de iluminación/ambiente y criterio de realismo. Separar arte conceptual de producto real.
2. Plan de escena Blender: colecciones legibles, unidades, geometría, modificadores no destructivos cuando proceda, materiales PBR y versiones del proyecto.
3. Iluminación realista: key/fill/rim, HDRI con derechos, sombras, roughness y texturas imperfectas físicamente plausibles. No usar imágenes de referencia como sustituto de geometría real.
4. Efectos: OpenVDB solo en renders offline si el ambiente lo requiere; en web preferir baked motion/video o shaders ligeros.
5. Gestión color: definir transform OCIO y reproducirlo entre pases y entrega. Guardar espacio de entrada/salida.
6. Export: video → PNG/EXR passes para comp; web → GLB con materiales/animaciones validados; USD solo para pipeline multicapa.
7. QA: glTF Validator, comparación visual antes/después de optimizar Draco/meshoptimizer, móvil y fallback. Medir GPU/tiempo/peso y verificar assets.

**Herramientas candidatas:** Blender, glTF Blender IO (existentes), glTF Transform (existente), OpenColorIO, MaterialX, OpenVDB, OpenUSD, Draco, glTF Validator, OpenImageIO, Filament. No instalarlas simultáneamente sin justificar.

**Entregables:** `scene.blend` editable, shotlist, manifests, texturas autorizadas, PNG/EXR/GLB, informe de iluminación y render, plan de fallback.

**Gate:** evidencia de Blender ejecutado y export inspeccionado; una captura de código no certifica resultado 3D. Registrar errores de hardware/denoiser y alternativas seguras. No asumir realismo cinematográfico sin revisión visual.

[Back to playbooks](README.md).
