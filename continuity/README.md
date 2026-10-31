# Altiora Continuity OS — recuperación entre chats e IAs

**Problema que resuelve:** si la respuesta de ChatGPT no carga, se cierra el chat o una IA nueva toma el proyecto, el estado del trabajo, los PR verificados, los bloqueos y la próxima acción están disponibles en GitHub sin reconstruir una conversación completa.

**No resuelve:** fallos de la interfaz de ChatGPT, desconexión de red, mantener un modelo trabajando en segundo plano ni acceder automáticamente a un equipo local. GitHub no aloja una sesión de IA persistente.

## Fuente única de continuidad

- [Checkpoint estructurado](checkpoint.json) — milestones, evidencia, estado de acceso a herramientas, siguientes tareas y limitaciones.
- [Reglas de coordinación](../AGENTS.md) — todas las IAs, sin duplicar roles.
- [Router visual](../creative/visual-studio/ROUTER.md) y [protocolo portable](../creative/visual-studio/AGENT-PORTABILITY.md).

El checkpoint es un **snapshot versionado**, no una consulta en vivo. Para decir «completado» se revisan GitHub Actions, el PR fusionado y los artefactos. Los artifacts de Actions pueden vencer: la URL del job no garantiza conservar un MP4 para siempre.

## Comandos sin dependencias externas

Desde la raíz del repositorio con Node.js 20+:

```bash
npm run resume
npm run resume -- --prompt
npm run resume -- --json
npm run continuity:check
npm run check
```

- `resume`: resumen actual con bloqueos y capacidades por estado.
- `--prompt`: texto breve para copiar en Claude, Gemini/Antigravity, ChatGPT/Codex u otra IA.
- `--json`: contrato de contexto estructurado para automatizaciones propias.
- `continuity:check`: verifica esquema, existencia de archivos, que «TESTED_IN_CI» tenga evidencia y que lo bloqueado tenga explicación.
- `check`: incluye además las pruebas existentes del repositorio y tests de continuidad.

## Protocolo para cada IA al recibir «sigue» o «continúa»

1. Leer `continuity/checkpoint.json` y `AGENTS.md`. Si la IA tiene acceso a GitHub, comprobar la rama, el último PR y las acciones de CI. Si no tiene acceso, identificar claramente la incertidumbre.
2. Separar lo ya fusionado de las tareas `PENDING` y `BLOCKED`. Elegir un paso desbloqueado y avanzar con herramientas reales.
3. Usar una rama/PR por milestone, sin instalar MCP o software ajeno automáticamente. Antes de terminar, revisar PR, checks, licencias, estado de herramientas y derechos de materiales.
4. Al pasar el milestone, actualizar el checkpoint en el MISMO PR o en un PR de cierre, anexar enlaces de evidencia y dejar el siguiente milestone preparado.
5. Entregar un mensaje final compacto: qué quedó MERGED, qué se probó, qué no fue posible verificar y el enlace de recuperación. **No pedir al usuario que escriba «continúa» para completar pasos que aún pueden ejecutarse en el turno actual.**

La IA puede terminar su turno, perder permisos o fallar; esta regla es una **convención operativa**, no un mecanismo de ejecución continua.

## Cómo actualizar el checkpoint sin contaminar la evidencia

- `completed_milestones[].result` debe ser `MERGED` o `DONE`, siempre con un PR / evidencia comprobable.
- `capabilities[].status` distingue `DOCUMENTED`, `TESTED_IN_CI`, `UNVERIFIED` y `NOT_CONNECTED`. Nunca «conectado» por haber leído un README.
- `current_milestone` tiene pasos, entregables, criterio de validación, estados y bloqueos. Una tarea `BLOCKED` exige motivo.
- `snapshot_date` es la fecha del último control humano o automatizado explícito, **no** un reloj dinámico.
- No incluir tokens, passwords, fotos privadas de clientes ni datos sensibles; el repositorio puede ser público.
- No guardar promesas de IA como hechos ejecutados. Una herramienta que no esté disponible se marca sin confirmar.

## Error «This response couldn't load» en ChatGPT

Este aviso ocurre en el cliente/plataforma donde se muestra una respuesta; **no es un error que se pueda arreglar desde el código de Altiora**. Se puede comprobar [estado de OpenAI](https://status.openai.com/), recargar/reabrir el chat, probar un chat nuevo y, si persiste, solicitar ayuda en [soporte](https://help.openai.com/). Al reabrir, basta compartir el [checkpoint](checkpoint.json) o pedir a la IA conectada que lo abra.

**Resultado garantizado por este módulo:** contexto recuperable mediante archivo y comando, siempre que GitHub y el repositorio sean accesibles. No garantiza respuesta de ChatGPT ni trabajo desatendido.

## Próxima mejora opcional

Un orquestador externo autorizado puede usar el formato JSON para abrir tareas/reports recurrentes en GitHub. Sería una integración nueva, con credenciales, permisos, presupuesto y confirmación explícita de automatización; no queda activada por esta entrega.
