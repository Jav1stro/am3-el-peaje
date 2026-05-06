import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import { useFlowStore } from '../../store/useFlowStore'
import DegradedButton from '../../components/DegradedButton'

function getRandomText(exclude) {
  const pool = captchas.distorted.filter((t) => t !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function DistortedTextCaptcha({ onDone }) {
  const addError = useFlowStore((s) => s.addError)

  const [attempt, setAttempt] = useState(0)
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const [currentText, setCurrentText] = useState(() => {
    return captchas.distorted[Math.floor(Math.random() * captchas.distorted.length)]
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return

    const newAttempt = attempt + 1

    if (newAttempt >= 2) {
      onDone()
      return
    }

    addError()
    setError('Respuesta inválida. El texto ha cambiado. Intentá de nuevo.')
    setCurrentText(getRandomText(currentText))
    setValue('')
    setAttempt(newAttempt)
  }

  return (
    <div>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Transcribí el texto que ves a continuación.
      </p>

      <div
        style={{
          padding: '20px',
          marginBottom: '16px',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px), repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,0,0.03) 7px, rgba(0,0,0,0.03) 8px)',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '24px',
            letterSpacing: '0.25em',
            color: '#333',
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(180,0,0,0.4)',
            textDecorationThickness: '1px',
            filter: 'blur(0.4px)',
          }}
        >
          {currentText}
        </span>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: '10px 12px',
            backgroundColor: '#fce8e6',
            border: '1px solid #f5c6c2',
            borderRadius: '4px',
            fontSize: '13px',
            color: 'var(--color-error)',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ingresá el texto..."
          className="input-field"
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            marginBottom: '12px',
            outline: 'none',
            color: 'var(--text-main)',
            backgroundColor: 'transparent',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.1em',
          }}
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
