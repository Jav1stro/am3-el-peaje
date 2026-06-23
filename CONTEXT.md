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

Lo que ocurre cuando el visitante completa un captcha. El sistema siempre acepta la respuesta —correcta o incorrecta— muestra un spinner breve ("Verificando...", 1–2 segundos) y carga el siguiente captcha sin comentario. No hay mensaje de error. No hay mensaje de éxito. No hay validación. El captcha es teatro.

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

Un paso de verificación presentado al visitante. Tiene una interacción (hacer clic, seleccionar, escribir, scrollear, suspirar) y un botón o acción que llama `onDone()`. El sistema no evalúa si la respuesta es correcta. Todos los captchas terminan igual: el sistema acepta y carga el siguiente. Excepción: un captcha puede incluir un **rechazo teatral** antes de aceptar (ver término propio).

---

## Rechazo teatral

Un falso rechazo dentro de un **captcha** que finge evaluar la respuesta del visitante y devuelve un mensaje de error. No es validación real — el sistema no mide ni compara nada. El rechazo es parte del teatro: obliga al visitante a repetir una acción corporal o afectiva sabiendo que es absurda. Después del rechazo, el siguiente intento siempre es aceptado y se llama `onDone()`.
_Evitar_: error, fallo, validación fallida
