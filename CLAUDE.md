# El Peaje — CLAUDE.md

## Qué es este proyecto

**El Peaje** es una instalación de arte interactivo. Un código QR impreso en sala redirige al visitante a esta aplicación web. La app simula un sistema burocrático de "verificación de identidad" para acceder a un objeto simple (un vaso de agua dentro de una caja de cristal). El sistema nunca abre la caja. Siempre falla.

El concepto central es el **captcha** como metáfora del sometimiento digital cotidiano. La obra cita a Varoufakis (tecnofeudalismo), Byung-Chul Han (transparencia como autovigilancia) y Adorno (industria cultural).

---

## Stack

- **React** con Vite
- **React Router** para las rutas de cada paso
- **Tailwind CSS** para estilos base
- **CSS puro** para los efectos de degradación (no usar librerías de animación externas)
- **Framer Motion** solo para transiciones entre pantallas
- Sin backend. Todo es frontend puro. No se envían mails reales.

---

## Estructura de archivos esperada

```
el-peaje/
├── CLAUDE.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── store/
│   │   └── useFlowStore.js        # Zustand store: estado global del flujo
│   ├── data/
│   │   ├── captchas.js            # Datos de todos los captchas
│   │   ├── phrases.js             # Frases conceptuales que aparecen entre pasos
│   │   └── endings.js             # Los 3 desenlaces posibles
│   ├── styles/
│   │   ├── base.css
│   │   └── degradation.css        # Clases CSS para cada nivel de degradación
│   ├── components/
│   │   ├── Layout.jsx             # Wrapper con la card central
│   │   ├── ProgressBar.jsx
│   │   ├── ConceptPhrase.jsx      # Frase conceptual flotante entre pasos
│   │   └── DegradedButton.jsx     # Botón que cambia con la degradación
│   └── screens/
│       ├── EmailStep.jsx          # Paso 1: mail falso
│       ├── EmailFailed.jsx        # Paso 1b: "email inválido", reintentar
│       ├── EmailSent.jsx          # Paso 1c: "te enviamos un código"
│       ├── NoEmailReceived.jsx    # Paso 1d: "no me llegó" → cuenta regresiva física
│       ├── PhysicalCount.jsx      # Paso 2: cuenta en papel, ingresar resultado
│       ├── CaptchaRouter.jsx      # Paso 3+: distribuye entre tipos de captcha
│       ├── captchas/
│       │   ├── CheckboxCaptcha.jsx
│       │   ├── ImageCaptcha.jsx
│       │   ├── AbsurdCaptcha.jsx
│       │   ├── DistortedTextCaptcha.jsx
│       │   └── TosCaptcha.jsx
│       └── Ending.jsx             # Pantalla final con el error
```

---

## Estado global (Zustand)

```js
{
  step: Number,               // paso actual (0–N)
  email: String,
  degradationLevel: Number,   // 0 a 4 — controla el CSS de degradación
  captchaQueue: Array,        // cola de captchas pendientes
  emailAttempts: Number,      // cuántas veces reintentó el mail
  endingIndex: Number,        // 0, 1 o 2 — elegido al azar al inicio
  errors: Number,             // errores acumulados
}
```

---

## Flujo de pantallas

### Paso 0 — EmailStep
- Campo de email limpio, interfaz tipo Google/reCAPTCHA
- Cualquier email que se ingrese la primera vez → ir a EmailFailed

### Paso 0b — EmailFailed
- Mensaje: "La dirección ingresada no parece válida. Por favor verificá e intentá nuevamente."
- El campo vuelve a mostrarse con el email anterior pre-cargado
- Al reintentar (con cualquier valor) → ir a EmailSent

### Paso 0c — EmailSent
- Mensaje: "Te enviamos un código de verificación a [email]. Puede demorar unos minutos."
- Botón: "Ingresar código" → lleva a pantalla de espera con spinner
- Después de 8 segundos de spinner, aparece link: "No recibí el correo"

### Paso 0d — NoEmailReceived
- Mensaje: "Entendemos que a veces los sistemas fallan. Para continuar de todos modos, necesitamos verificarte de otra manera."
- **Instrucción física**: "Tomá un papel y un bolígrafo. Calculá: [número aleatorio entre 200 y 500] + [número aleatorio entre 100 y 300]. Escribí el resultado en el papel. Vas a necesitarlo."
- Botón: "Ya lo tengo" → PhysicalCount

### Paso 1 — PhysicalCount
- Muestra: "Ingresá el resultado que calculaste en el papel."
- Campo numérico
- **La respuesta correcta es irrelevante** — cualquier número que ingresen avanza. Pero si el número ingresado es exactamente correcto, mostrar un mensaje ligeramente inquietante antes de avanzar: "Correcto. Cómo lo sabías."
- Si es incorrecto: "Resultado incorrecto. Por favor revisá tu cálculo y reintentá." — se puede reintentar infinitamente pero cada 2 intentos sube el degradationLevel

### Transición conceptual (entre pasos)
- Antes de cada captcha, mostrar por 2–3 segundos una frase en pantalla completa (fondo negro, texto centrado, tipografía limpia)
- Ver lista de frases en `data/phrases.js`

### Pasos 2–6 — Captchas (en orden)
1. **CheckboxCaptcha**: checkbox "No soy un robot". Gira mientras "verifica". Avanza solo.
2. **ImageCaptcha**: grilla 3×3 de emojis/iconos. Pregunta ambigua (ej: "Seleccioná las naranjas" pero hay objetos que podrían serlo según interpretación). Siempre marca error si no seleccionaste exactamente lo esperado — aunque lo esperado sea discutible.
3. **AbsurdCaptcha**: preguntas tipo "¿cuál de estas opciones es un color?" con opciones ambiguas (dos "Azul" idénticas, "El silencio", etc.). Cualquier respuesta puede ser marcada como incorrecta.
4. **DistortedTextCaptcha**: texto distorsionado para transcribir. Si lo escribe bien → "Respuesta inválida, el texto ha cambiado. Intentá de nuevo." Si lo escribe mal → mismo mensaje. Avanza después de 2 intentos.
5. **TosCaptcha**: términos y condiciones que deben scrollearse hasta el final para habilitar el botón. Los términos mencionan explícitamente que los datos serán usados para entrenar IA, que el acceso es un privilegio, etc.

### Paso final — Ending
- Desenlace elegido al azar entre los 3 al inicio de la sesión:
  1. "Su comportamiento no coincide con patrones humanos conocidos. Acceso denegado."
  2. "Esta sección está reservada para sistemas automatizados. Los usuarios humanos no están autorizados."
  3. `ERR_VERIFICATION_LOOP_0x4F2 / undefined is not a function / null` + reinicio automático
- Botón "Volver a intentar" → reinicia desde el principio (con nuevo endingIndex aleatorio)

---

## Sistema de degradación visual

Usar la clase CSS `data-degradation="N"` en el elemento `<body>` o en el wrapper principal. N va de 0 a 4.

| Nivel | Qué cambia |
|-------|------------|
| 0 | Interfaz limpia, Google-like, sans-serif, colores neutros |
| 1 | Tipografía levemente monoespaciada en algunos elementos. Bordes más marcados. |
| 2 | Card ligeramente rotada (`rotate(-0.5deg)`). Color primario deriva hacia rojo/naranja. Algunos textos en `font-family: monospace`. |
| 3 | Border-radius eliminado. Tipografía mezclada. Aparecen caracteres extraños en labels. Colores desaturados salvo errores en rojo intenso. |
| 4 | Layout roto: card con transform adicional. Textos superpuestos. Letras reemplazadas por equivalentes numéricos (h4ck3r style). Botones con delays antes de responder. |

Implementar en `degradation.css` como atributos CSS: `[data-deg="2"] .card { transform: rotate(-0.5deg); }` etc.

---

## Frases conceptuales (data/phrases.js)

Mostrar entre pasos. Una por transición, en orden:

```js
export const phrases = [
  "En 1950, Alan Turing preguntó si las máquinas podían pensar.",
  "Hoy, las máquinas preguntan si nosotros podemos.",
  "Cada verificación entrena el sistema que te verifica.",
  "Tu atención es el precio. El acceso, la promesa.",
  "No hay error. El sistema funciona exactamente como fue diseñado.",
  "¿Cuánto tiempo llevas demostrando que existís?",
];
```

---

## Datos de captchas (data/captchas.js)

### ImageCaptcha — variantes
```js
[
  {
    question: "Seleccioná todas las imágenes que contengan una naranja.",
    tiles: [
      { emoji: "🍊", label: "img_0481", correct: true },
      { emoji: "🟠", label: "img_0482", correct: true },   // ¿es una naranja?
      { emoji: "🌅", label: "img_0483", correct: false },  // tiene naranja pero es un atardecer
      { emoji: "🍋", label: "img_0484", correct: false },
      { emoji: "🎃", label: "img_0485", correct: false },  // es naranja como color
      { emoji: "🟧", label: "img_0486", correct: false },
      { emoji: "🥕", label: "img_0487", correct: false },
      { emoji: "🍑", label: "img_0488", correct: false },
      { emoji: "🌸", label: "img_0489", correct: false },
    ]
  },
  // más variantes...
]
```

### AbsurdCaptcha — variantes
```js
[
  {
    question: "¿Cuál de estas opciones es un color?",
    note: "Seleccioná todas las correctas.",
    options: ["Azul", "Martes", "El silencio", "Azul"],
    // Las dos "Azul" son idénticas pero el sistema espera que elijas AMBAS o NINGUNA
    correct: [0, 3]
  },
  {
    question: "Una bicicleta tiene...",
    note: "Seleccioná la opción correcta.",
    options: ["2 ruedas", "Ruedas", "≥1 rueda", "Pedales (generalmente)"],
    correct: [0] // pero todas son técnicamente correctas
  },
  {
    question: "¿Qué es el agua?",
    note: "Elegí la mejor respuesta.",
    options: ["Un líquido", "H₂O", "Húmeda", "Sí"],
    correct: [1] // cualquier respuesta lógica es marcada mal
  },
  {
    question: "¿Cuál de estos números es mayor que 3?",
    note: "Seleccioná todas las que apliquen.",
    options: ["4", "3.1", "3,0001", "π"],
    correct: [0, 1, 2, 3] // si no los seleccionás todos, falla
  }
]
```

---

## Desenlaces (data/endings.js)

```js
export const endings = [
  {
    id: "machine",
    icon: "🤖",
    title: "Verificación fallida",
    body: "Su comportamiento no coincide con patrones humanos conocidos. Esta sesión ha sido registrada. Acceso denegado de forma permanente.",
    glitch: false,
  },
  {
    id: "reserved",
    icon: "🔒",
    title: "Acceso restringido",
    body: "Esta sección está reservada para sistemas automatizados. Los usuarios humanos no están autorizados a continuar en este entorno.",
    glitch: false,
  },
  {
    id: "error",
    icon: "⚠",
    title: "ERR_VERIFICATION_LOOP_0x4F2",
    body: "undefined is not a function\nnull\n[object Object]\nReintentando en 3... 2... 1...",
    glitch: true,
    autoRestart: true,
    autoRestartDelay: 4000,
  }
]
```

---

## Notas de diseño

- La estética inicial debe imitar **Cloudflare / reCAPTCHA de Google**: fondo gris claro, card blanca centrada, tipografía Roboto o similar, azul #4285f4 como color primario, bordes sutiles.
- A medida que sube la degradación, la app "colapsa" hacia algo roto, monoespaciado, hostil.
- **Nunca usar librerías de componentes UI** (MUI, shadcn, etc.). Todo CSS propio para tener control total de la degradación.
- El texto de los términos y condiciones debe ser largo y real (no lorem ipsum). Debe mencionar explícitamente el uso de datos para entrenamiento de IA.
- La app debe funcionar bien en **mobile** (el QR se escanea con el teléfono).
- No hay rutas reales. Todo es un estado en el store. Usar React Router solo si facilita el historial del navegador para evitar que el botón "atrás" rompa el flujo.

---

## Lo que NO hacer

- No enviar mails reales.
- No usar ninguna API externa.
- No usar `localStorage` para persistir estado (cada visita es nueva).
- No poner lógica de negocio en los componentes. Todo en el store o en los archivos de data.
- No hacer la interfaz "linda" en niveles altos de degradación. Tiene que sentirse rota.
