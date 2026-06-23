import { useThemeStore } from '../store/useThemeStore'
import { themes } from '../data/themes'

function QrFinder({ size = 22 }) {
  const inner = Math.round(size * 0.41)
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid var(--color-primary)',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 0 6px rgba(var(--primary-rgb), 0.35)',
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          background: 'var(--color-primary)',
          boxShadow: '0 0 4px rgba(var(--primary-rgb), 0.6)',
        }}
      />
    </div>
  )
}

function MatrixChrome({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        gap: '14px',
        background: 'transparent',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <QrFinder size={22} />
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            Sistema de verificación de identidad · v4.2.1
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-main)',
              fontWeight: '400',
              letterSpacing: '0.04em',
              textShadow: '0 0 8px rgba(var(--primary-rgb), 0.5)',
            }}
          >
            Resuelva el captcha para acceder
          </p>
        </div>
        <QrFinder size={22} />
      </div>

      <div
        className="card"
        style={{ width: '100%', maxWidth: '440px' }}
      >
        <div style={{ padding: '28px 22px' }}>{children}</div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.5,
          textAlign: 'center',
        }}
      >
        Objeto: vaso de agua · Acceso: pendiente · Protocolo CAPTCHA/4.2.1
      </p>
    </div>
  )
}

function CleanLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '440px' }}
      >
        <div style={{ padding: '28px 22px' }}>{children}</div>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const themeId = useThemeStore((s) => s.themeId)
  const theme = themes[themeId]

  if (theme.showChrome) {
    return <MatrixChrome>{children}</MatrixChrome>
  }
  return <CleanLayout>{children}</CleanLayout>
}
