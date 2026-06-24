import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

export default function SecurityQuestionCaptcha({ onDone }) {
  const variantRef = useRef(
    captchas.security[Math.floor(Math.random() * captchas.security.length)]
  )
  const variant = variantRef.current
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (variant.type === 'text' && !value.trim()) return
    if (variant.type === 'choice' && selected === null) return
    onDone()
  }

  return (
    <div>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-main)',
          marginBottom: '2px',
          letterSpacing: '0.04em',
        }}
      >
        Verificación de identidad
      </p>

      <form onSubmit={handleSubmit}>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-main)',
            marginBottom: '12px',
            letterSpacing: '0.02em',
            fontWeight: 500,
          }}
        >
          {variant.question}
        </p>

        {variant.type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ingresá su respuesta..."
            className="input-field"
            style={{ marginBottom: '12px' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        )}

        {variant.type === 'choice' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            {variant.options.map((opt, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  padding: '14px 12px',
                  border: `2px solid ${selected === i ? 'var(--color-primary)' : 'var(--border)'}`,
                  backgroundColor: selected === i ? 'var(--option-selected-bg)' : 'var(--option-bg)',
                  boxShadow: selected === i ? '0 0 8px rgba(var(--primary-rgb), 0.25)' : 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                  textAlign: 'center',
                  userSelect: 'none',
                  letterSpacing: '0.04em',
                  transition: 'border-color 0.12s, background-color 0.12s',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}

        <DegradedButton
          type="submit"
          disabled={variant.type === 'text' ? !value.trim() : selected === null}
        >
          Verificar
        </DegradedButton>
      </form>
    </div>
  )
}
