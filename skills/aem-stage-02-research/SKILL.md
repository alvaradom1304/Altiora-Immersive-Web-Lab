---
name: aem-stage-02-research
description: Ejecuta la Fase 02 de AEM. Realiza investigación de mercado profundo, análisis de competidores (Benchmarking) y auditoría de presencia digital. Usar cuando ya existe un Discovery (fase 01) y hay que validar con evidencia el mercado, la competencia y la audiencia antes de definir estrategia. No usar para inventar datos de mercado sin fuentes, ni si aún no se conoce el problema del cliente (volver a aem-stage-01-discovery).
metadata:
  version: 1.1.0
---

# STAGE 02 - RESEARCH (SOP de Consultoría)

**Rol del Agente:** Analista de Inteligencia de Mercado (Market Intelligence).
**Regla de Oro:** "Evidence before opinion". Toda afirmación sobre el mercado debe estar respaldada por datos, tendencias o análisis competitivo.

## Instrucciones de Ejecución:
1. **Auditoría Competitiva (Benchmarking):** Exige al usuario al menos 3 competidores. Analiza su posicionamiento, modelo de precios y debilidades.
2. **Análisis de Audiencia:** Define qué busca realmente el cliente final (Jobs-to-be-Done framework).
3. **Mapeo de Tendencias:** Identifica cómo la IA o nuevas tecnologías están afectando este nicho.
4. **Entregable:** Genera el archivo `02_RESEARCH.md` con 3 secciones: [FODA Competitivo], [Brechas en el Mercado (Oportunidades)], [Perfil Psicológico del Consumidor].

## Reglas de evidencia

- **Entrada mínima:** el Discovery (`01_DISCOVERY_*.md`) o, si no existe, el problema del cliente en una frase. Sin él, pedirlo o redirigir a `aem-stage-01-discovery`.
- **Competidores:** si el usuario da menos de 3, proponer candidatos y pedir confirmación; no analizar competidores no confirmados como si lo estuvieran.
- **Fuentes:** cada afirmación de precio, posicionamiento o tendencia lleva su fuente (URL y fecha consultada, o «dato del cliente»). Lo que no tenga fuente se marca como `Hipótesis` y se indica cómo validarla. Nunca inventar cifras de mercado, cuotas ni estudios.
- **Presencia digital:** revisar solo canales públicos (web, redes, fichas de mapas, marketplaces) y anotar qué se observó y cuándo.
- **Audiencia:** formular 2–4 jobs-to-be-done («Cuando…, quiero…, para…») apoyados en evidencia (reseñas, entrevistas, búsquedas) o marcados como hipótesis.

## Verificación del entregable

`02_RESEARCH.md` está listo cuando tiene las 3 secciones, al menos 3 competidores confirmados (o la lista de pendientes), cada dato con fuente o marca `Hipótesis`, y cierra con las 3 brechas más accionables para `aem-stage-03-strategy`.

## Historial
- 1.1.0 (2026-10-19): descripción con cuándo usarla y cuándo no, reglas de evidencia y fuentes, verificación del entregable y casos de evaluación en `evals/evals.json`.
