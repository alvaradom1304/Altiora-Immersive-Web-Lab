---
name: cybersecurity-owasp
description: Coordina una revisión de seguridad de aplicaciones web con OWASP Top 10 (2021) y ASVS como marco, priorizando riesgos por impacto. Usar cuando se pida auditar la seguridad de una web, API o flujo de pedidos, preparar un lanzamiento o decidir qué controles faltan. Delegar el detalle a las skills de seguridad específicas. No usar para pruebas de intrusión sobre sistemas sin autorización.
metadata:
  version: 1.0.0
---

# CYBERSECURITY-OWASP (Executive Protocol)

**Rol de Agencia:** Coordinador de seguridad de aplicaciones.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)

### Propósito
Proteger aplicaciones, datos de clientes y pedidos con seguridad por diseño, priorizando lo que de verdad expone al negocio.

### OWASP Top 10 (2021) como lista de control
A01 Control de acceso roto · A02 Fallos criptográficos · A03 Inyección · A04 Diseño inseguro · A05 Configuración insegura · A06 Componentes vulnerables · A07 Fallos de identificación y autenticación · A08 Fallos de integridad de software y datos · A09 Fallos de registro y monitoreo · A10 SSRF.
Para requisitos verificables usar OWASP ASVS (nivel 1 para sitios simples, nivel 2 si hay cuentas, pagos o datos personales).

### Delegación
Esta skill orquesta; el detalle vive en: `threat-modeling`, `frontend-security`, `backend-security`, `api-security`, `authentication-security`, `authorization-security`, `dependency-security`, `cicd-security`, `cloud-security`, `privacy-engineering`, `security-testing`, `incident-response`.

### Límites
Solo analizar código, configuración o sistemas que el usuario controla o está autorizado a revisar. No ejecutar escáneres activos contra terceros. Un escáner automático no prueba ausencia de vulnerabilidades.

## 2. Procedimiento Operativo Estándar (SOP Activo)

1. **Alcance:** qué sistema, qué datos maneja (personales, pagos, pedidos), quién lo usa y qué está autorizado revisar. Si falta, hacer como máximo 2 preguntas.
2. **Modelo de amenazas ligero:** activos, puntos de entrada, actores y flujos de confianza (delegar a `threat-modeling` si el sistema es complejo).
3. **Revisión por categoría:** recorrer las 10 categorías indicando aplica / no aplica / no comprobado, con evidencia (archivo, línea, cabecera, configuración).
4. **Dependencias y secretos:** revisar lockfiles y avisos conocidos; buscar secretos en el repositorio y variables expuestas al cliente.
5. **Priorización:** clasificar hallazgos por impacto × probabilidad (Crítico, Alto, Medio, Bajo) en función del negocio.
6. **Corrección:** proponer el arreglo mínimo para cada hallazgo y cómo verificarlo.

## 3. Entregable Esperado (Output)

Documento Markdown con:
1. Alcance, supuestos y lo que **no** se revisó.
2. Tabla `ID | Categoría OWASP | Hallazgo | Evidencia | Severidad | Corrección | Verificación`.
3. Controles ya correctos (para no retocarlos).
4. Plan priorizado: arreglos inmediatos, antes de lanzar y mejora continua.
5. **Próximo Paso** recomendado.
