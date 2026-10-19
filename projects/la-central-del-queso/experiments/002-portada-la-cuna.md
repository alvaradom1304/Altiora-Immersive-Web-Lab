# Experimento — Portada award-grade «La cuña»

Estado: implementado; verificación en curso (ver Evidencia).
Proyecto: La Central del Queso. Rama `feat/award-grade-home` en el worktree `la-central-del-queso-award` (no fusionada).
Fecha y responsable: 18 oct 2026 · claude (sesión de investigación Buttermax), a petición del usuario.

## Pregunta e hipótesis
¿Se puede llevar la portada al nivel de un Site of the Day sin perder la función comercial (precios, canasta, ferias, pedido por WhatsApp)? Hipótesis: un único gesto propio de la marca (cortar la cuña de una horma) y tipografía de rótulo de feria dan el impacto; el contenido DOM conserva la utilidad.

## Fit check (M0)
Acento inmersivo, no inmersión total: comercio de alimentos con pedido directo. El hero y la historia del Semiduro son inmersivos; pizarra, canasta, ferias y pedido son interfaz convencional. El CTA principal («Ver la pizarra de precios») debe estar en el primer pantallazo y funciona sin WebGL. Corrección: en la versión 2 el jurado midió el CTA bajo el pliegue en 1024×768, 1366×768 y 1440×900 (yo solo lo había comprobado en el panel y en móvil); se corrige en la ronda 3 limitando el titular por la altura.

## Fuentes y patrón
- [Auditoría de Buttermax](../../../docs/research/buttermax-audit-2026-10.md): objeto protagonista que se inclina con el cursor, lerp normalizado por refresco, tipografía como material.
- [Skill award-grade-web](../../../skills/award-grade-web/SKILL.md) y [plantilla immersive-cursor-lab](../../../templates/immersive-cursor-lab/README.md): `damp`, reloj único, teardown, alternativas.
- Lógica de canasta reutilizada de `components/CheeseMatcher.tsx` (factores 0.22/0.42/0.65 y umbrales).

## Dirección artística (M1)
- Concepto: «La cuña». El cursor inclina la horma; el scroll saca la cuña y la historia del Semiduro se cuenta con sus datos (firmeza, fundición, sal, intensidad).
- Tipografía: Big Shoulders Display (rótulo de feria, precios grandes) + Instrument Serif itálica (una palabra cálida por titular) + Plus Jakarta Sans y JetBrains Mono ya presentes en la marca.
- Paleta: tokens existentes de `tailwind.config.ts` (forest, cream, cheese, terracotta). Ritmo oscuro → crema → oscuro → crema → oscuro → oro.
- Gesto secundario: imagen que sigue al cursor en la pizarra (solo puntero fino); etiqueta de precio pegada; cinta de días.

## Alcance y versiones
Next 14.2.3, three 0.186.1, gsap 3.15.0 (ya instalados en el proyecto). Horma procedural (geometría three.js y texturas dibujadas en canvas): sin modelos ni texturas nuevas. Fotografías del catálogo reutilizadas del proyecto; su procedencia no está auditada y se rotulan como ilustrativas.

## Contenido y veracidad
Se usan precios, presentaciones, usos y ferias de `lib/products.ts` y `lib/locations.ts`, y el número de `lib/whatsapp.ts`. Se evitan por no verificados: nombre de finca, altitud, «cava de roble», «desde 1980» (se filtra en toda la portada con `lib/award/copy.ts`, también en la pizarra). Los metadatos de la página sustituyen a los del layout, que mencionan datos no verificados.

## Alternativa ligera
Póster CSS de la horma con la cuña (`conic-gradient`) visible hasta el primer frame y si WebGL falla (`?nowebgl`). `prefers-reduced-motion`: sin seguimiento, sin entrada animada, cuña fija a medio salir, miniaturas en la pizarra. Táctil: amplitud reducida, sin cursor ni imagen flotante.

## Evidencia
Ejecutado el 18 oct 2026 en la máquina del usuario (AMD 3020e, Vega 3), Chromium del panel de Claude.

- `next build` de producción: correcto (tipos válidos), `/` 196 kB de carga inicial; three.js en bloque diferido. `tsc --noEmit` sin errores. `npm run guard`: 0 errores, 0 avisos en el código nuevo.
- Escritorio (728×596 y 1440×900): WebGL 2, 14 draw calls, 694 triángulos, DPR 1; ~61 frames/s medidos con el panel visible (conteo de frames, no benchmark). Entrada del titular completa; cuña sale con el scroll (cut 0 → 0,9); barras sensoriales rellenas al entrar en vista.
- Pizarra: agregar sin abrir el cajón, contador y región viva («… agregado al pedido (1)»).
- Canasta: 4 personas, todos los días, palmito y natilla = ₡16.700 (misma cifra que la verificación de la otra sesión). Fines de semana con 4 personas → Surtido Semanal Familiar ₡10.500 con ahorro de ₡700.
- Cajón de pedido: foco dentro al abrir, Shift+Tab da la vuelta, Escape cierra y devuelve el foco al botón.
- Pausa de movimiento: 0 frames en pausa, 61 al reanudar. Pausa de la cinta verificada solo como regla CSS (el sistema del panel tiene movimiento reducido).
- Movimiento reducido real: 0 frames, cuña fija a medio salir, sin botón de pausa, miniaturas visibles.
- `?nowebgl`: póster CSS, canvas oculto. Móvil 375×812: sin scroll horizontal, puntero grueso, DPR 1,5.
- Revisión independiente (agente immersive-reviewer, solo lectura): 3 bloqueantes (contraste del terracota en texto pequeño, cajón sin gestión de foco, movimiento sin pausa) e importantes (vueltas acumuladas, canasta más cara que el surtido, textos no derivados de lib) corregidos.
- Defectos encontrados en navegador y corregidos: tildes ocultas por el interlineado, `gsap.from` + StrictMode dejaba el titular oculto (→ `fromTo`), cuña fuera de encuadre, CTA fuera del primer pantallazo en móvil.
- Pendiente: lector de pantalla real, dispositivo táctil físico, frame time sostenido, Lighthouse.

## Jurado (award-jury), ronda 1 — versión 2
Diseño 6,5 · Usabilidad 7,0 · Creatividad 6,5 · Contenido 7,0 → media 6,7. Dev: semántica 7,0 · animación 7,5 · accesibilidad 7,5 · WPO 8,0 · responsive 6,5 · markup 7,5. Gate M4 no superado.
Causas: horma de poco oficio, gesto dirigido por el scroll, recursos genéricos (anillo, imán, marquesina), cajón con estilo anterior, CTA bajo el pliegue, solapes.

## Ronda 3 (respuesta al jurado)
Horma en torno con canto redondeado, relieve, caras de corte con pasta y corteza, migas irregulares; gesto propio (arrastrar sobre la horma o botón «Cortar la cuña»); fuera anillo, imán y marquesina; muesca de cuña como motivo; pausa en la barra; cajón con tokens nuevos; imagen flotante encima de la fila; pizarra compacta en móvil; JSON-LD; titular limitado por altura.

## Jurado, ronda 2 — versión 3
Diseño 7,0 · Usabilidad 7,5 · Creatividad 7,0 · Contenido 7,0 → media 7,2 (gate M4 superado por la mínima). Dev: semántica 7,5 · animación 7,5 · accesibilidad 8,0 · WPO 7,0 · responsive 7,5 · markup 7,5.
CTA en el primer pantallazo verificado en 1024×768, 1366×768, 1440×900, 1920×1080, 375×667, 375×812 y 728×596. Gesto verificado con ratón y teclado.
Pendientes señalados: el corte no tenía consecuencia, imagen flotante que tapaba la fila siguiente y pedía variantes enormes (sin `sizes`), virutas que parecían piedras, solapes en 728×596.

## Ronda 4 (respuesta al jurado)
Tarjeta «La cuña de la casa» con precio real y botón Agregar al cortar; el corte pasa a ser del usuario tras su primer gesto, con `aria-pressed` coherente; cursor de cuchillo; pizarra con revelado dentro de la fila y `sizes` explícito; virutas planas solo a la derecha; SVG y pista reubicados; cuña hacia el espectador.

## Jurado, rondas 3 y 4
Ronda 3 (v4): media 7,45. Ronda 4 (v5): media 7,7 (Diseño 7,5 · Usabilidad 8,0 · Creatividad 8,0 · Contenido 7,0; Accesibilidad 8,5). Primera versión a la altura de la media de Buttermax (7,49); por debajo de Lusion (8,25).

## Ronda 6 (petición del usuario: más animación e interactividad)
- «Dorar»: las caras de corte se doran al recorrer el paso «Firme al cuchillo, dorado al fuego» (verificado visualmente); la velocidad del scroll inclina la horma.
- Revelados de titulares y bloques al entrar en vista (12 filas ocultas solo por debajo del pliegue; visibles sin JS y con movimiento reducido).
- Total de la canasta que cuenta (₡16.700 → ₡22.200, valor intermedio observado ₡21.387) y líneas que se «imprimen».
- Estado de feria en vivo con hora de Costa Rica («Abre el sábado (en 5 días) a las 5:30 AM», lunes 19 oct).
- Cuña que vuela al pedido desde cualquier producto; «En su pedido · n» en la pizarra; titular final que sigue al puntero.
- Mejoras del jurado: horma ≥ 31–33 % del ancho en 728/1024/1280 (antes ~23–25 %) sin pisar el titular; un solo precio tras cortar; tarjeta compacta con «Cuña · Semiduro»; pista oculta fuera del hero; filtros seguros con los revelados.
- Build de producción correcto (200 kB de carga inicial), consola limpia, guardián sin avisos.

## Decisión
Continuar. Pendiente: quinta puntuación del jurado sobre la ronda 6, lector de pantalla, móvil físico, Lighthouse y fotografía real de producto (depende del negocio). La rama no está fusionada ni desplegada.
