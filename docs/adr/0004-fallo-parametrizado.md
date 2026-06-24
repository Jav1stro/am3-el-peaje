# ADR 0004 — Fallo parametrizado como mecánica sistémica

**Estado:** Aceptado  
**Fecha:** 2026-06-24

---

## Contexto

El sistema necesitaba una mecánica de progreso visible para el visitante: una barra de porcentaje que sube o baja según el resultado de cada captcha. Esto requiere que los captchas puedan "fallar" — algo que el principio original de "siempre acepta" no contemplaba. A su vez, el rechazo teatral (ADR 0003) solo existía dentro del captcha de micrófono como excepción acotada.

## Decisión

Se introduce el **fallo parametrizado**: después de completar cualquier captcha, el sistema decide con probabilidad configurable (40% por defecto) si el resultado es un paso aceptado (+15 puntos) o un fallo (−20 puntos). El visitante ve "Verificación fallida" durante 2 segundos antes de pasar al siguiente captcha. La decisión es arbitraria — no evalúa la respuesta del visitante.

El rechazo teatral del captcha de micrófono se elimina. Todos los captchas se comportan igual: llaman `onDone()` y el sistema decide el resultado a nivel de flujo.

Los valores son configurables desde `src/data/progressConfig.js`.

**Supersede:** ADR 0003 (Rechazo teatral).

## Alternativas consideradas

**Mantener el rechazo teatral y agregar el fallo parametrizado encima:** los rechazos podrían acumularse (rechazo interno + fallo del sistema). Descartado porque dos rechazos seguidos por mecanismos distintos confunde más que amplifica.

**Fallo solo interno (invisible), sin mensaje al visitante:** el progreso sube o baja pero el visitante no ve "fallido" — solo nota que el porcentaje cambió. Descartado porque el castigo visible es parte de la experiencia burocrática.

## Razones

El fallo parametrizado unifica la mecánica de rechazo en un solo punto (el flujo entre captchas) en lugar de distribuirla dentro de captchas individuales. El visitante experimenta un sistema que a veces lo acepta y a veces lo rechaza sin criterio — como una ventanilla que rechaza trámites por motivos inventados.
