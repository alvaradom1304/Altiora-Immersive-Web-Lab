# Investigación: variedad creativa para Altiora — 2026-10-30

## Decisión de ingeniería
El problema no se resuelve por tener cien transiciones: se resuelve separando **lectura del metraje → propuesta creativa → comparación con trabajos recientes → edición → QA**. Extender la skill existente `ai-video-direction` con `creative-variation-playbook.md` reduce duplicaciones y llega a Claude Code, Antigravity y Codex por sus puentes actuales.

| Fuente | Hallazgo útil | Decisión | Riesgo |
|---|---|---|---|
| https://github.com/remotion-dev/skills | Skills oficiales para composición, markup y render Remotion | REFERENCIA TÉCNICA | No elige por sí misma conceptos diferentes |
| https://github.com/Vincentwei1021/video-shotcraft | Gran catálogo de recetas de planos y movimiento; licencia Apache-2.0 indicada | REFERENCIA DE GRAMÁTICA, NO INSTALAR | Aplicar recetas sin entender metraje produce nuevas plantillas repetidas |
| https://github.com/salomonMuriel/media-production-skills | Skills de dirección, scriptwriting y gates; declara MIT | ESTUDIO, SIN IMPORTACIÓN | Repositorio reciente y con poca adopción; claims de calidad sin verificación independiente |

**No se instaló nada externo.** Las popularidades públicas cambian y no acreditan rendimiento comercial. Antes de importar: fijar commit SHA, auditar licencia/dependencias, ejecutar NVIDIA SkillSpector en cuarentena y requerir revisión humana. La seguridad no se infiere de las estrellas.

## Control añadido
Auditor offline sobre ocho dimensiones creativas y memoria privada por cliente, con pruebas unitarias de repetición. Comprueba coherencia **de los metadatos declarados**, no ve el video ni mide creatividad de personas. La evaluación artística y comercial requiere montajes reales y datos posteriores.
