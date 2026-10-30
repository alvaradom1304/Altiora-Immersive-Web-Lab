# Altiora Video Workspaces — Claude Code + Antigravity + Codex

**Estado:** arquitectura y comandos de gestión de campañas implementados; integración con editores en la computadora pendiente de prueba real. Los archivos de clientes NUNCA se publican en GitHub.

## Crear un proyecto por empresa/producto
Ejecutar desde la raíz de Altiora, en la rama de trabajo correcta:

```bash
npm run video:project -- init --client el-tilichero --campaign earbuds
npm run video:project -- status --client el-tilichero --campaign earbuds
```

Se crea esta estructura local (ignorados por Git):

```text
media-workspaces/
└── el-tilichero/
    └── earbuds/
        ├── 00_BRIEF.md                  # marca, objetivo y restricciones
        ├── 01_CRUDOS/                   # originales iPhone; nunca alterar
        ├── 02_REFERENCIAS/
        │   └── REFERENCIAS.md          # links, licencias y ejemplos buscados
        ├── 03_RESULTADOS/               # MP4 finales, v01, v02...
        ├── 04_EDITABLES/
        │   └── README.md               # proyecto Remotion, timelines, scripts y audio
        └── 05_QA/
            ├── REVISION.md             # checklist técnico y humano
            └── asset-inventory.json    # generado solo tras inventario
```

Para otra empresa usar, por ejemplo: `npm run video:project -- init --client la-central-del-queso --campaign queso-semiduro`. Múltiples campañas pueden coexistir sin mezclar clientes.

## Cómo introducir grabaciones
Pasar MOV/MP4 originales del iPhone mediante AirDrop, cable o descarga completa de iCloud; evitar compartir como video comprimido de mensajería. Copiar a `01_CRUDOS/` sin renombrar el master. `npm run video:project -- inventory --client el-tilichero --campaign earbuds` genera un inventario SHA-256 sin modificar el material. Ese inventario **no interpreta, transcribe ni edita** clips.

En `02_REFERENCIAS/REFERENCIAS.md` pegar URLs de anuncios y anotar qué estructura/efecto interesa, sin reproducir contenido protegido sin permiso. Guardar composiciones y scripts en `04_EDITABLES/`; exportar versiones `el-tilichero-earbuds-humor-v01.mp4` y `el-tilichero-earbuds-premium-v01.mp4` en `03_RESULTADOS/`. Marcar QA en `05_QA/`; no usar la carpeta de resultados para clips intermedios.

## Flujo de edición requerido
1. Leer el brief, las referencias y el inventario local. Detectar si ffmpeg/ffprobe, Remotion y herramientas auxiliares están instaladas, verificando compatibilidad/licencia.
2. Revisar cada toma real, transcribir diálogo, escoger timecodes y proponer dos ediciones (humor y demo premium) solo cuando material lo permita. No inventar modelo/prestaciones.
3. Crear un primer montaje reproducible. FFmpeg para composición y limpieza; Remotion para animaciones originales, textos y motion graphics; Auto-Editor y Whisper solo como apoyo opcional.
4. Revisar efectos de sonido, música con licencia, corrección de color, formato vertical 1080x1920, CTA al WhatsApp real del cliente.
5. Renderizar MP4, validar ffprobe/decodificación, revisar cuadro inicial/final, sincronía, subtítulos, derechos, diseño y visualización móvil. Registrar evidencia en 05_QA. No afirmar SUCCESS si faltan archivos o inspección visual.
6. Conservar resultados versionados y editables. Nunca subir crudos, música ni datos personales de clientes a GitHub. No instalar herramientas externas sin la revisión documentada en `docs/security/third-party-skill-gate.md`.

## Los tres entornos
- **Claude Code:** `CLAUDE.md`, subagentes `.claude/agents/` y skills `.claude/skills/`. Abrir la raíz del repositorio donde se ejecutó la creación.
- **Google Antigravity:** `GEMINI.md`, subagentes `.agents/agents/`, skills `.agents/skills/` y reglas `.agents/rules/`.
- **Codex:** `AGENTS.md`, skills `.agents/skills/` y subagentes de proyecto `.codex/agents/`. Configuraciones generadas desde los 22 roles canónicos/locales; se deben descubrir en una sesión Codex compatible.

`npm run agents:build` genera los adaptadores de los tres y `npm run check` detecta diferencias. Esto configura el comportamiento de asistentes **en el repositorio**, no instala ni conecta automáticamente los programas en la computadora. Un subagente no es un proceso permanente. Queda pendiente prueba end-to-end con material audiovisual real y herramientas locales.

## Para poner a trabajar el equipo
`«El Tilichero: editen las tomas reales de media-workspaces/el-tilichero/earbuds/01_CRUDOS. Revisen 02_REFERENCIAS, hagan cortes, motion graphics y sonido; guarden 2 renders MP4 en 03_RESULTADOS, editables en 04_EDITABLES y la revisión en 05_QA. Sin inventar claims ni resultados.»`

## Protección
`media-workspaces/` está excluido de Git por completo. El material puede seguir estando expuesto al sistema de archivos local o a otras aplicaciones con acceso: usar permisos mínimos, discos seguros y respaldos del cliente. Revisar derechos, licencia de música y consentimientos.

## Memoria editorial por cliente (evitar el mismo edit)
Cada empresa puede mantener `media-workspaces/<cliente>/_creative-history.json`, excluido de Git, con huellas de **videos aprobados** (no crudos). Antes de la edición activar [Creative Variation Director](../../skills/ai-video-direction/references/creative-variation-playbook.md). Requiere analizar clips, crear tres rutas y comparar con las cinco campañas previas. El ejemplo JSON y la orden de Claude Code están en [CREATIVE_VARIATION.md](CREATIVE_VARIATION.md); validar con `npm run video:variation` y después verificar diferencia real mediante visionado.
