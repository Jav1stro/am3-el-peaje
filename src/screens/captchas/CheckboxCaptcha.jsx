import { useState } from 'react'

export default function CheckboxCaptcha({ onDone }) {
  const [state, setState] = useState('idle') // idle | verifying | done

  function handleClick() {
    if (state !== 'idle') return
    setState('verifying')
    setTimeout(() => {
      setState('done')
      setTimeout(onDone, 400)
    }, 1100)
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--tile-bg)',
        cursor: state === 'idle' ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            border: `2px solid ${state === 'done' ? 'var(--color-primary)' : 'var(--border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: state === 'done' ? 'rgba(var(--primary-rgb), 0.15)' : 'transparent',
            flexShrink: 0,
            animation: state === 'verifying' ? 'spin 0.6s linear infinite' : 'none',
            boxShadow: state === 'done' ? '0 0 6px rgba(var(--primary-rgb), 0.4)' : 'none',
          }}
        >
          {state === 'done' && (
            <span style={{ color: 'var(--color-primary)', fontSize: '16px', lineHeight: 1 }}>✓</span>
          )}
          {state === 'verifying' && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>◌</span>
          )}
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
          No soy un robot
        </span>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontSize: '9px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            letterSpacing: '0.06em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '2px', opacity: 0.5 }}>🛡</div>
          <div>reCAPTCHA</div>
          <div>Privacidad · Términos</div>
        </div>
      </div>
    </div>
  )
}
