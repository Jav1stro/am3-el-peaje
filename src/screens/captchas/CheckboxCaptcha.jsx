import { useState } from 'react'

export default function CheckboxCaptcha({ onDone }) {
  const [state, setState] = useState('idle') // idle | verifying | done

  function handleClick() {
    if (state !== 'idle') return
    setState('verifying')
    setTimeout(() => {
      setState('done')
      setTimeout(onDone, 300)
    }, 1100)
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
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
            border: `2px solid ${state === 'done' ? '#1a73e8' : '#aaa'}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: state === 'done' ? '#1a73e8' : '#fff',
            flexShrink: 0,
            animation: state === 'verifying' ? 'spin 0.6s linear infinite' : 'none',
          }}
        >
          {state === 'done' && (
            <span style={{ color: '#fff', fontSize: '16px', lineHeight: 1 }}>✓</span>
          )}
          {state === 'verifying' && (
            <span style={{ color: '#aaa', fontSize: '10px' }}>◌</span>
          )}
        </div>
        <span
          style={{
            fontSize: '14px',
            color: 'var(--text-main)',
            fontWeight: '400',
          }}
        >
          No soy un robot
        </span>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', color: '#aaa', lineHeight: 1.3 }}>
          <div style={{ fontSize: '18px', marginBottom: '2px', opacity: 0.6 }}>🛡</div>
          <div>reCAPTCHA</div>
          <div>Privacidad · Términos</div>
        </div>
      </div>
    </div>
  )
}
