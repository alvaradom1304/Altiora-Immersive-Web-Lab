# Router de intención visual · Altiora

Este documento es una instrucción portable para cualquier IA. No activa herramientas sin conexión real.

**Router principal obligatorio:** ante toda intención audiovisual asignar primero al [Director de Experiencia Audiovisual](agents/audiovisual-experience-director.md). Él selecciona herramientas según el brief, disponibilidad real y score de negocio/calidad, después coordina a los roles de las rutas siguientes. No preguntar al cliente qué librería debe usar; si falta software, escoger un fallback permitido.

## Selección experta V2

Antes de seleccionar tecnología: abrir [matriz profesional](PRODUCTION-MATRIX.md), el [catálogo expandido](../../references/visual-libraries-2026.json) y el [playbook de la tarea](playbooks/README.md). El [protocolo de portabilidad](AGENT-PORTABILITY.md) sincroniza la intención y los handoffs entre Claude Code, Gemini/Antigravity y ChatGPT/Codex sin fingir que Adobe/Blender están conectados.

## Diagnóstico rápido

A partir de una solicitud corta (p. ej. “anuncio de 15 segundos de consola retro”, “finca cinematográfica con scroll”, “logo animado”), identificar:
- objetivo de negocio y audiencia,
- formato de salida: video / web interactiva / imagen / activo 3D,
- assets reales disponibles, estilo, presupuesto y canales,
- derechos de marca/imagen/música, plazo y aprobador.

Si falta un dato imprescindible, preguntar **solo ese dato**. Mantener supuestos explícitos; no inventar métricas ni fingir renders.

## Rutas

| Intención | Roles Altiora | Herramientas candidatas | Entregables |
|---|---|---|---|
| Anuncio 9:16 (Reels/TikTok) | Estrategia > Dirección creativa > Productor visual > Motion designer > QA | storyboard; Blender/Photoshop si hay assets; Remotion/Motion Canvas; Premiere si está disponible | guion hook-body-CTA, shotlist, storyboard, composición, captions, MP4, pruebas |
| Landing premium con motion | Dirección creativa > UX/UI > Motion > Web > QA | GSAP **o** Motion, dotLottie/Rive para estados, Three solo si agrega valor | motion spec, prototipo, implementación, versión reduced-motion, QA |
| Escenario 3D cinematográfico | Dirección creativa > Productor visual > Ingeniero web > QA | Blender + glTF Blender IO + glTF Transform + Three/R3F | escena fuente, GLB validado, atlas texturas, mapa de performance y fallback |
| Producto 3D / AR | Producto/UX > Visual > Web > QA | Blender + model-viewer o R3F | GLB, escena simple, controles accesibles, fallback foto |
| Motion graphics explicativos | Dirección creativa > Motion > QA | Remotion o Motion Canvas, AE según entorno y permisos | animatic, composición editable, video con subtítulos |
| Automatización Adobe | Ingeniería/Seguridad > Visual > QA | UXP Photoshop/Premiere oficiales; AE scripting documentado | plugin aislado, permisos, test local, rollback |
| Pedir “integrar MCP de Blender/Adobe” | Seguridad > Ingeniería > QA | solo evaluar servidor de terceros en HOLD | matriz de amenazas, permisos, plan de instalación; nunca conexión asumida |

## Guías de selección

**Web ligera**: CSS/SVG primero, Lottie/Rive para interactividad si aporta; WebGL solo cuando justificado.

**Anuncio editable con variantes**: Remotion es candidato principal si se acepta licencia y costo de render; comparar frente a flujo Blender/Premiere.

**Realismo de alto nivel**: no se obtiene solo agregando repositorios. Exige dirección fotográfica, geometría, PBR, iluminación, composición, animación, render, texturas y revisión humana.

## Handoff común entre IAs

Entregar un manifiesto con:
```json
{
  "job_id": "VIS-001",
  "client": "cliente",
  "objective": "objetivo verificable",
  "target": "video|web|3d|image",
  "owners": ["creative-director", "visual-producer", "motion-designer"],
  "approved_assets": [],
  "source_files": [],
  "export_files": [],
  "licenses": [],
  "tool_access": {"blender": "unknown", "adobe": "unknown", "repo": "known"},
  "assumptions": [],
  "validation": {"visual": "NOT_RUN", "technical": "NOT_RUN", "rights": "NOT_RUN"},
  "status": "DESIGNED"
}
```

No cambiar `status` a `RENDERED`, `TESTED`, `PUBLISHED` o `CONNECTED` sin evidencia de la acción completada. El responsable de QA puede bloquear la publicación. El siguiente agente debe poder reanudar desde el manifiesto, sin depender del chat anterior.

## Conexión con skills ya existentes

Invocar las skills actuales cuando correspondan: `art-direction`, `cinematic-direction`, `storyboarding`, `ai-video-direction`, `motion-design`, `gsap-animation`, `threejs-experience`, `react-three-fiber`, `web-performance` y `creative-quality-assurance`. Este router **coordina**; no las reemplaza ni acredita capacidades nuevas.
