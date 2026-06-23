import { useState, useCallback, useRef, useEffect } from 'react'
import { CAPTCHA_TYPES } from '../store/useFlowStore'
import { useThemeStore } from '../store/useThemeStore'
import { themes } from '../data/themes'
import { captchaMeta } from '../data/captchas'
import CheckboxCaptcha from './captchas/CheckboxCaptcha'
import ImageCaptcha from './captchas/ImageCaptcha'
import AbsurdCaptcha from './captchas/AbsurdCaptcha'
import DistortedTextCaptcha from './captchas/DistortedTextCaptcha'
import TosCaptcha from './captchas/TosCaptcha'

const CAPTCHA_COMPONENTS = {
  checkbox: CheckboxCaptcha,
  image: ImageCaptcha,
  absurd: AbsurdCaptcha,
  distorted: DistortedTextCaptcha,
  tos: TosCaptcha,
}

function CaptchaDemo({ type }) {
  const [resetKey, setResetKey] = useState(0)
  const [completed, setCompleted] = useState(false)

  const Component = CAPTCHA_COMPONENTS[type]

  const handleDone = useCallback(() => {
    setCompleted(true)
    setTimeout(() => {
      setResetKey((k) => k + 1)
      setCompleted(false)
    }, 1500)
  }, [])

  if (!Component) return null

  return (
    <div style={{ position: 'relative', minHeight: '80px' }}>
      {completed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(8, 12, 8, 0.88)',
            zIndex: 10,
            backdropFilter: 'blur(2px)',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 255, 65, 0.15)',
                border: '2px solid #00ff41',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#00ff41',
              }}
            >
              ✓
            </div>
            <span
              style={{
                color: '#4a8a4a',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.05em',
              }}
            >
              Completado — reiniciando...
            </span>
          </div>
        </div>
      )}
      <div key={resetKey}>
        <Component onDone={handleDone} />
      </div>
    </div>
  )
}

function CollapsibleCard({ index, type, meta }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [open])

  return (
    <section style={styles.card}>
      <div
        style={styles.cardHeader}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }}
      >
        <div style={styles.cardTitleRow}>
          <span style={styles.numberBadge}>{index + 1}</span>
          <h2 style={styles.cardTitle}>{meta?.label || type}</h2>
          <span style={styles.typeBadge}>{type}</span>
          <span
            style={{
              ...styles.chevron,
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ›
          </span>
        </div>
        {meta?.description && (
          <p style={styles.description}>{meta.description}</p>
        )}
      </div>
      <div
        style={{
          height: open ? height : 0,
          overflow: 'hidden',
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef}>
          <div style={styles.demoArea}>
            <div style={styles.demoLabel}>
              <span style={styles.demoDot} />
              <span>Demo interactiva</span>
            </div>
            <div style={styles.demoContent}>
              {open && <CaptchaDemo type={type} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#111114',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 96px',
  },
  header: {
    marginBottom: '48px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 4px',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '15px',
    color: '#777',
    margin: '0 0 20px',
    lineHeight: 1.5,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    backgroundColor: 'rgba(0, 255, 65, 0.07)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
  },
  badgeCount: {
    color: '#00ff41',
    fontWeight: 600,
  },
  badgeLabel: {
    color: '#666',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a1e',
    borderRadius: '10px',
    border: '1px solid #2a2a2e',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.15s',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  numberBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    color: '#00ff41',
    fontSize: '13px',
    fontWeight: 600,
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
  },
  typeBadge: {
    marginLeft: 'auto',
    padding: '3px 10px',
    fontSize: '11px',
    color: '#666',
    backgroundColor: '#222225',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.03em',
  },
  description: {
    margin: '0 0 0 40px',
    fontSize: '13.5px',
    color: '#888',
    lineHeight: 1.6,
  },
  demoArea: {
    padding: '24px',
    backgroundColor: 'var(--card-bg)',
  },
  demoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '16px',
    fontSize: '11px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-mono)',
  },
  demoDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#00ff41',
    boxShadow: '0 0 4px rgba(0,255,65,0.5)',
  },
  demoContent: {
    maxWidth: '420px',
    margin: '0 auto',
  },
  chevron: {
    fontSize: '22px',
    color: '#555',
    transition: 'transform 0.25s ease',
    lineHeight: 1,
    flexShrink: 0,
    marginLeft: '8px',
  },
}

function ThemeSelector() {
  const themeId = useThemeStore((s) => s.themeId)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
      <span style={{ fontSize: '12px', color: '#666', flexShrink: 0 }}>Estética:</span>
      {Object.values(themes).map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: `1px solid ${themeId === t.id ? '#22c55e' : '#333'}`,
            background: themeId === t.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
            color: themeId === t.id ? '#22c55e' : '#666',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function DocsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>El Peaje</h1>
          <p style={styles.subtitle}>
            Catálogo de captchas cargados en el pool. Cada demo es interactiva
            — probá el captcha y se reinicia automáticamente.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={styles.badge}>
              <span style={styles.badgeCount}>{CAPTCHA_TYPES.length}</span>
              <span style={styles.badgeLabel}>captchas en el pool</span>
            </div>
          </div>
          <ThemeSelector />
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '13px',
              color: '#22c55e',
              textDecoration: 'none',
              opacity: 0.8,
            }}
          >
            ← Ir al home
          </a>
        </header>

        <div style={styles.list}>
          {CAPTCHA_TYPES.map((type, i) => (
            <CollapsibleCard
              key={type}
              index={i}
              type={type}
              meta={captchaMeta[type]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
