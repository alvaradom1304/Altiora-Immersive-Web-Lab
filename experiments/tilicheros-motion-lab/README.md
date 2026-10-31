# Tilicheros · Cinematic Motion Pilot (Altiora Visual Studio)

**Estado:** implementación de código; la ilustración y el modelo Blender son conceptuales. No representa producto disponible, precio ni oferta. **No publicar como anuncio real** sin reemplazar los assets, verificar derechos y obtener aprobación.

## Qué construye

Tres composiciones **verticales 1080×1920, 15 segundos, 30 fps**: gaming, anime y bebés; son variantes de un sistema reutilizable para productos aprobados. Incluye cuatro beats solapados: **hook → reveal → propuesta → CTA**. Tiene fondos procedurales, movimiento por frames, tipografía cinética y opción de imagen PNG renderizada en Blender. Sin logos de terceros, música protegida ni afirmaciones de ventas.

Dirección visual: gaming (cian y violeta cyber), anime (fantasía rosa y lavanda) y bebés (pasteles suaves, sin retícula cyber). Las tres ilustraciones son **conceptos originales**, no fichas de productos reales. GitHub Actions tiene pruebas de render: consultar el último run para su resultado, no asumir que han pasado.

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
npm run render           # Gaming
npm run render:anime     # Anime
npm run render:baby      # Bebés
npm run still            # Gaming
npm run still:anime      # Anime
npm run still:baby       # Bebés
```

Salida local a `out/` (ignorada por Git). El workflow de GitHub Actions genera previews conceptuales a escala reducida y los conserva temporalmente en artifacts si pasa. Remotion CLI puede requerir descargar un navegador compatible para renderizar en local.

## Sustituir el concepto por un producto real

1. Obtener foto/renders con autorización, medidas reales, producto exacto y especificaciones verificadas.
2. Poner imagen aprobada en `public/assets/product-approved.png`. El PNG con fondo transparente es recomendado para hero shots.
3. Para gaming, modificar `src/content.ts`; para anime o bebés, `src/variants.ts`. Reemplazar `productImage` con `assets/product-approved.png` y verificar hook, CTA y oferta con datos confirmados.
4. Borrar o sustituir el disclaimer conceptual **solo si** las imágenes y afirmaciones ya corresponden al producto real; no ocultar que hay visuales artificiales cuando deban identificarse.
5. Ejecutar Studio, validar composición móvil y exportar la variante final.

**Nota:** si se anuncian auriculares tipo AirPods, no indicar que son Apple ni usar su marca salvo que sean auténticos y se pueda demostrar.

## Crear el hero 3D en Blender

```bash
blender -b --python blender/generate-concept.py -- --output public/assets/product-render.png --blend out/concept.blend --size 1080 --samples 32
```

El script crea una **consola genérica conceptual**, cámara editorial, materiales PBR, iluminación de tres puntos y render transparente. No recrea modelos comerciales ni trae datos externos. Cambiar `productImage` por `assets/product-render.png` una vez que el archivo exista y haya sido visualmente revisado. El archivo `.blend` queda como fuente editable; no debe sustituir fotografía real engañando al consumidor.

## Pruebas y gates

- `node scripts/check-contract.mjs`: consistencia de composición/duración, disclaimer, assets, scripts y esquema de carpeta.
- `npm run typecheck`: TypeScript/React; solo funciona luego de `npm install`.
- `python -m py_compile blender/generate-concept.py`: sintaxis del script sin comprobar ejecución en Blender.
- **Pruebas automatizadas:** el CI incluye un render Blender CPU a 256px con archivo editable `.blend`, y tres MP4 de baja resolución. Consultar los jobs y artefactos antes de afirmar PASS.
- **NO PROBADO POR ESTOS TESTS:** calidad visual a 1080×1920, legibilidad en dispositivos reales, integración a Adobe/Blender local, datos comerciales, desempeño publicitario.
- Antes de usar con clientes: validar permisos de assets, subtítulos, safe areas, formatos H.264, referencias de producto, derecho de uso de fuentes, licencias y archivos fuente.

## Mismo flujo para todas las IAs

Claude Code, Gemini/Antigravity y ChatGPT/Codex deben leer [Altiora Visual Studio](../../creative/visual-studio/README.md), [router](../../creative/visual-studio/ROUTER.md), [workflow](../../docs/workflows/visual-production-multi-ai.md) y `AGENTS.md` en raíz. Hay agentes ya existentes: creative-director, visual-producer, motion-designer, web-engineer y qa-reviewer. La IA que actúe debe leer el brief y el mismo contrato `src/content.ts` sin inventar producto, precios o resultados.

## Siguiente QA técnico

1. Revisar licencias y condiciones comerciales de Remotion para el escenario de Altiora.
2. Instalar dependencias en ambiente aprobado; fijar lockfile y ejecutar typecheck.
3. Renderizar una imagen PNG con Blender; probar reemplazo en Remotion.
4. Renderizar 15s en MP4 y revisar cortes, tipografía, contraste, tiempos y pérdida de calidad.
5. Registrar uso de CPU/GPU, tiempo de render, peso del video y resultado de controles.

## Gates multi-formato y control comercial

| Concepto | ID Remotion | Arte conceptual | Estado de producto |
|---|---|---|---|
| Gaming | `TilicherosGamingDemo` | `assets/product-concept.svg` | NO VERIFICADO |
| Anime | `TilicherosAnimeDemo` | `assets/anime-concept.svg` | NO VERIFICADO |
| Bebés | `TilicherosBabyDemo` | `assets/baby-concept.svg` | NO VERIFICADO |

El diseño para bebés es para regalo/decoración conceptual; **no implica que el objeto sea apto para niños, seguro para cunas o cumpla normas de seguridad**. Cualquier producto infantil requiere verificación de edad, materiales, etiquetado y riesgos de asfixia antes de anunciarlo.

**Entrega multi-IA:** Claude Code, Gemini/Antigravity y ChatGPT/Codex utilizan el mismo repositorio, `AGENTS.md`, `creative/visual-studio/ROUTER.md` y `src/content.ts` / `src/variants.ts`. No se afirma acceso remoto a Adobe ni Blender sin instalar y autorizar sus herramientas. Todas las promesas de venta requieren validación independiente.
