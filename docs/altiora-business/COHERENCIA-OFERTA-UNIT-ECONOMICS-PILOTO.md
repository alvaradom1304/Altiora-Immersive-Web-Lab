# Auditoría de coherencia: oferta de US$10.000, unit economics y margen del piloto

**Fecha:** 1 de noviembre de 2026 · **Estado:** `NEEDS_REVIEW` (datos reales de costes, horas medidas y compras siguen pendientes).  
**Skills aplicadas bajo demanda:** `pricing` (0.1.0), `unit-economics` (0.1.0), `high-ticket-offer` (1.0.0) y `cold-outbound-system` (1.0.0).  
**Límite expreso:** este análisis evalúa coherencia aritmética, estructural y documental sobre los artefactos internos de Altiora. No constituye asesoría contable, fiscal ni jurídica, ni acredita ventas, disposición de pago o márgenes reales observados.

---

## 1. Veredicto ejecutivo

| Dimensión evaluada | Veredicto | Fundamento verificable |
|---|---|---|
| **Oferta de US$10.000 vs. Unit Economics (75 h aprobadas)** | **CONDICIONALMENTE COHERENTE** | Con el presupuesto aprobado por el fundador el 31/10/2026 (**75 h** a US$50/h = US$3.750, costes directos `D = US$3.000`, reserva `R = US$750`, estructura asignada `O = US$0`), el excedente económico de planificación es **`E = US$2.500` (`25,0 %`)**, cumpliendo en el límite exacto el umbral interno `E/P ≥ 25 %`. Cualquier desvío neto > 0 h sin menor coste directo `D` perfora el umbral. |
| **Oferta de US$10.000 vs. Escenario original (90 h)** | **INCOHERENTE CON EL UMBRAL DEL 25 %** | Con 90 h (`T = US$4.500`), `E` cae a **US$1.750 (`17,5 %`)**, una brecha de **−US$750 (−15 h)**. Para sostener `E/P = 25 %` con 90 h se requiere subir el precio piso a **US$11.000** o reducir `D` de US$3.000 a **US$2.250**. |
| **Unit Economics vs. Esfuerzo comercial (`F0/F1` y Outbound)** | **TENSIÓN OCULTA DE ADQUISICIÓN (CAC)** | Las fases comerciales `F0 Encaje` y `F1 Propuesta` (`entrega/README.md:58`) y la prospección (`RONDA-ENTREVISTAS-01.md`) se imputan a las 40 h de ventas/administración del bloque (`FINANZAS.md:53`), fuera de las 75 h del proyecto. Si cerrar el primer contrato exige 20–30 h comerciales del fundador (US$1.000–1.500 a US$50/h), el excedente económico neto tras adquisición del primer cliente baja a **US$1.000–1.500 (`10 %–15 %`)**. |
| **Oferta y Unit Economics vs. Piloto (*La Central del Queso*)** | **ALERTA DE ALCANCE / ACTIVO REUTILIZABLE** | El piloto tiene **margen comercial indefinido** (`P = US$0`, laboratorio sin contrato ni horas históricas medidas). Sin embargo, las tres estimaciones de esfuerzo registradas sobre el piloto el 31/10/2026 (`12 h` momentos firma + `6–8 h` limpieza/audio + `8–12 h` pedido durable por API) demuestran que **mezclar experiencia inmersiva/multicanal con e-commerce/transacciones desborda las 75 h**. La viabilidad de US$10.000 exige aplicar sin excepciones las exclusiones de `OFERTA.md:37` y reutilizar los módulos de API/validación del piloto como base estándar. |

---

## 2. Ecuación de Unit Economics y Precio Piso (`unit-economics` + `pricing`)

### 2.1. Definición de unidad y variables
- **Unidad de análisis:** 1 proyecto comercial cerrado y entregado bajo el alcance base de `OFERTA.md` (6 semanas de calendario, 1 mercado, 1 idioma, hasta 5 páginas, 1 formulario, 1 integración, 1 automatización de registro/asignación/aviso, hasta 5 eventos, manual y formación).
- **Ingreso neto comercial (`P`):** US$10.000 (`DECISIÓN DEL FUNDADOR`, meta no validada con compradores; antes de impuestos, cuya jurisdicción sigue `NOT_CONFIRMED`).
- **Fórmulas aplicadas:**
  - Contribución antes de tiempo fundador, reserva y estructura: $C = P - D$
  - Coste de oportunidad del tiempo del fundador: $T = H \times v$ (con $v = \text{US\$50/h}$ como supuesto interno)
  - Excedente económico de planificación: $E = P - D - T - R - O$
  - Techo de horas para un margen económico objetivo $m$:
    $$H_{\max}(m) = \frac{P(1 - m) - D - R - O}{v}$$
  - Precio piso económico (*Floor*) para un esfuerzo $H$ y margen económico objetivo $m$:
    $$P_{\text{piso}}(H, m) = \frac{D + H \cdot v + R + O}{1 - m}$$

### 2.2. Comparativa de escenarios y puente de margen (`O = US$0`)

| Métrica | Acotado (60 h) | Plan aprobado (75 h) | Referencia previa (90 h) | Desborde (130 h) |
|---|---:|---:|---:|---:|
| **P:** Ingreso neto supuesto (USD) | 10.000 | **10.000** | 10.000 | 10.000 |
| **D:** Costes directos externos (USD) | 2.000 | **3.000** | 3.000 | 4.500 |
| **C = P − D:** Contribución bruta (USD / %) | 8.000 (80,0 %) | **7.000 (70,0 %)** | 7.000 (70,0 %) | 5.500 (55,0 %) |
| **H:** Horas del fundador (h) | 60 | **75** | 90 | 130 |
| **T = H × 50:** Tiempo fundador valorado (USD) | 3.000 | **3.750** | 4.500 | 6.500 |
| **R:** Reserva gerencial por contingencia (USD) | 500 | **750** | 750 | 1.100 |
| **E = P − D − T − R:** Excedente económico (USD) | +4.500 | **+2.500** | +1.750 | −2.100 |
| **E / P:** Margen económico de planificación (%) | 45,0 % | **25,0 %** | 17,5 % | −21,0 % |
| **Precio piso (`Floor`) para `E/P = 25 %`** (USD) | 7.333,33 | **10.000,00** | 11.000,00 | 16.133,33 |
| **Proyectos equivalentes por bloque (90 h disp. / H)** | 1,50 | **1,20** | 1,00 | 0,69 |

### 2.3. Matriz de sensibilidad bivariada `(H × D)` sobre `E` (USD y `%` con `P = 10.000`, `R = 750`, `v = 50`)

Dado que `D = US$3.000` es un supuesto sin cotizaciones reales (`MISSING_REAL_INPUTS`), y que en una entrega donde el fundador ejecuta las 75 h sin subcontratar agencias externas `D` podría limitarse a revisión legal/contable puntual, comisiones de cobro e infraestructura incremental (`US$1.000–2.000`), la sensibilidad real es:

| Horas del fundador (`H`) \ Costes directos (`D`) | `D = US$1.000` (solo legal/cobro/API) | `D = US$2.000` (apoyo puntual) | `D = US$3.000` (supuesto base) | `D = US$4.000` (subcontratación alta) |
|---|---:|---:|---:|---:|
| **60 h** (`T = 3.000`) | +5.250 (**52,5 %**) | +4.250 (**42,5 %**) | +3.250 (**32,5 %**) | +2.250 (22,5 %) |
| **75 h** (`T = 3.750`) — *Plan aprobado* | +4.500 (**45,0 %**) | +3.500 (**35,0 %**) | **+2.500 (25,0 %)** | +1.500 (15,0 %) |
| **90 h** (`T = 4.500`) — *Ref. anterior* | +3.750 (**37,5 %**) | +2.750 (**27,5 %**) | +1.750 (17,5 %) | +750 (7,5 %) |
| **105 h** (`T = 5.250`) | +3.000 (**30,0 %**) | +2.000 (20,0 %) | +1.000 (10,0 %) | 0 (0,0 %) |

> **Hallazgo económico 1 (Sustitución entre `D` y `H`):** En `FINANZAS.md` se combinaban simultáneamente `D = US$3.000` y `H = 75–90 h` del fundador. En la práctica, si se gastan US$3.000 en colaboradores externos de entrega, las horas `H` del fundador deberían bajar hacia 50–60 h; y si el fundador absorbe las 75 h completas de entrega, `D` no debería superar US$1.000–1.500 (revisión jurídica/contable y comisiones), lo que otorga un colchón real de hasta **95–105 h** antes de caer bajo el 25 %. Antes de firmar el primer contrato, la plantilla `03-plan-presupuesto.md` debe separar cuánto de `D` es **obligatorio no delegable** (comisiones, legal, contador) y cuánto es **ejecución delegada que ahorra horas `H`**.

---

## 3. Coherencia con el Margen y Esfuerzo del Piloto (*La Central del Queso*)

### 3.1. Estado económico real del piloto
- **Hecho verificado (`PRUEBA-PILOTO.md`, `entrega/EJEMPLO-PILOTO.md:13-18`):**
  - Ingresos cobrados (`P`): **US$0** (laboratorio interno, sin propuesta firmada ni pago).
  - Horas reales (`H`) y costes directos (`D`): **no registrados** durante la construcción inicial (`G3: NO VERIFICADO`).
  - Margen financiero del piloto: **indefinido** (con `P = 0`, `E/P` no existe). El piloto **no valida** que el mercado pague US$10.000 ni que una entrega real deje 25 % de margen.

### 3.2. Prueba de estrés del presupuesto de 75 h contra la evidencia técnica y creativa del piloto
Aunque no existe hoja de tiempos histórica del piloto, los documentos de entrega del 31/10/2026 registran **tres estimaciones explícitas de trabajo sobre el piloto** que permiten auditar si el desglose de **75 h** (`entrega/README.md:46-56`) es realista:

| Fase del sistema de entrega | Presupuesto aprobado (`README.md:46-56`) | Esfuerzo estimado en el piloto (`31/10/2026`) | Tensión detectada sobre el margen de la oferta de US$10.000 |
|---|---:|---|---|
| **F3 Definición** (estructura, diseño, copy, brief) | **12 h** | **12 h solo en momentos firma** (`BRIEF-CREATIVO-DIFERENCIAL.md:82-90`: Marca 2 h + Web «Su punto» 6 h + Anuncio sartén 2 h + Tarjeta física 2 h) | Si los momentos firma multicanal consumen las 12 h completas de F3, quedan **0 h** para arquitectura de 5 páginas, copy base, mapa de datos y consolidación de comentarios. |
| **F4 Construcción** (páginas, formulario, integración, automatización) | **28 h** | **8–12 h solo para corregir el pedido por API** (`EJEMPLO-PILOTO.md:99`: `lib/orders.ts`, `orderStore.ts`, `orderService.ts`, ruta y 12 tests) + **3–4 h de limpieza de claims** + **3–4 h de audio** (`BRIEF-CREATIVO-DIFERENCIAL.md:92-94`) | Solo el backend de pedidos y la limpieza de claims representan **11–16 h** (39 %–57 % de toda la fase F4), sin contar la maquetación de hasta 5 páginas, la conexión real con CRM/n8n/Sheets ni las 2 demos semanales. |
| **F5 Revisión técnica y QA** | **8 h** | En el piloto siguen `NO VERIFICADO` el recorrido en navegador (360/390/768/1440 px), teclado, contraste, n8n real y el destino durable en producción (`EJEMPLO-PILOTO.md:65-67`) | Ejecutar la matriz completa de 12 áreas de `06-plan-pruebas-evidencia.md` + corregir defectos bloqueantes en 8 h exige que F4 entregue sobre componentes ya probados, sin componentes 3D o física experimental que multipliquen la superficie de QA. |

### 3.3. Reglas operativas que hacen coherente la oferta de US$10.000 a partir del aprendizaje del piloto
1. **Exclusión estricta de e-commerce y medios inmersivos en el paquete base (`OFERTA.md:37`, `02-propuesta-alcance.md:21`):**
   - El piloto es un **catálogo B2C con carrito multi-producto, física interactiva, audio sintético y cálculo de precios en servidor**. En cambio, la oferta de US$10.000 (`OFERTA.md:11`) es un **recorrido B2B de captura, registro, asignación y aviso de consultas (1 formulario + 1 integración + 1 automatización)**, excluyendo expresamente tienda/pagos, 3D, vídeo y audio.
   - **Conclusión:** La oferta de US$10.000 a 75 h **solo es coherente si no se vende un alcance tipo "Central del Queso completo" por US$10.000**. Cualquier momento firma de vídeo/audio, recomendador interactivo a medida o carrito multiproducto debe cotizarse como **Solicitud de Cambio (`plantilla 04`)** con horas y precio adicionales.
2. **Capitalización del código del piloto como activo interno reutilizable (reducción de `H` en `F4`):**
   - Los módulos creados el 31/10/2026 en el piloto (`lib/orders.ts`, `lib/orderStore.ts`, `lib/orderService.ts` con patrón *guardar primero → notificar con timeout de 5 s → marcar `NOTIFY_FAILED` con recuperación manual*) y `scripts/manifiesto.py` ya resolvieron el problema arquitectónico de idempotencia, validación en servidor y trazabilidad de entregas.
   - Reutilizar ese patrón como plantilla técnica para el formulario B2B de consultas permite ahorrar las **8–12 h** de diseño de backend en el primer cliente de pago, protegiendo las 28 h de `F4 Construcción`.

---

## 4. Coherencia de Caja, Cobros y Mantenimiento Opcional

1. **Hitos 50 % / 30 % / 20 % y riesgo del último cobro (`R-03`):**
   - El cobro inicial de **US$5.000 (50 %)** cubre el 100 % de los costes directos externos supuestos (`D = US$3.000`) y la reserva (`R = US$750`), evitando déficit de caja inicial siempre que se respete la regla de `entrega/README.md:40` (**no iniciar F2 sin anticipo efectivamente cobrado**).
   - El cobro final de **US$2.000 (20 %)** equivale al **80 % de todo el excedente económico del proyecto (`US$2.000 / US$2.500`)**. Como `OFERTA.md:26` establece que el silencio del cliente no constituye aceptación, si el cliente demora la firma del acta `08-acta-aceptacion-traspaso.md`, el margen económico queda retenido. La mitigación en `02-propuesta-alcance.md:46-50` (plazo de 5 días hábiles + recordatorio + reunión en 3 días hábiles, separando pendientes no bloqueantes) requiere validación jurídica antes de firmar el primer contrato.
2. **Mantenimiento mensual opcional (`FINANZAS.md:59-67`, `OFERTA.md:41`):**
   - Con la fórmula $Q = \frac{d + h \cdot v + r + o}{1 - m}$ y los parámetros ilustrativos de `CALCULADORA.html:87` ($d = 200$, $h = 4\text{ h}$, $v = 50$, $r = 50$, $o = 50$, $m = 25\%$), la cuota orientativa resultante es:
     $$Q = \frac{200 + (4 \times 50) + 50 + 50}{1 - 0,25} = \frac{500}{0,75} = \text{US\$666,67 / mes}$$
   - Si los costes directos mensuales $d$ (hosting/herramientas) los paga directamente el cliente en sus propias cuentas (`02-propuesta-alcance.md:30,54`), entonces $d = 0$ para Altiora y el piso mensual por 4 h reservadas ($h \cdot v = 200$, $r = 50$, $o = 50$) baja a **US$400,00 / mes** con 25 % de margen económico. Conviene fijar esta distinción antes de cotizar mantenimiento para no inflar la cuota duplicando costes que el cliente ya abona a sus proveedores.

---

## 5. Coherencia con el Sistema Outbound y Validación Comercial (`cold-outbound-system`)

1. **Embudo matemático de la Ronda 1 (`RONDA-ENTREVISTAS-01.md` vs. `OFERTA.md:49-51`):**
   - `OFERTA.md:49-51` define como criterio de avance (*Go a propuestas individuales*) completar **8 entrevistas cualificadas** en 3 semanas, observar el mismo problema reciente en **≥ 5** y lograr que **≥ 3** acepten revisar una propuesta de US$10.000 con decisor y fecha.
   - Sin embargo, `RONDA-ENTREVISTAS-01.md:19-33` solo dispone de **6 borradores listos en Gmail** (y 2 en reserva sin correo válido). Para alcanzar 8 entrevistas efectivas en frío, una tasa de conversión de correo frío a entrevista del 15 %–25 % exigiría **entre 32 y 54 cuentas contactadas**, no 6.
   - **Acción requerida en prospección:** Ampliar la lista pública verificada a **30–40 empresas** (manteniendo las reglas de `cold-outbound-system`: fuentes públicas, cero scraping automatizado, sin datos personales sensibles, borrador sujeto a autorización humana) para que el experimento de validación del precio de US$10.000 tenga potencia real.

---

## 6. Desajustes documentales corregidos y pendientes por ámbito

### Corregidos en esta revisión (dentro del ámbito `docs/altiora-business/`)
1. **[`PROPUESTA-MAESTRA-ALTIORA.md`](PROPUESTA-MAESTRA-ALTIORA.md) (`:60`, `:87`, `:98`):** Alineado con `ALTIORA-MAESTRO-PROYECTOS.md` para reflejar la decisión del fundador del 31/10/2026 (**75 h de presupuesto de planificación** para sostener el 25 % de margen económico) y el estado actualizado del piloto (`POST /api/orders` con 12/12 pruebas automáticas PASS en copia de trabajo sin commit).
2. **[`FINANZAS.md`](FINANZAS.md) (`:17-27`, `:35`, `:53`):** Incorporada la columna **Plan aprobado (75 h)** (`T = US$3.750`, `E = US$2.500`, `E/P = 25 %`, capacidad `1,20` proyectos equivalentes por bloque de 4 semanas) junto al escenario original de referencia de 90 h (`17,5 %`, precio piso US$11.000), explicitando la relación de sustitución entre `D` y `H` y el impacto de las horas comerciales (`F0/F1`).
3. **[`CALCULADORA.html`](CALCULADORA.html) (`:87`):** Actualizado el botón «Cargar ejemplo hipotético» de `hours: 90` a `hours: 75` para que el escenario de ejemplo cargue por defecto el presupuesto aprobado de 75 h que cumple el umbral del 25 % (`E = US$2.500`), manteniendo intacta la lógica de `AltioraEconomics.project()` y `maintenance()`.
4. **[`DIAGNOSTICO.json`](DIAGNOSTICO.json) y [`GATES.json`](GATES.json):** Actualizados `evidence` y `assumptions` para distinguir el escenario original de 90 h (`17,5 %`) del presupuesto aprobado de 75 h (`25 %`) y reflejar la reevaluación técnica del piloto.

### Observados fuera del ámbito de escritura de esta tarea (para registrar en coordinación)
- **`.agents/skills/high-ticket-offer/SKILL.md` (`:15`, `:29`, `:48`) y `.claude/skills/high-ticket-offer/SKILL.md`:** La descripción del frontmatter ya indica `US$10.000 por proyecto`, pero el cuerpo interno del SOP aún menciona `USD 3,000–5,000` como rango de referencia. No bloquea la operación porque `OFERTA.md` y `.altiora/project.json` fijan `US$10.000`, pero conviene actualizar esas tres líneas cuando se edite el directorio de skills.
- **`CLIENTS_PORTFOLIO.md` (`:30`):** En la raíz del proyecto, la nota final aún resume el piloto antes de la implementación de `POST /api/orders` del 31/10/2026 (que sí consta en `docs/altiora-business/PRUEBA-PILOTO.md:19-30`).

---

## 7. Próximo paso recomendado

1. **Antes de enviar propuestas comerciales:** Desglosar en `entrega/plantillas/03-plan-presupuesto.md` los costes directos `D` reales del primer proyecto (separando honorarios legales/contables e impuestos de cualquier subcontratación técnica) para confirmar si el colchón real a US$10.000 es de 75 h (`D = US$3.000`) o de 95–105 h (`D = US$1.000–1.500`).
2. **Para desbloquear la validación del precio (Compuerta `G1`):** Autorizar o enviar los 6 borradores de `RONDA-ENTREVISTAS-01.md` tras confirmar el remitente y el correo de VIHESA, y preparar un segundo lote de 24–30 candidatas B2B con fuentes públicas para alcanzar las 8 entrevistas requeridas por el experimento.
