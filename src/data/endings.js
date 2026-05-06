export const endings = [
  {
    id: "machine",
    icon: "🤖",
    title: "Verificación fallida",
    body: "Su comportamiento no coincide con patrones humanos conocidos. Esta sesión ha sido registrada. Acceso denegado de forma permanente.",
    glitch: false,
    autoRestart: false,
  },
  {
    id: "reserved",
    icon: "🔒",
    title: "Acceso restringido",
    body: "Esta sección está reservada para sistemas automatizados. Los usuarios humanos no están autorizados a continuar en este entorno.",
    glitch: false,
    autoRestart: false,
  },
  {
    id: "error",
    icon: "⚠",
    title: "ERR_VERIFICATION_LOOP_0x4F2",
    body: "undefined is not a function\nnull\n[object Object]\nReintentando en 3... 2... 1...",
    glitch: true,
    autoRestart: true,
    autoRestartDelay: 4000,
  },
]
