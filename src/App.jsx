import { useThemeStore } from './store/useThemeStore'
import { themes } from './data/themes'
import CaptchaRouter from './screens/CaptchaRouter'
import DocsPage from './screens/DocsPage'
import MatrixRain from './components/MatrixRain'
import ProgressIndicator from './components/ProgressIndicator'
import { usePresence } from './hooks/usePresence'

export default function App() {
  const themeId = useThemeStore((s) => s.themeId)
  const theme = themes[themeId]
  usePresence()

  if (window.location.pathname === '/docs') {
    return <DocsPage />
  }

  return (
    <>
      {theme.hasMatrixRain && <MatrixRain />}
      <ProgressIndicator />
      <CaptchaRouter />
      <a
        href="/docs"
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.6,
          zIndex: 10,
        }}
      >
        Documentación
      </a>
    </>
  )
}
