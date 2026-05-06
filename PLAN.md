# El Peaje — Plan de implementación

Documento de progreso vivo. Marcar cada tarea a medida que se completa.

---

## Estado general

| Fase | Estado |
|------|--------|
| Setup del proyecto | ✅ Completo |
| Archivos de datos | ✅ Completo |
| Store (Zustand) | ✅ Completo |
| Estilos y degradación | ✅ Completo |
| Componentes compartidos | ✅ Completo |
| Pantallas del flujo de email | ✅ Completo |
| Captchas | ✅ Completo |
| Pantalla de desenlace | ✅ Completo |
| App.jsx + main.jsx | ✅ Completo |

---

## Fase 1 — Setup

- [x] `package.json` — React 18, Vite 5, Zustand 4, Framer Motion 11, Tailwind 3
- [x] `vite.config.js`
- [x] `tailwind.config.js`
- [x] `postcss.config.js`
- [x] `index.html` — fuentes Roboto + Space Mono desde Google Fonts
- [x] Estructura de carpetas `src/{store,data,styles,components,screens/captchas}`
- [x] `npm install` — dependencias instaladas

---

## Fase 2 — Datos

- [x] `src/data/phrases.js` — 6 frases conceptuales (Turing, tecnofeudalismo)
- [x] `src/data/endings.js` — 3 desenlaces: `machine`, `reserved`, `error`
- [x] `src/data/captchas.js`
  - [x] `image` — 3 variantes de grilla 3×3 con emojis y array `correct[]`
  - [x] `absurd` — 4 variantes de preguntas con opciones ambiguas
  - [x] `distorted` — 6 strings distorsionados (leet speak)
  - [x] `tos` — ~800 palabras de términos reales (IA, privilegio, tiempo como moneda)

---

## Fase 3 — Store (Zustand)

- [x] `src/store/useFlowStore.js`
  - [x] Estado: `step`, `email`, `degradationLevel`, `captchaQueue`, `captchaIndex`, `emailAttempts`, `endingIndex`, `errors`, `mathChallenge`, `phraseIndex`
  - [x] `endingIndex` aleatorio al inicializar
  - [x] `captchaQueue` = `['checkbox', 'image', 'absurd', 'distorted', 'tos']`
  - [x] Acciones: `nextStep`, `goToStep`, `addError`, `setEmail`, `setDegradation`, `setMathChallenge`, `advanceCaptcha`, `advancePhraseIndex`, `resetFlow`
  - [x] Sin `persist` (estado solo en memoria)

---

## Fase 4 — Estilos

- [x] `src/styles/base.css` — Tailwind directives, variables CSS, keyframe `spin`
- [x] `src/styles/degradation.css` — 5 niveles con selector `[data-deg="N"]`
  - [x] Nivel 0: base limpia (Google/reCAPTCHA)
  - [x] Nivel 1: monospace en labels e inputs
  - [x] Nivel 2: card rotada −0.5°, color primario naranja/rojo
  - [x] Nivel 3: sin border-radius, tipografía mezclada, caracteres extraños en labels
  - [x] Nivel 4: layout roto, `transition-delay` en botones, sombra falsa, animaciones blink/flicker

---

## Fase 5 — Componentes compartidos

- [x] `src/components/Layout.jsx` — card centrada, aplica `data-deg` en `document.documentElement`
- [x] `src/components/ProgressBar.jsx` — barra superior, % basado en `step`
- [x] `src/components/DegradedButton.jsx` — botón con clase `btn-primary`, afectado por degradation CSS
- [x] `src/components/ConceptPhrase.jsx` — pantalla negra, auto-avanza a los 2.5s, fade con Framer Motion

---

## Fase 6 — Pantallas del flujo email

- [x] `src/screens/EmailStep.jsx` (step 0) — cualquier submit → step 1
- [x] `src/screens/EmailFailed.jsx` (step 1) — error, +1 degradation al montar, reintentar → step 2
- [x] `src/screens/EmailSent.jsx` (step 2) — spinner, link aparece después de 8 segundos
- [x] `src/screens/NoEmailReceived.jsx` (step 3) — genera A+B aleatorio, guarda en store
- [x] `src/screens/PhysicalCount.jsx` (step 4) — valida resultado, máx 4 intentos, +1 deg cada 2 errores

---

## Fase 7 — Captchas

- [x] `src/screens/CaptchaRouter.jsx` (step 5) — muestra ConceptPhrase antes de cada captcha, itera la queue
- [x] `src/screens/captchas/CheckboxCaptcha.jsx` — checkbox animado, avanza automático en ~1.4s
- [x] `src/screens/captchas/ImageCaptcha.jsx` — grilla 3×3, error si no coincide `correct[]`, avanza igual
- [x] `src/screens/captchas/AbsurdCaptcha.jsx` — preguntas ambiguas, siempre falla, siempre avanza
- [x] `src/screens/captchas/DistortedTextCaptcha.jsx` — 2 intentos, texto cambia en intento 1
- [x] `src/screens/captchas/TosCaptcha.jsx` — scroll obligatorio, botón deshabilitado hasta el final

---

## Fase 8 — Desenlace

- [x] `src/screens/Ending.jsx` (step 6)
  - [x] Lee `endingIndex` del store
  - [x] Desenlace `error`: `autoRestart` con cuenta regresiva de 4 segundos
  - [x] Botón "Volver a intentar" → `resetFlow()`
  - [x] SESSION_ID aleatorio visible al pie

---

## Fase 9 — App + main

- [x] `src/main.jsx` — monta React, importa estilos
- [x] `src/App.jsx` — switch por `step`, `AnimatePresence` + fade entre pantallas

---

## Pendiente / Atención manual

- [ ] Verificar que las fuentes Roboto y Space Mono cargan bien desde Google Fonts en el dispositivo de sala (puede requerir conexión)
- [ ] Probar en viewport real de 390px (iPhone)
- [ ] Ajustar timing del spinner de EmailSent si 8s se siente muy largo en sala
- [ ] Considerar si el desenlace `error` con autoRestart de 4s es suficientemente confuso o requiere más tiempo
- [ ] Agregar meta `theme-color` en index.html para estética del navegador móvil

---

## Flujo de pasos (referencia rápida)

```
step 0 → EmailStep
step 1 → EmailFailed        (+1 deg)
step 2 → EmailSent          (spinner 8s)
step 3 → NoEmailReceived    (genera A+B)
step 4 → PhysicalCount      (+1 deg c/2 errores, máx 4 intentos)
step 5 → CaptchaRouter      (5 captchas con ConceptPhrase entre cada uno)
step 6 → Ending             (1 de 3 desenlaces elegido al inicio)
```

## Cómo correr el proyecto

```bash
npm run dev      # desarrollo en localhost:5173
npm run build    # build de producción
npm run preview  # preview del build
```
