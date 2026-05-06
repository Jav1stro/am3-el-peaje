import { useEffect, useState } from 'react'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import DegradedButton from '../components/DegradedButton'

export default function EmailFailed() {
  const email = useFlowStore((s) => s.email)
  const degradationLevel = useFlowStore((s) => s.degradationLevel)
  const setDegradation = useFlowStore((s) => s.setDegradation)
  const nextStep = useFlowStore((s) => s.nextStep)
  const [value, setValue] = useState(email)

  useEffect(() => {
    setDegradation(degradationLevel + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    nextStep()
  }

  return (
    <Layout>
      <div
        className="error-message"
        style={{
          backgroundColor: '#fce8e6',
          border: '1px solid #f5c6c2',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '13px',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <span>⚠</span>
        <span>
          La dirección ingresada no parece válida. Por favor verificá e intentá nuevamente.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            className="field-label"
            htmlFor="email-retry"
            style={{
              display: 'block',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            Dirección de correo electrónico
          </label>
          <input
            id="email-retry"
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input-field"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid var(--color-error)',
              borderRadius: '4px',
              outline: 'none',
              color: 'var(--text-main)',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <DegradedButton type="submit" disabled={!value.trim()}>
          Reintentar
        </DegradedButton>
      </form>
    </Layout>
  )
}
