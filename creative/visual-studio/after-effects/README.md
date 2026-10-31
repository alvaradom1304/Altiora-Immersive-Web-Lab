# Acceso verificable a Adobe After Effects · Altiora

**Estado al 30/10/2026:** código de puente local y scripts preparados; conexión real con la aplicación de tu computadora **NO VERIFICADA**. No es un MCP instalado ni un acceso remoto concedido por tener este repositorio.

## Dos rutas separadas

**Ruta A: Adobe en ChatGPT.** Se encontró una integración Adobe disponible para conectar mediante ChatGPT; puede ayudar en ciertos flujos Creative Cloud, imágenes, PDF y videos. **No se comprobó control nativo del proyecto After Effects (.aep) o acceso directo a aerender**. Debés conectar Adobe explícitamente en ChatGPT para usar las funciones admitidas. No confundir su acceso a Creative Cloud con control de la app local.

**Ruta B: After Effects en tu laptop.** La herramienta `scripts/after-effects-bridge.mjs` detecta `aerender` local de manera no destructiva. Con un proyecto .aep ya creado, puede producir una orden de render revisable y, solo cuando solicites `--render`, invocar el ejecutable local. No instala software, no accede a tu cuenta ni ejecuta trabajo solo al abrir un chat.

### Prueba local sin cambiar archivos

Desde la raíz del repositorio (Node 20+):

```bash
npm run adobe:check
npm run adobe:check -- --check
```

Si aerender no está en PATH, configurá `ALTIORA_AERENDER` apuntando al ejecutable oficial instalado de After Effects. Se puede usar una ruta absoluta, sin añadir tokens ni contraseñas. Las rutas cambian según plataforma/versión; **no asumir una carpeta estándar**.

### Crear composición original en After Effects

1. Abrir After Effects con licencia vigente y un proyecto nuevo.
2. `File → Scripts → Run Script File...` y elegir [altiora-concept-comp.jsx](altiora-concept-comp.jsx).
3. El script agrega una composición conceptual **1080 × 1920, 15s, 30fps**, con tipografía original y disclaimer. No graba ni renderiza, y no promete que exista el producto.
4. Guardar proyecto como `out/approved-concept.aep` bajo la raíz del checkout.
5. Elegir y comprobar el **Output Module** adecuado. `aerender` depende de configuraciones/plantillas del proyecto; indicar extensión .mov no garantiza automáticamente un códec determinado.

### Render controlado desde Node

```bash
node scripts/after-effects-bridge.mjs --plan out/approved-concept.aep "ALTIORA_Concept_9x16_15s" out/ae-master.mov
node scripts/after-effects-bridge.mjs --render out/approved-concept.aep "ALTIORA_Concept_9x16_15s" out/ae-master.mov
```

**La segunda línea inicia realmente After Effects** mediante aerender. Usarla solo con un proyecto propio validado y recursos disponibles. Un fallo de licencia o de proyecto se reporta; nunca se interpreta como éxito. El archivo resultante requiere inspección con ffprobe y revisión visual antes de entrega.

### Para todas las IAs de Altiora

- Claude Code, Gemini/Antigravity y ChatGPT/Codex: leer [Director Audiovisual](../agents/audiovisual-experience-director.md), este documento y [preflight](../../../scripts/visual-preflight.mjs).
- Seleccionar After Effects cuando sea una decisión razonable para VFX, máscaras, tracking, composición o animación nativa; si no está accesible usar Remotion/Blender/FFmpeg, sin pedir que el usuario escoja.
- El proyecto `.aep` y los derechos se validan por la IA **que ejecute en la laptop**, no por un reporte en GitHub Actions.
- No abrir archivos .aep de origen desconocido, plugins UXP/CEP ni scripts de terceros sin inspección, sandbox y respaldo.

## Gates

`PLANNED → AE_LOCAL_FOUND → SOURCE_AEP_VERIFIED → RENDERED → VIDEO_QA → HUMAN_APPROVED`.

No declarar acceso **CONNECTED** por la presencia del archivo JSX o de la integración Adobe sugerida en ChatGPT. El trabajo comercial requiere productos reales, derechos y autorización.

## Acceso de todas las IAs por MCP local

La [guía para Claude Code, Gemini/Antigravity y Codex](MCP-SETUP.md) y `npm run ae:clients:connect` permiten **registrar el mismo servidor MCP de After Effects en la laptop donde corren dichas IAs**, sin abrir puertos externos. La conexión solo es efectiva tras ejecutar el instalador local y comprobar `aerender`; el render sigue bloqueado por defecto y exige autorización por proyecto.
