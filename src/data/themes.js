const STORAGE_KEY = 'el-peaje-estetica'

export const DEFAULT_THEME = 'classic'

export const themes = {
  classic: {
    id: 'classic',
    label: 'reCAPTCHA clásico',
    showChrome: false,
    hasScanlines: false,
    hasGlitch: false,
    hasMatrixRain: false,
    cssVars: {
      '--color-primary': '#4285f4',
      '--color-primary-dark': '#3367d6',
      '--color-error': '#d93025',
      '--bg': '#f0f2f5',
      '--card-bg': '#ffffff',
      '--text-main': '#202124',
      '--text-secondary': '#5f6368',
      '--border': '#d3d3d3',
      '--font-main': "system-ui, -apple-system, Arial, sans-serif",
      '--font-mono': "system-ui, -apple-system, Arial, sans-serif",
      '--tile-bg': '#f8f9fa',
      '--tile-selected-bg': 'rgba(66, 133, 244, 0.08)',
      '--option-bg': '#f8f9fa',
      '--option-selected-bg': 'rgba(66, 133, 244, 0.08)',
      '--input-bg': '#ffffff',
      '--error-bg': '#fce8e6',
      '--tos-bg': '#f8f9fa',
      '--border-radius': '3px',
      '--card-shadow': '0 1px 4px rgba(0, 0, 0, 0.1)',
      '--primary-rgb': '66, 133, 244',
      '--error-rgb': '217, 48, 37',
    },
  },

  matrix: {
    id: 'matrix',
    label: 'Matrix',
    showChrome: true,
    hasScanlines: true,
    hasGlitch: true,
    hasMatrixRain: true,
    cssVars: {
      '--color-primary': '#00ff41',
      '--color-primary-dark': '#00cc33',
      '--color-error': '#ff3300',
      '--bg': '#080c08',
      '--card-bg': '#0d110d',
      '--text-main': '#00ff41',
      '--text-secondary': '#4a8a4a',
      '--border': '#1a3a1a',
      '--font-main': "'Space Mono', 'Courier New', monospace",
      '--font-mono': "'Space Mono', 'Courier New', monospace",
      '--tile-bg': '#0a0f0a',
      '--tile-selected-bg': 'rgba(0, 255, 65, 0.1)',
      '--option-bg': '#0a0f0a',
      '--option-selected-bg': 'rgba(0, 255, 65, 0.1)',
      '--input-bg': '#050805',
      '--error-bg': '#1a0000',
      '--tos-bg': '#090d09',
      '--border-radius': '0px',
      '--card-shadow': '0 0 10px rgba(0, 255, 65, 0.1), 0 0 40px rgba(0, 255, 65, 0.03)',
      '--primary-rgb': '0, 255, 65',
      '--error-rgb': '255, 51, 0',
    },
  },

  darktech: {
    id: 'darktech',
    label: 'Dark Tech',
    showChrome: false,
    hasScanlines: false,
    hasGlitch: false,
    hasMatrixRain: false,
    cssVars: {
      '--color-primary': '#22c55e',
      '--color-primary-dark': '#16a34a',
      '--color-error': '#ef4444',
      '--bg': '#111318',
      '--card-bg': '#1a1d24',
      '--text-main': '#c8cdd8',
      '--text-secondary': '#4a5060',
      '--border': '#2a2e38',
      '--font-main': "'Inter', system-ui, sans-serif",
      '--font-mono': "'Inter', system-ui, sans-serif",
      '--tile-bg': '#14161c',
      '--tile-selected-bg': 'rgba(34, 197, 94, 0.08)',
      '--option-bg': '#14161c',
      '--option-selected-bg': 'rgba(34, 197, 94, 0.08)',
      '--input-bg': '#111318',
      '--error-bg': 'rgba(239, 68, 68, 0.08)',
      '--tos-bg': '#14161c',
      '--border-radius': '8px',
      '--card-shadow': '0 4px 12px rgba(0, 0, 0, 0.25)',
      '--primary-rgb': '34, 197, 94',
      '--error-rgb': '239, 68, 68',
    },
  },
}

export function getStoredThemeId() {
  try {
    const id = localStorage.getItem(STORAGE_KEY)
    return id && themes[id] ? id : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function applyTheme(themeId) {
  const theme = themes[themeId]
  if (!theme) return
  const root = document.documentElement
  root.dataset.theme = themeId
  for (const [prop, value] of Object.entries(theme.cssVars)) {
    root.style.setProperty(prop, value)
  }
}

export function storeTheme(themeId) {
  if (!themes[themeId]) return
  try {
    localStorage.setItem(STORAGE_KEY, themeId)
  } catch {}
  applyTheme(themeId)
}

applyTheme(getStoredThemeId())
