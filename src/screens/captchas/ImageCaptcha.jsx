import { useState, useRef } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

export default function ImageCaptcha({ onDone }) {
  const variantRef = useRef(
    captchas.image[Math.floor(Math.random() * captchas.image.length)]
  )
  const variant = variantRef.current
  const [selected, setSelected] = useState([])

  function toggleTile(index) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <div>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--bg)',
          padding: '8px 12px',
          backgroundColor: 'var(--color-primary)',
          margin: '0 0 2px 0',
          letterSpacing: '0.04em',
        }}
      >
        {variant.question}
      </p>
      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          letterSpacing: '0.04em',
        }}
      >
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
              backgroundColor: selected.includes(i) ? 'var(--tile-selected-bg)' : 'var(--tile-bg)',
              border: `3px solid ${selected.includes(i) ? 'var(--color-primary)' : 'var(--border)'}`,
              boxShadow: selected.includes(i) ? '0 0 8px rgba(var(--primary-rgb), 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              cursor: 'pointer',
              position: 'relative',
              userSelect: 'none',
              transition: 'border-color 0.1s, background-color 0.1s',
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
                  color: 'var(--bg)',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
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
                fontSize: '7px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                opacity: 0.6,
              }}
            >
              {tile.label}
            </div>
          </div>
        ))}
      </div>

      <DegradedButton onClick={onDone}>Verificar</DegradedButton>
    </div>
  )
}
