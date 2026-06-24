# El Peaje — Glosario de dominio

---

## Loop infinito

El estado central de la obra. La aplicación no tiene pantalla de inicio ni pantalla final. El visitante entra directamente a un captcha y, al completarlo, recibe otro. El ciclo no termina nunca. No existe estado de "éxito" que abra la caja.

---

## Tease ambiental

Texto estático en el chrome de la interfaz que dice: *"Resuelva el captcha para acceder."* Solo visible en la **estética** `matrix`. Referencia implícita a la caja de cristal. No es una barra de progreso ni un contador. No señala avance ni retroceso. Crea la ilusión de que hay un destino sin indicar que uno se está acercando a él.
_Evitar_: instrucción, prompt, mensaje de bienvenida

---

## Paso aceptado

Uno de los dos resultados posibles cuando el visitante completa un captcha. El sistema muestra un spinner breve ("Verificando...", 1–2 segundos) y carga el siguiente captcha sin comentario. No hay mensaje de éxito. El captcha es teatro. La probabilidad es configurable desde `progressConfig.js`.

---

## Fallo parametrizado

El otro resultado posible al completar un captcha. El sistema muestra "Verificando..." y luego declara *"Verificación fallida"* antes de cargar el siguiente captcha. No hay evaluación real — el sistema no mide la respuesta del visitante. El fallo es arbitrario, decidido por probabilidad configurable desde `progressConfig.js`. Ocurre a nivel de flujo (entre captchas) y no ofrece segundo intento: el sistema informa, castiga y sigue.
_Evitar_: error, rechazo, validación

---

## Pool de captchas

El conjunto de todos los tipos de captcha disponibles en un momento dado. El pool está diseñado para crecer: agregar un captcha nuevo solo requiere sumarlo al array `CAPTCHA_TYPES` del store y registrar su componente en `CaptchaRouter`, sin modificar ninguna otra lógica de flujo.

---

## Shuffle

El mecanismo de orden del pool. Los captchas se presentan en orden aleatorio. Cuando el pool se agota, se baraja de nuevo —garantizando que ningún captcha se repita de forma inmediata. El visitante no puede predecir qué viene.

---

## Estética

La apariencia visual completa de la aplicación: paleta de colores, tipografía, bordes, efectos de fondo, y chrome del **Layout**. La app soporta tres estéticas intercambiables (`classic`, `matrix`, `darktech`) seleccionables desde `/docs` y persistidas en localStorage. La estética activa no altera textos ni lógica de los **captchas** — solo cómo se ven.
_Evitar_: tema, skin, diseño, system design

---

## Estética QR

Dirección visual del chrome de la interfaz en la estética `matrix`. Combina dos referencias:

1. **Patrones de QR**: grilla de módulos (6×6px) como textura de fondo; finder patterns (los cuadrados de las esquinas) como elementos decorativos flanqueando el tease ambiental.
2. **Paleta matrix / terminal**: verde `#00ff41` sobre negro `#080c08`. Tipografía completamente monoespaciada (Space Mono). Card con scanlines CSS y animación de glitch periódica.

Los QR son decorativos, no funcionales. No existe un tipo de captcha que pida escanear un QR.

---

## Captcha

Un paso de verificación presentado al visitante. Tiene una interacción (hacer clic, seleccionar, escribir, scrollear, suspirar) y un botón o acción que llama `onDone()`. El sistema no evalúa si la respuesta es correcta. Al completarse, el captcha puede resultar en un **paso aceptado** o un **fallo parametrizado** — decidido por probabilidad, no por la respuesta del visitante.

---

## Progreso

Indicador numérico (porcentaje) visible para el visitante que representa su avance en el proceso de verificación. Sube con cada **paso aceptado** (+15 puntos por defecto) y baja con cada **fallo parametrizado** (−20 puntos por defecto). Nunca llega a 100%. El visitante lo ve como su progreso real; el sistema lo usa como una promesa que no se cumple.
_Evitar_: barra de carga, porcentaje de completado, score

---

## Fila

El conjunto de visitantes conectados simultáneamente. Cuando un nuevo visitante entra a la fila, el **progreso** de todos los demás disminuye (−30 puntos por defecto). Cada visitante ve cuántos otros hay en la fila y su progreso. La fila amplifica la metáfora burocrática: más gente esperando, menos avanzás.
_Evitar_: sala, room, lobby, cola

---

