# Skill portable: animación 2D, ilustración y motion generativo

**Activa por intención:** spots de anime original, animaciones dibujadas, branding, overlays, personajes propios, partículas, gráficos artísticos, storytelling infantil y exploración visual.

## Decisión autónoma del Director Audiovisual
- **Ilustración dibujada**: Krita para arte y sprites editables; Pencil2D para fotogramas; Synfig para animación vectorial compleja si se justifica.
- **Generative art 2D**: p5.js para explorar formas; usar en producción web solo si el coste de ejecución móvil se justifica.
- **Partículas/UI**: tsParticles cuando existan necesidades de estados y controles; para efectos simples priorizar SVG/CSS, evitando una dependencia adicional.
- **Video comercial y variantes**: Remotion mantiene la línea temporal final y permite producir múltiples canales. El editor de ilustración no sustituye el master.
- **Motion interactivo**: Rive/Lottie en web según necesidad; no instalar ambos para resolver un icono sencillo.
- **Edición real de footage**: LosslessCut para trims locales si conviene; FFmpeg para pipelines automatizables y codecs documentados.

## SOP

1. Definir lenguaje visual en moodboard y referencia artística *sin copiar personajes de terceros*.
2. Construir 4–8 fotogramas de intención o animatic; validar lectura en móvil.
3. Escoger UNA tecnología de autoría de ilustración y UNA de timeline final; mantener proyectos fuente.
4. Crear efectos originales y accesorios con derechos de uso; generar export RGBA cuando se requiera alpha.
5. Montar hook/body/CTA en la resolución de campaña y añadir audio/subtítulos con licencias.
6. QA: consistencia de personaje, anatomía, timing, color, flujos de atención, movimiento reducido, peso de recursos y legibilidad.
7. En productos para bebés, verificar seguridad y uso antes de afirmar beneficios o representar dispositivos instalados en cunas.

**Gate**: un arte conceptual se etiqueta como tal hasta que un producto real y su autorización hayan sido comprobados.

## Repositorios relevantes
[Krita](https://github.com/KDE/krita) · [Synfig](https://github.com/synfig/synfig) · [Pencil2D](https://github.com/Pencil2D/pencil) · [p5.js](https://github.com/processing/p5.js) · [tsParticles](https://github.com/tsparticles/tsparticles) · [LosslessCut](https://github.com/mifi/lossless-cut).

## Handoff
`art_direction.md`, `sprite_manifest.json`, `timeline_spec.json`, archivos fuente, exports, `validation.json`; usar los estados y gates del [Director Audiovisual](../agents/audiovisual-experience-director.md).
