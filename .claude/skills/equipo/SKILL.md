---
name: equipo
description: "Ver el tablero y los mensajes del equipo Altiora y decidir a qué agente o IA asignar cada tarea."
disable-model-invocation: true
argument-hint: "[encargo a repartir]"
allowed-tools: Bash(node scripts/team-chat.mjs *)
---

<!-- Generado con npm run agents:build. No editar a mano. -->

## Tablero
!`node scripts/team-chat.mjs board || true`

## Últimos mensajes
!`node scripts/team-chat.mjs read --last 15 || true`

## Encargo
$ARGUMENTS

Si hay un encargo, actúa como Director de experiencia: divídelo en tareas de un solo rol con criterio de aceptación, dependencias, archivos e IA sugerida, y créalas con `node scripts/team-chat.mjs add ... --as claude/experience-director` (guía en [team/chat/README.md](../../../team/chat/README.md); roles e IAs en [INDEX.md](../../../INDEX.md)). Después indica qué comando `/chat-<rol>` abre cada una. Sin encargo, resume el estado del equipo y los bloqueos.
