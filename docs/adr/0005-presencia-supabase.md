# ADR 0005 — Presencia multiusuario via Supabase Realtime

**Estado:** Aceptado  
**Fecha:** 2026-06-24

---

## Contexto

La instalación es visitada por múltiples personas simultáneamente (escanean el mismo QR en la sala). Cada visitante interactúa de forma aislada — no sabe que hay otros. Se quiere que los visitantes se vean entre sí y que la presencia de otros afecte negativamente su progreso.

## Decisión

Se usa **Supabase Realtime Presence** para sincronizar la presencia de visitantes en tiempo real. Cada visitante se une a un canal compartido y publica su progreso. Cuando un nuevo visitante entra, todos los demás pierden 30 puntos (configurable). Cada visitante ve el conteo y progreso de los demás.

No se usa base de datos ni tablas — solo Presence (efímero, en memoria). Las credenciales (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) son anon keys públicas configuradas como env vars en Vercel.

Si Supabase no está configurado o no está disponible, la app degrada silenciosamente: el progreso funciona local sin fila.

## Alternativas consideradas

**Servidor WebSocket propio (Node.js + Socket.io):** máximo control pero requiere hosting separado (la app es un SPA estático en Vercel), dos deploys, y mantenimiento de un server que puede caerse durante la muestra.

**Presencia simulada (bots fake):** simular otros usuarios sin comunicación real. Más simple pero pierde la dimensión de que la presencia del otro es real — el castigo es real porque la otra persona es real.

## Razones

Supabase Realtime Presence resuelve el problema sin servidor propio, con un tier gratuito que soporta las conexiones necesarias para una muestra en sala. La degradación silenciosa garantiza que la app nunca se rompa por un problema de conectividad.
