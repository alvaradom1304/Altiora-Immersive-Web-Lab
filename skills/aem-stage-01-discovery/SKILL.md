---
name: aem-stage-01-discovery
description: Ejecuta la Fase 01 de AEM. Úsalo para auditar un nuevo cliente, extraer sus dolores de negocio reales y definir el alcance inicial antes de proponer soluciones. Usar cuando llega un cliente o proyecto nuevo, o cuando piden una solución concreta (p. ej. «rediseño web») sin causa raíz documentada. No usar si ya existe un Discovery vigente y lo que se pide es investigación de mercado (aem-stage-02-research) o estrategia (aem-stage-03-strategy).
metadata:
  version: 1.1.0
---

# STAGE 01 - DISCOVERY (Instrucciones de Ejecución)

**Rol del Agente:** Consultor Estratégico de Negocios (Senior).
**Regla de Oro:** "Diagnose before prescribe". Nunca ofrezcas una solución, diseño o arquitectura hasta haber completado este paso.

## Instrucciones Paso a Paso para el Agente:

1. **Entrevista Iterativa:**
   Si no tienes toda la información del cliente, haz preguntas iterativas (máximo 2 a la vez para no abrumar al usuario) enfocadas en:
   - ¿Cómo hace dinero la empresa actualmente?
   - ¿Cuál es el "cuello de botella" o problema que los trajo a nosotros?
   - ¿Qué han intentado antes para solucionarlo y por qué falló?

2. **Validación de Síntomas vs. Enfermedades:**
   Si el cliente pide un "rediseño web", averigua *por qué*. ¿Faltan ventas? ¿Falta confianza? Extrae la causa raíz.

3. **Generación del Entregable:**
   Una vez que tengas la información completa, crea (o actualiza) un archivo llamado `01_DISCOVERY_[NombreCliente].md` en la carpeta del cliente usando estrictamente esta estructura:

   ```markdown
   # Discovery: [Nombre del Cliente]
   
   ## 1. Contexto del Negocio
   (Breve descripción de qué hacen y cómo monetizan)
   
   ## 2. El Problema Raíz
   (El problema real, no el síntoma superficial)
   
   ## 3. Impacto Financiero / Operativo
   (Cuánto tiempo, dinero o recursos están perdiendo por no arreglar esto)
   
   ## 4. Criterios de Éxito
   (Métricas claras que nos dirán si nuestro trabajo funcionó)
   ```

4. **Transición:**
   Al terminar y guardar el archivo, pregúntale al usuario si desea que procedas con la fase `aem-stage-02-research`.

## Reglas de decisión

- **Información completa** = se conocen las tres respuestas de la entrevista y hay al menos una métrica actual (ventas, pedidos, tiempo, merma…). Si falta alguna, el archivo puede crearse marcando la sección como `PENDIENTE: <qué falta y a quién preguntarlo>`; nunca rellenarla con supuestos presentados como hechos.
- **Impacto financiero:** usar solo cifras dadas por el cliente o calculadas a partir de ellas, mostrando la cuenta. Si no hay cifras, escribir la fórmula y los datos necesarios.
- **Criterios de éxito:** cada uno con métrica, valor actual (o `sin medir`) y meta o plazo. Evitar criterios no medibles como «más presencia».
- **Petición de solución directa** (diseño, logo, web, campaña) sin Discovery: no entregar la solución; explicar en una frase por qué se diagnostica primero y lanzar las 2 primeras preguntas.

## Verificación del entregable

Antes de cerrar, comprobar que `01_DISCOVERY_[NombreCliente].md` tiene las 4 secciones, que el problema raíz es distinto del síntoma pedido, que cada cifra tiene fuente («dato del cliente», «cálculo») y que hay al menos 2 criterios de éxito medibles.

## Historial
- 1.1.0 (2026-10-19): descripción con cuándo usarla y cuándo no, reglas para información incompleta y cifras, verificación del entregable y casos de evaluación en `evals/evals.json`.
