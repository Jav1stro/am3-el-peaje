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
    </>
  )
}
