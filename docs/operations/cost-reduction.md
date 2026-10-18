# Altiora — repositorios para reducir costes

Revisión: 18 de octubre de 2026. Supuesto de trabajo: Altiora entrega webs, experiencias y automatizaciones. No se han confirmado suscripciones, facturas, infraestructura disponible ni coste por hora de la empresa.

## Decisión práctica

Priorizar cinco herramientas sin un servidor permanente adicional: **shadcn/ui, Lucide, Sharp, Playwright y Lighthouse**. Su valor inicial está en reutilizar trabajo, reducir preparación manual y detectar errores antes de entregar. El ahorro de caja depende de que realmente sustituyan un gasto existente.

Registrar cuatro candidatos para pilotos: **n8n, Activepieces, Umami y Uptime Kuma**. **Supabase, Twenty y DocuSeal** quedan para una necesidad concreta con volumen suficiente. No se despliegan por aparecer en esta lista.

Los 12 nuevos candidatos complementan las 16 referencias inmersivas. El [catálogo empresarial](../../references/business-repositories.json) contiene revisiones fijadas, licencias observadas, costes restantes y estado de incorporación.

## Prioridades y ahorro potencial

| Repositorio | Prioridad | Cómo puede reducir gasto o trabajo | Coste que permanece |
|---|---|---|---|
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Aplicar en próximos proyectos | Menos horas construyendo y manteniendo componentes comunes; puede evitar comprar kits equivalentes. | Sin servidor adicional para los componentes; persiste el tiempo de adaptación y pruebas. |
| [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | Aplicar en próximos proyectos | Reutilización en múltiples entregas; posible sustitución de packs de iconos cuando cubra sus necesidades. | Sin servidor propio; conservar atribuciones/licencias aplicables. |
| [lovell/sharp](https://github.com/lovell/sharp) | Aplicar en próximos proyectos | Menos procesamiento manual y bytes transferidos; puede evitar servicios de transformación por petición. | CPU de preparación, almacenamiento y transferencia restantes. No sustituye generación de imágenes ni todas las funciones de una CDN. |
| [microsoft/playwright](https://github.com/microsoft/playwright) | Aplicar en próximos proyectos | Reducir repeticiones manuales, regresiones y retrabajo de entregas. | Ejecuciones locales o minutos de CI y mantenimiento de pruebas. |
| [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Aplicar en próximos proyectos | Evitar auditorías básicas pagadas si las cubre la herramienta y reducir ciclos de corrección. | Tiempo de revisión; CI opcional. También existe integrado en Chrome DevTools. |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | Piloto con coste completo | Reducir captura manual y cuotas por tareas si el coste operativo total resulta menor. | Servidor, base de datos, respaldo, mantenimiento y APIs externas; funciones Enterprise pueden ser de pago. |
| [activepieces/activepieces](https://github.com/activepieces/activepieces) | Piloto con coste completo | Posible sustitución de automatizaciones de pago y ejecución repetitiva. | Infraestructura, respaldo, mantenimiento y APIs; edición y funciones comerciales separadas. |
| [umami-software/umami](https://github.com/umami-software/umami) | Piloto con coste completo | Puede sustituir analítica de pago cuando existan requisitos y volumen suficientes. | Aplicación, PostgreSQL, respaldo y mantenimiento. |
| [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma) | Piloto con coste completo | Menos comprobaciones manuales y posible sustitución de monitoreo de pago. | Instancia, almacenamiento de datos, respaldo y canal de avisos. |
| [supabase/supabase](https://github.com/supabase/supabase) | Solo con necesidad y volumen | Reutilización de capacidades puede ahorrar desarrollo; autohospedaje no implica ahorro. | Postgres y servicios asociados, operación, respaldo, observabilidad y actualizaciones. |
| [twentyhq/twenty](https://github.com/twentyhq/twenty) | Solo con necesidad y volumen | Posible sustitución de CRM de pago y menor pérdida de seguimiento. | Servidor, base de datos, respaldo, mantenimiento y posibles funciones comerciales. |
| [docusealco/docuseal](https://github.com/docusealco/docuseal) | Solo con necesidad y volumen | Posible sustitución parcial de un servicio de firma de pago y menos seguimiento manual. | Servidor, almacenamiento, correo, respaldo y funciones Pro necesarias. |

Estas son hipótesis de valor, no cifras de ahorro conseguidas. El software libre puede requerir servidores, mantenimiento, correo, almacenamiento y servicios externos. No sustituir una solución gratuita suficiente por un servidor de pago.

## Condiciones por herramienta

### shadcn-ui/ui

**Uso:** Reutilizar formularios, diálogos y navegación en proyectos React con identidad propia.

**Condición de incorporación:** Elegir componentes compatibles con la versión del proyecto. No usar su aspecto predeterminado como identidad de Altiora.

**Licencia observada:** MIT.

**Evidencia de origen:** [README](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/README.md), [Licencia/documentación 1](https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9113008b5bb908563527b7efd2f27/LICENSE.md).

### lucide-icons/lucide

**Uso:** Unificar iconografía vectorial de interfaces y evitar rehacer iconos comunes.

**Condición de incorporación:** ISC para Lucide y MIT para iconos derivados de Feather indicados en LICENSE. Importar solo los iconos utilizados.

**Licencia observada:** ISC + MIT para los iconos derivados indicados.

**Evidencia de origen:** [README](https://github.com/lucide-icons/lucide/blob/1ef60af944de207e0d5176905a0759ba12e6ee8d/README.md), [Licencia/documentación 1](https://github.com/lucide-icons/lucide/blob/1ef60af944de207e0d5176905a0759ba12e6ee8d/LICENSE).

### lovell/sharp

**Uso:** Preparar imágenes WebP/AVIF y tamaños adecuados durante el proceso de publicación.

**Condición de incorporación:** Comparar calidad y tamaños. Reutilizar la optimización ya existente en Next si satisface el caso; no montar un segundo servicio por defecto.

**Licencia observada:** Apache-2.0.

**Evidencia de origen:** [README](https://github.com/lovell/sharp/blob/adae0a027eb4e98ece22324bef5e27953abdf60a/README.md), [Licencia/documentación 1](https://github.com/lovell/sharp/blob/adae0a027eb4e98ece22324bef5e27953abdf60a/LICENSE).

### microsoft/playwright

**Uso:** Comprobar navegación, formularios y recorridos comerciales en navegadores.

**Condición de incorporación:** Automatizar flujos de valor real, no cada detalle visual. No requiere contratar su servicio cloud.

**Licencia observada:** Apache-2.0.

**Evidencia de origen:** [README](https://github.com/microsoft/playwright/blob/b335271cdc2b57cac2be8ad37c5dd283ac6b8938/README.md), [Licencia/documentación 1](https://github.com/microsoft/playwright/blob/b335271cdc2b57cac2be8ad37c5dd283ac6b8938/LICENSE).

### GoogleChrome/lighthouse

**Uso:** Medir rendimiento y detectar problemas antes de entregar webs.

**Condición de incorporación:** Una puntuación de laboratorio no acredita experiencia real ni accesibilidad completa; usar el mismo entorno al comparar.

**Licencia observada:** Apache-2.0.

**Evidencia de origen:** [README](https://github.com/GoogleChrome/lighthouse/blob/d8617feba207eebd46ae17fb4d6b137b71723010/readme.md), [Licencia/documentación 1](https://github.com/GoogleChrome/lighthouse/blob/d8617feba207eebd46ae17fb4d6b137b71723010/LICENSE).

### n8n-io/n8n

**Uso:** Reutilizar automatizaciones internas y el flujo de pedidos existente como referencia.

**Condición de incorporación:** Sustainable Use License con uso interno y exclusiones Enterprise. No asumir permiso para revender acceso o alojarlo como producto para clientes. No se verificó una instancia activa.

**Licencia observada:** Sustainable Use License + Enterprise en partes excluidas.

**Evidencia de origen:** [README](https://github.com/n8n-io/n8n/blob/d2dc2f9ce50294df5c08799af437c56e3e04ab13/README.md), [Licencia/documentación 1](https://github.com/n8n-io/n8n/blob/d2dc2f9ce50294df5c08799af437c56e3e04ab13/LICENSE.md).

### activepieces/activepieces

**Uso:** Alternativa de automatización para flujos nuevos cuando el núcleo comunitario cubra el caso.

**Condición de incorporación:** Núcleo MIT; carpetas EE tienen licencia comercial. Comparar con n8n y elegir un motor por flujo; no migrar el trabajo existente sin beneficio neto.

**Licencia observada:** MIT en el núcleo; licencia comercial en EE.

**Evidencia de origen:** [README](https://github.com/activepieces/activepieces/blob/58ac3b0a8188a7e67b684164c467463aa1175991/README.md), [Licencia/documentación 1](https://github.com/activepieces/activepieces/blob/58ac3b0a8188a7e67b684164c467463aa1175991/LICENSE), [Licencia/documentación 2](https://github.com/activepieces/activepieces/blob/58ac3b0a8188a7e67b684164c467463aa1175991/docs/about/license.mdx).

### umami-software/umami

**Uso:** Analítica de tráfico, campañas y conversiones para webs entregadas.

**Condición de incorporación:** Si la solución actual es gratuita y suficiente, no hay ahorro de caja por cambiar. Evaluar aislamiento entre clientes y evitar duplicar analítica.

**Licencia observada:** MIT.

**Evidencia de origen:** [README](https://github.com/umami-software/umami/blob/ec0ff50388c264ed8ce46f00967e92f7e71476ae/README.md), [Licencia/documentación 1](https://github.com/umami-software/umami/blob/ec0ff50388c264ed8ce46f00967e92f7e71476ae/LICENSE).

### louislam/uptime-kuma

**Uso:** Detectar caídas de webs y endpoints y revisar disponibilidad.

**Condición de incorporación:** No colocar el único monitor en el mismo servidor del servicio vigilado. Para pocos sitios, comparar primero con una opción gratuita existente.

**Licencia observada:** MIT.

**Evidencia de origen:** [README](https://github.com/louislam/uptime-kuma/blob/b092505f894d66669b67f46e1da72b51016eceab/README.md), [Licencia/documentación 1](https://github.com/louislam/uptime-kuma/blob/b092505f894d66669b67f46e1da72b51016eceab/LICENSE).

### supabase/supabase

**Uso:** Evitar reconstruir autenticación, almacenamiento y APIs cuando un proyecto necesite backend.

**Condición de incorporación:** No desplegar una plataforma completa solo por reducir una cuota pequeña. El modo local de desarrollo no equivale a producción; revisar licencias de componentes del stack.

**Licencia observada:** Apache-2.0 del repositorio; componentes del stack con sus propias licencias.

**Evidencia de origen:** [README](https://github.com/supabase/supabase/blob/7425d4930528931400fb3e656e860b1094cb224e/README.md), [Licencia/documentación 1](https://github.com/supabase/supabase/blob/7425d4930528931400fb3e656e860b1094cb224e/LICENSE).

### twentyhq/twenty

**Uso:** Gestionar contactos, oportunidades y seguimiento comercial cuando el volumen lo justifique.

**Condición de incorporación:** Repositorio mixto: AGPLv3 con excepción de aplicaciones, paquetes MIT y archivos Enterprise comerciales. Usar primero un proceso simple si cubre las ventas actuales.

**Licencia observada:** AGPLv3 con excepción de aplicaciones + paquetes MIT + Enterprise comercial.

**Evidencia de origen:** [README](https://github.com/twentyhq/twenty/blob/289976eaeeb78fda1b85ff9f3c92fa6ab6f93eb6/README.md), [Licencia/documentación 1](https://github.com/twentyhq/twenty/blob/289976eaeeb78fda1b85ff9f3c92fa6ab6f93eb6/LICENSE).

### docusealco/docuseal

**Uso:** Preparar formularios PDF y gestionar recogida de firmas cuando la empresa tenga volumen suficiente.

**Condición de incorporación:** Núcleo AGPLv3. El README separa funciones Pro, incluido embedding; comprobar funciones requeridas y procedencia de documentos antes de migrar.

**Licencia observada:** AGPL-3.0 en el núcleo; funciones Pro separadas.

**Evidencia de origen:** [README](https://github.com/docusealco/docuseal/blob/3c65b0e4ba872fe71d5566c0d09c3ace59a7fb8a/README.md), [Licencia/documentación 1](https://github.com/docusealco/docuseal/blob/3c65b0e4ba872fe71d5566c0d09c3ace59a7fb8a/LICENSE).


## Cómo empezar con menor coste

1. En el siguiente trabajo React, reutilizar componentes que resuelvan funciones comunes y adaptar la identidad. Lucide cubre iconos comunes. Mantener el trabajo visual propio de la marca.
2. Preparar imágenes al publicar si eso evita transformaciones repetidas. Si Next ya las optimiza correctamente, aprovechar lo existente antes de introducir Sharp como herramienta separada.
3. Comprobar el flujo comercial crítico con Playwright y revisar el rendimiento con Lighthouse localmente. Registrar horas de revisión y defectos encontrados; mantener pocas pruebas de valor.
4. Inventariar el flujo de pedidos de La Central del Queso. El repositorio contiene una automatización n8n; su presencia no prueba que haya un servidor activo. Comparar la reutilización con un flujo nuevo antes de migrar.
5. Evaluar un solo candidato operativo a la vez y conservar la alternativa anterior hasta comprobar resultados. No instalar n8n y Activepieces para el mismo problema.

## Comparar gastos de forma útil

Separar dos resultados:

- **Caja:** pagos mensuales que desaparecen menos nuevos pagos e inversión inicial.
- **Capacidad:** horas de trabajo liberadas valoradas al coste interno indicado. No tratarlas como dinero que ya entró a la cuenta.

Coste recurrente completo = cuotas + infraestructura + copias de seguridad + almacenamiento/transferencia + APIs/correo/SMS + mantenimiento. Incluir en el coste inicial migración, configuración y formación. Si se usa un servidor compartido, declarar tanto el coste incremental como el impacto en capacidad; no cargar el mismo servidor completo a varias alternativas y sumar esos resultados.

La [plantilla de costes](../../templates/cost-comparison.json) exige datos confirmados. El [comparador](../../scripts/compare-costs.mjs) no convierte campos vacíos en cero. Se puede ejecutar con:

~~~sh
node scripts/compare-costs.mjs templates/cost-comparison.json
~~~

Mientras falten cifras, devuelve qué campo hay que completar. El [ejemplo ficticio](../../examples/cost-comparison.example.json) demuestra una alternativa que baja la factura pero aumenta el trabajo; no describe gastos de Altiora.

~~~sh
npm run costs:example
~~~

No sumar el ahorro de dos herramientas que sustituyen la misma suscripción. Comparar n8n y Activepieces como alternativas, no como dos ahorros independientes.

## Criterio para desplegar o migrar

El piloto debe cubrir las funciones necesarias, permitir restaurar datos y tener un responsable de mantenimiento. Medir un periodo representativo del flujo y comparar caja, tiempo e incidencias con la situación anterior. Solo entonces decidir si compensa mantenerlo.

n8n tiene licencia Sustainable Use con alcance y exclusiones propios; no asumir permiso para revender acceso. Activepieces distingue núcleo MIT y funciones comerciales. Twenty tiene licencia mixta. DocuSeal separa funciones Pro del núcleo. La licencia del repositorio no significa que todas las funciones cloud sean gratuitas.

Supabase documenta responsabilidades propias al autohospedar y diferencias respecto al servicio gestionado: [documentación oficial](https://supabase.com/docs/guides/self-hosting). Esta evaluación trata su autohospedaje como una decisión operativa, no como ahorro automático.

## Estado de esta entrega

Catálogo y proceso incorporados. Comparador local implementado y probado con casos de cálculo. No se han instalado servicios empresariales, migrado datos, cancelado suscripciones ni medido ahorro real. El descargador reconoce ambos catálogos; su descarga por Git requiere conectividad que no estuvo disponible en la comprobación anterior.
