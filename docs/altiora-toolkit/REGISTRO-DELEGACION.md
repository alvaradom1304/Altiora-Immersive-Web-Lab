# Registro de delegación

Lo llena `altiora-os-delegation` al cerrar cada encargo. Sirve para decidir con datos si Orca compensa: tras 3 encargos delegados, se compara con encargos parecidos hechos en un solo chat. Umbral: al menos un 30 % menos de horas del usuario sin perder calidad.

| Fecha | Encargo | Modo (Orca / un chat) | Partes e IAs | Horas del usuario | Correcciones | Coste IA observado | Notas |
|---|---|---|---|---|---|---|---|
| 01/11/2026 | Paquetes de servicios: fichas comerciales + página de presentación | Orca | A: Claude Opus, esfuerzo alto, 1 h 8 min (`paquetes-fichas`, c044981). B: Antigravity, esfuerzo medio (`paquetes-pagina`, 23af04e) | Por medir: inicio de sesión en Antigravity + revisión pendiente | 0 en las entregas; 4 fricciones de Orca (faltaba --model con --effort, comillas rompieron el encargo de agy, Antigravity sin sesión, permiso de creación) | No medido (suscripciones) | Destapó 2 fallos de la unificación (enlace a archivo ignorado, doctor no portátil), corregidos en e221729. Estimación previa 30–45 min: superada |
