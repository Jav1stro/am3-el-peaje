# El Peaje — CLAUDE.md

## Qué es este proyecto

**El Peaje** es una instalación de arte interactivo. Un código QR impreso en sala redirige al visitante a esta aplicación web. La app simula un sistema burocrático de "verificación de identidad" para acceder a un objeto simple (un vaso de agua dentro de una caja de cristal). El sistema nunca abre la caja.

El concepto central es el **captcha** como metáfora del sometimiento digital cotidiano. La obra cita a Varoufakis (tecnofeudalismo), Byung-Chul Han (transparencia como autovigilancia) y Adorno (industria cultural).

---

## Stack

- **React** con Vite
- **Tailwind CSS** para estilos base (usado mínimamente)
- **CSS puro** para la estética y efectos visuales
- **Framer Motion** solo para transiciones entre captchas
- **Zustand** para estado global
- Sin backend. Todo es frontend puro.

---

## Estructura de archivos

```
el-peaje/
├── CLAUDE.md
├── CONTEXT.md                         # Glosario de dominio
├── docs/adr/
│   ├── 0001-loop-infinito.md          # Decisión: loop vs flujo lineal
│   ├── 0002-esteticas-intercambiables.md # Decisión: sistema de estéticas
│   └── 0003-rechazo-teatral.md        # Decisión: excepción al "siempre acepta"
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                        # Renderiza CaptchaRouter + MatrixRain condicional
│   ├── store/
│   │   ├── useFlowStore.js            # pool, poolIndex, isVerifying
│   │   └── useThemeStore.js           # themeId, setTheme
│   ├── data/
│   │   ├── captchas.js                # Datos de todos los captchas
│   │   └── themes.js                  # Definiciones de las 3 estéticas + apply/store
│   ├── styles/
│   │   ├── base.css                   # CSS variables (default: classic), efectos condicionales por [data-theme]
│   │   └── degradation.css            # Guardado para uso futuro (inactivo)
│   ├── components/
│   │   ├── Layout.jsx                 # Chrome condicional: solo matrix muestra tease + QR finders
│   │   ├── DegradedButton.jsx         # Botón base (usa clase .btn-primary)
│   │   └── MatrixRain.jsx             # Canvas con lluvia de caracteres (solo estética matrix)
│   └── screens/
│       ├── CaptchaRouter.jsx          # Loop infinito + spinner "Verificando..."
│       ├── DocsPage.jsx               # Catálogo de captchas + selector de estética
│       └── captchas/
│           ├── CheckboxCaptcha.jsx
│           ├── ImageCaptcha.jsx
│           ├── AbsurdCaptcha.jsx
│           ├── DistortedTextCaptcha.jsx
│           ├── TosCaptcha.jsx
│           └── MicrophoneCaptcha.jsx
```

---

## Estado global (Zustand)

### useFlowStore

```js
{
  pool: Array,        // secuencia shuffleada de tipos de captcha
  poolIndex: Number,  // posición actual en el pool
  isVerifying: Boolean, // true mientras muestra "Verificando..."
}
```

Acciones:
- `nextCaptcha()` — avanza el índice; si el pool se agotó, lo reshufflea evitando repetición inmediata
- `setVerifying(bool)` — activa/desactiva el spinner

### useThemeStore

```js
{
  themeId: String,    // 'classic' | 'matrix' | 'darktech'
}
```

Acciones:
- `setTheme(id)` — persiste en localStorage, aplica CSS variables y actualiza el estado

---

## Flujo

No hay flujo. La app no tiene inicio ni final.

El visitante llega directamente a un captcha. Al completarlo:
1. `onDone()` se llama desde el captcha
2. `CaptchaRouter` activa el spinner "Verificando..." durante 1.5 segundos
3. `nextCaptcha()` carga el siguiente tipo del pool
4. Se repite indefinidamente

El sistema **siempre acepta** cualquier respuesta. No hay mensajes de error. No hay validación. El captcha es teatro.

---

## Captchas disponibles

El pool vive en `useFlowStore.js` como `CAPTCHA_TYPES`. Agregar un captcha nuevo requiere:
1. Crear el componente en `src/screens/captchas/`
2. Sumar el identificador a `CAPTCHA_TYPES` en el store
3. Registrarlo en `CAPTCHA_COMPONENTS` en `CaptchaRouter.jsx`

### Tipos actuales

| ID | Componente | Comportamiento |
|----|-----------|----------------|
| `checkbox` | CheckboxCaptcha | Checkbox "No soy un robot". Gira mientras verifica, luego llama `onDone`. |
| `image` | ImageCaptcha | Grilla 3×3 de emojis con pregunta ambigua. `Verificar` llama `onDone` sin importar la selección. |
| `absurd` | AbsurdCaptcha | Pregunta lógica con opciones absurdas. `Verificar` (con cualquier selección) llama `onDone`. |
| `distorted` | DistortedTextCaptcha | Texto distorsionado para transcribir. Cualquier texto válido llama `onDone`. |
| `tos` | TosCaptcha | Términos y condiciones que crecen al scrollear. El botón se habilita al llegar al final. |
| `microphone` | MicrophoneCaptcha | Pide activar micrófono y suspirar. Graba 5s con ondas reactivas, analiza con métricas fake, rechaza el primer intento (rechazo teatral, ver ADR 0003). Acepta el segundo. |

---

## Sistema de estéticas

La app soporta tres estéticas visuales intercambiables. La selección se persiste en localStorage (única excepción a la regla de "no localStorage") y se aplica vía CSS variables + atributo `data-theme` en el root.

### Estéticas disponibles

| ID | Label | Default | Chrome | Fondo | Efectos |
|----|-------|---------|--------|-------|---------|
| `classic` | reCAPTCHA clásico | ✓ | No | Gris claro (#f0f2f5) | Ninguno |
| `matrix` | Matrix | | Sí (tease + QR finders + footer) | QR grid + canvas rain | Scanlines, glitch |
| `darktech` | Dark Tech | | No | Oscuro (#111318) | Ninguno |

### Arquitectura

- **`themes.js`**: define CSS variables, flags (`showChrome`, `hasMatrixRain`, `hasScanlines`, `hasGlitch`) y funciones `applyTheme()`/`storeTheme()`. Ejecuta `applyTheme()` como side-effect al importarse.
- **`base.css`**: declara defaults (classic) en `:root`. Efectos visuales (scanlines, glitch, QR grid) condicionados a `[data-theme="matrix"]`.
- **`Layout.jsx`**: lee `useThemeStore` para decidir si renderiza chrome completo (matrix) o layout limpio (classic/darktech).
- **`MatrixRain.jsx`**: canvas JS con lluvia de caracteres. Solo se monta cuando la estética es `matrix`.
- **`DocsPage.jsx`**: selector compacto en el header permite cambiar la estética.

### CSS variables por estética

Los componentes usan `var(--xxx)` para colores, fuentes y bordes. Glows y sombras usan `rgba(var(--primary-rgb), opacity)` para adaptarse automáticamente.

Variables clave: `--color-primary`, `--bg`, `--card-bg`, `--text-main`, `--text-secondary`, `--border`, `--font-main`, `--font-mono`, `--border-radius`, `--card-shadow`, `--primary-rgb`, `--error-rgb`.

### Cambiar la estética

Desde `/docs`: usar el selector en el header.
Por código: `useThemeStore.getState().setTheme('matrix')`.

---

## Tease ambiental (solo estética matrix)

Texto estático visible en el header de la interfaz cuando la estética es `matrix`:

> **Resuelva el captcha para acceder**

No cambia. No avanza. No guía. La referencia a la caja es implícita y permanente.

Las estéticas `classic` y `darktech` muestran solo la card centrada, sin chrome.

---

## Lo que NO hacer

- No mostrar mensajes de error en los captchas. El sistema siempre acepta.
- No agregar barras de progreso, contadores, ni ningún indicador de avance.
- No usar `localStorage` excepto para la estética visual (ver ADR 0002).
- No usar APIs externas ni enviar datos reales.
- No usar librerías de componentes UI (MUI, shadcn, etc.).
- No agregar lógica de negocio en los componentes. Todo en el store o en los archivos de data.
- No reactivar el sistema de degradación sin decisión explícita — `degradation.css` está inactivo.
- No cambiar textos ni lógica de captchas según la estética activa. Las estéticas solo afectan lo visual.
