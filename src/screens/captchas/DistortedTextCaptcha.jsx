import { useState } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

export default function DistortedTextCaptcha({ onDone }) {
  const [value, setValue] = useState('')
  const [currentText] = useState(
    () => captchas.distorted[Math.floor(Math.random() * captchas.distorted.length)]
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onDone()
  }

  return (
    <div>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          letterSpacing: '0.04em',
        }}
      >
        Transcribí el texto que ves a continuación.
      </p>

      <div
        style={{
          padding: '20px',
          marginBottom: '16px',
          backgroundColor: 'var(--tile-bg)',
          border: '1px solid var(--border)',
          textAlign: 'center',
          userSelect: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(var(--primary-rgb),0.03) 3px, rgba(var(--primary-rgb),0.03) 4px)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '24px',
            letterSpacing: '0.25em',
            color: 'var(--color-primary)',
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(var(--error-rgb),0.5)',
            textDecorationThickness: '1px',
            filter: 'blur(0.4px)',
            textShadow: '0 0 8px rgba(var(--primary-rgb),0.4)',
          }}
        >
          {currentText}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ingresá el texto..."
          className="input-field"
          style={{ marginBottom: '12px' }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <DegradedButton type="submit" disabled={!value.trim()}>
          Verificar
        </DegradedButton>
      </form>
    </div>
  )
}
