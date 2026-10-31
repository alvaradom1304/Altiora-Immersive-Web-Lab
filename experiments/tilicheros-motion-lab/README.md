# Tilicheros · Cinematic Motion Pilot (Altiora Visual Studio)

**Estado:** implementación de código; la ilustración y el modelo Blender son conceptuales. No representa producto disponible, precio ni oferta. **No publicar como anuncio real** sin reemplazar los assets, verificar derechos y obtener aprobación.

## Qué construye

Un anuncio **vertical 1080×1920, 15 segundos, 30 fps**, reusable para negocios de gaming, anime, tecnología o regalos. Incluye cuatro beats solapados: **hook → reveal → propuesta → CTA**. Tiene fondos procedurales, movimiento por frames, tipografía cinética y opción de imagen PNG renderizada en Blender. Sin logos de terceros, música protegida ni afirmaciones de ventas.

Diseño: fondo oscuro, acento ultravioleta y cian, iluminación volumétrica simulada, producto flotante, retícula y partículas. **No es aún un render confirmado; solo código y una imagen conceptual.**

## Requisitos y licencia

- Node.js 20+ y npm; Remotion **4.0.539**. Direct dependencies fijadas; generar y conservar `package-lock.json` en la primera instalación revisada, antes de producción.
- Para CGI, Blender 4.x/5.x (opcional). No se necesitan addons.
- Remotion es *source-available*, no OSI open source. Comprobar condiciones comerciales y número de integrantes antes de usar o entregar código al cliente: [licencia](https://www.remotion.dev/docs/license) y [FAQ](https://www.remotion.dev/docs/license/faq).
- Para scripts de terceros, efectos Adobe, MCP, música e imágenes externas: revisar permisos, licencias y alcance antes de ejecutar.

## Primer uso local

Desde `experiments/tilicheros-motion-lab`:

```bash
npm install
npm run check
npm run studio
```

Para exportar **cuando hayas aprobado la licencia y los assets**:

```bash
npm run render
npm run still
```

Salida local a `out/` (ignorada por Git). **No se genera automáticamente un MP4 en este PR.** Remotion CLI puede requerir instalar un navegador compatible para renderizar.

## Sustituir el concepto por un producto real

1. Obtener foto/renders con autorización, medidas reales, producto exacto y especificaciones verificadas.
2. Poner imagen aprobada en `public/assets/product-approved.png`. El PNG con fondo transparente es recomendado para hero shots.
3. En `src/content.ts`, cambiar `productImage` a `assets/product-approved.png`; actualizar hook, CTA y oferta con datos confirmados.
4. Borrar o sustituir el disclaimer conceptual **solo si** las imágenes y afirmaciones ya corresponden al producto real; no ocultar que hay visuales artificiales cuando deban identificarse.
5. Ejecutar Studio, validar composición móvil y exportar la variante final.

**Nota:** si se anuncian auriculares tipo AirPods, no indicar que son Apple ni usar su marca salvo que sean auténticos y se pueda demostrar.

## Crear el hero 3D en Blender

```bash
blender -b --python blender/generate-concept.py -- --output public/assets/product-render.png --blend out/concept.blend
```

El script crea una **consola genérica conceptual**, cámara editorial, materiales PBR, iluminación de tres puntos y render transparente. No recrea modelos comerciales ni trae datos externos. Cambiar `productImage` por `assets/product-render.png` una vez que el archivo exista y haya sido visualmente revisado. El archivo `.blend` queda como fuente editable; no debe sustituir fotografía real engañando al consumidor.

## Pruebas y gates

- `node scripts/check-contract.mjs`: consistencia de composición/duración, disclaimer, assets, scripts y esquema de carpeta.
- `npm run typecheck`: TypeScript/React; solo funciona luego de `npm install`.
- `python -m py_compile blender/generate-concept.py`: sintaxis del script sin comprobar ejecución en Blender.
- **NO EJECUTADO AÚN**: render 3D Blender, export Remotion, test de legibilidad de 1080p, compatibilidad móvil, resultados comerciales.
- Antes de usar con clientes: validar permisos de assets, subtítulos, safe areas, formatos H.264, referencias de producto, derecho de uso de fuentes, licencias y archivos fuente.

## Mismo flujo para todas las IAs

Claude Code, Gemini/Antigravity y ChatGPT/Codex deben leer [Altiora Visual Studio](../../creative/visual-studio/README.md), [router](../../creative/visual-studio/ROUTER.md), [workflow](../../docs/workflows/visual-production-multi-ai.md) y `AGENTS.md` en raíz. Hay agentes ya existentes: creative-director, visual-producer, motion-designer, web-engineer y qa-reviewer. La IA que actúe debe leer el brief y el mismo contrato `src/content.ts` sin inventar producto, precios o resultados.

## Siguiente QA técnico

1. Revisar licencias y condiciones comerciales de Remotion para el escenario de Altiora.
2. Instalar dependencias en ambiente aprobado; fijar lockfile y ejecutar typecheck.
3. Renderizar una imagen PNG con Blender; probar reemplazo en Remotion.
4. Renderizar 15s en MP4 y revisar cortes, tipografía, contraste, tiempos y pérdida de calidad.
5. Registrar uso de CPU/GPU, tiempo de render, peso del video y resultado de controles.
