# ADR 0003 — Rechazo teatral como excepción al principio de "siempre acepta"

**Estado:** Superseded por [ADR 0004](0004-fallo-parametrizado.md)  
**Fecha:** 2026-06-23

---

## Contexto

El principio central del loop infinito es que el sistema siempre acepta cualquier respuesta sin mensaje de error (ver ADR 0001). El captcha `microphone` ("validación biométrica afectiva") necesita rechazar el primer intento del visitante con un mensaje de error inventado para obligarlo a repetir un gesto corporal ridículo — suspirar frente a su teléfono — por segunda vez.

## Decisión

Se permite que un captcha incluya un **rechazo teatral**: un falso rechazo con mensaje de error que no evalúa nada realmente. Las condiciones son:

- El rechazo ocurre exactamente una vez. El segundo intento siempre es aceptado y llama `onDone()`.
- El mensaje de error es absurdo y transparentemente arbitrario (ej: *"Insuficiente derrota detectada"*). No simula un error técnico real.
- El sistema no mide, compara ni almacena nada del input del visitante. El rechazo está hardcodeado.

## Alternativas consideradas

**Mantener "siempre acepta" sin excepciones:** el captcha graba el suspiro, muestra el análisis fake, y acepta en el primer intento. Más simple y consistente, pero pierde la dimensión de repetición forzada — el visitante hace el gesto ridículo una vez y se va. La segunda vez es donde la obra muerde: ya sabés que es absurdo y lo hacés igual.

**Rechazo infinito (nunca acepta):** el captcha rechaza siempre, atrapando al visitante en un loop dentro del loop. Conceptualmente potente pero rompe la mecánica del pool — el visitante nunca ve otros captchas y la variedad del loop infinito se pierde.

## Razones

El rechazo teatral amplifica el concepto de sometimiento digital: no alcanza con hacer lo que la máquina pide, hay que hacerlo *bien según sus criterios inventados*. La repetición forzada convierte la resignación en performance — el visitante suspira dos veces frente a su pantalla en un espacio público. La primera vez puede ser curiosidad; la segunda es obediencia.

La excepción es estrecha: un rechazo, siempre seguido de aceptación, sin validación real. El loop infinito sigue intacto.
