import { useThemeStore } from './store/useThemeStore'
import { themes } from './data/themes'
import CaptchaRouter from './screens/CaptchaRouter'
import DocsPage from './screens/DocsPage'
import MatrixRain from './components/MatrixRain'

export default function App() {
  const themeId = useThemeStore((s) => s.themeId)
  const theme = themes[themeId]

  if (window.location.pathname === '/docs') {
    return <DocsPage />
  }

  return (
    <>
      {theme.hasMatrixRain && <MatrixRain />}
      <CaptchaRouter />
    </>
  )
}
