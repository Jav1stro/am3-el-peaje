import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

export default function AbsurdCaptcha({ onDone }) {
  const variantRef = useRef(
    captchas.absurd[Math.floor(Math.random() * captchas.absurd.length)]
  )
  const variant = variantRef.current
  const [selected, setSelected] = useState([])

  function toggleOption(index) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <div>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-main)',
          marginBottom: '4px',
          letterSpacing: '0.04em',
        }}
      >
        {variant.question}
      </p>
      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          letterSpacing: '0.04em',
        }}
      >
        {variant.note}
      </p>

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
            onClick={() => toggleOption(i)}
            style={{
              padding: '14px 12px',
              border: `2px solid ${selected.includes(i) ? 'var(--color-primary)' : 'var(--border)'}`,
              backgroundColor: selected.includes(i) ? 'var(--option-selected-bg)' : 'var(--option-bg)',
              boxShadow: selected.includes(i) ? '0 0 8px rgba(var(--primary-rgb), 0.25)' : 'none',
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

      <DegradedButton onClick={onDone} disabled={selected.length === 0}>
        Verificar
      </DegradedButton>
    </div>
  )
}
