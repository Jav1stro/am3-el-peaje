import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import { useFlowStore } from '../../store/useFlowStore'
import DegradedButton from '../../components/DegradedButton'

export default function ImageCaptcha({ onDone }) {
  const addError = useFlowStore((s) => s.addError)
  const degradationLevel = useFlowStore((s) => s.degradationLevel)
  const setDegradation = useFlowStore((s) => s.setDegradation)

  const variantRef = useRef(
    captchas.image[Math.floor(Math.random() * captchas.image.length)]
  )
  const variant = variantRef.current

  const [selected, setSelected] = useState([])
  const [error, setError] = useState(null)

  function toggleTile(index) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  function handleVerify() {
    const correctIndices = variant.tiles
      .map((t, i) => (t.correct ? i : -1))
      .filter((i) => i !== -1)

    const isExact =
      selected.length === correctIndices.length &&
      correctIndices.every((i) => selected.includes(i))

    if (!isExact) {
      addError()
      setDegradation(Math.min(degradationLevel + 1, 4))
      setError('Selección incorrecta. Por favor revisá e intentá de nuevo.')
      setTimeout(() => {
        setError(null)
        onDone()
      }, 1500)
    } else {
      onDone()
    }
  }

  return (
    <div>
      <p
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#fff',
          padding: '8px 12px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: '4px 4px 0 0',
          margin: '0 0 2px 0',
        }}
      >
        {variant.question}
      </p>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Si no hay ninguna, hacé clic en Verificar.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          marginBottom: '12px',
        }}
      >
        {variant.tiles.map((tile, i) => (
          <div
            key={i}
            onClick={() => toggleTile(i)}
            style={{
              aspectRatio: '1',
              backgroundColor: selected.includes(i) ? '#e8f0fe' : '#f5f5f5',
              border: `3px solid ${selected.includes(i) ? 'var(--color-primary)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              cursor: 'pointer',
              position: 'relative',
              userSelect: 'none',
            }}
          >
            {tile.emoji}
            {selected.includes(i) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                ✓
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                left: '2px',
                fontSize: '8px',
                color: '#aaa',
                fontFamily: 'monospace',
              }}
            >
              {tile.label}
            </div>
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

      <DegradedButton onClick={handleVerify}>Verificar</DegradedButton>
    </div>
  )
}
