# ADR 0001 — Loop infinito en lugar de flujo lineal con inicio y fin

**Estado:** Aceptado  
**Fecha:** 2026-06-05

---

## Contexto

La implementación original de El Peaje tenía un flujo narrativo lineal: ingreso de email → cuenta regresiva física → serie de captchas → uno de tres desenlaces posibles. El visitante entraba, recorría un camino y llegaba a un final explícito ("acceso denegado", "acceso reservado para máquinas", o error con reinicio automático).

## Decisión

Se elimina toda estructura de inicio y fin. La aplicación arranca directamente en un captcha y cicla infinitamente: captcha → "Verificando..." (1–2s) → siguiente captcha → sin fin.

Se eliminan: pantalla de email, pantalla de fallo de email, pantalla de código enviado, pantalla de no recibí el correo, cuenta física en papel, y los tres desenlaces.

Se mantiene y amplía: el pool de captchas, el shuffle aleatorio del pool, y el tease ambiental ("Resuelva el captcha para acceder") como texto estático en el chrome.

## Alternativas consideradas

**Mantener el flujo lineal con un final que reinicia:** preserva la narrativa completa pero delata su estructura. El visitante nota que hay un principio y un fin, lo que reduce el efecto de máquina que ya estaba andando antes de que llegara.

**Loop con curva de degradación visual progresiva:** la interfaz se rompe a medida que el visitante avanza, creando tensión creciente. Descartado en favor del loop plano para reducir capas de complejidad y agregar elementos precisos de forma incremental.

## Razones

El flujo lineal le da forma de experiencia al visitante: hay un arco, hay resolución. El loop infinito plano lo convierte en participante de un sistema que no lo reconoce como sujeto con inicio ni fin. La máquina no sabe que llegó y no sabrá que se fue.

La eliminación del inicio también resuelve un problema práctico: no hay pantalla "de bienvenida" que delate que la obra es una obra.
