import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import { useFlowStore } from '../../store/useFlowStore'
import DegradedButton from '../../components/DegradedButton'

export default function AbsurdCaptcha({ onDone }) {
  const addError = useFlowStore((s) => s.addError)

  const variantRef = useRef(
    captchas.absurd[Math.floor(Math.random() * captchas.absurd.length)]
  )
  const variant = variantRef.current

  const [selected, setSelected] = useState([])
  const [error, setError] = useState(null)

  function toggleOption(index) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  function handleVerify() {
    if (selected.length === 0) return
    addError()
    setError('Selección inválida. Por favor intentá de nuevo.')
    setTimeout(() => {
      setError(null)
      onDone()
    }, 1400)
  }

  return (
    <div>
      <p
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-main)',
          marginBottom: '4px',
        }}
      >
        {variant.question}
      </p>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
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
              borderRadius: '4px',
              backgroundColor: selected.includes(i) ? '#e8f0fe' : '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--text-main)',
              textAlign: 'center',
              userSelect: 'none',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
          >
            {opt}
          </div>
        ))}
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

      <DegradedButton onClick={handleVerify} disabled={selected.length === 0}>
        Verificar
      </DegradedButton>
    </div>
  )
}
