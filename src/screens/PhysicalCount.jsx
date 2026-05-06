import { useState } from 'react'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import DegradedButton from '../components/DegradedButton'

export default function PhysicalCount() {
  const nextStep = useFlowStore((s) => s.nextStep)
  const mathChallenge = useFlowStore((s) => s.mathChallenge)
  const degradationLevel = useFlowStore((s) => s.degradationLevel)
  const setDegradation = useFlowStore((s) => s.setDegradation)

  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [advancing, setAdvancing] = useState(false)

  const MAX_ATTEMPTS = 4

  function handleSubmit(e) {
    e.preventDefault()
    if (advancing) return

    const num = parseInt(value, 10)
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts % 2 === 0) {
      setDegradation(Math.min(degradationLevel + 1, 4))
    }

    if (num === mathChallenge?.result) {
      setIsCorrect(true)
      setMessage('Correcto. Cómo lo sabías.')
      setAdvancing(true)
      setTimeout(() => nextStep(), 2000)
      return
    }

    if (newAttempts >= MAX_ATTEMPTS) {
      setAdvancing(true)
      nextStep()
      return
    }

    setMessage('Resultado incorrecto. Por favor revisá tu cálculo y reintentá.')
    setValue('')
  }

  return (
    <Layout>
      <h2
        style={{
          fontSize: '17px',
          fontWeight: '500',
          color: 'var(--text-main)',
          marginBottom: '8px',
        }}
      >
        Verificación manual
      </h2>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Ingresá el resultado que calculaste en el papel.
      </p>

      {message && (
        <div
          className="error-message"
          style={{
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '13px',
            backgroundColor: isCorrect ? '#e6f4ea' : '#fce8e6',
            border: `1px solid ${isCorrect ? '#b7dfbf' : '#f5c6c2'}`,
            color: isCorrect ? '#1e7e34' : 'var(--color-error)',
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            className="field-label"
            htmlFor="result"
            style={{
              display: 'block',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            Resultado del cálculo
          </label>
          <input
            id="result"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={advancing}
            placeholder="000"
            className="input-field"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '18px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              outline: 'none',
              color: 'var(--text-main)',
              backgroundColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.1em',
            }}
          />
        </div>

        <DegradedButton type="submit" disabled={!value.trim() || advancing}>
          Verificar
        </DegradedButton>
      </form>

      <p
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginTop: '16px',
          opacity: 0.6,
        }}
      >
        Intento {attempts}/{MAX_ATTEMPTS}
      </p>
    </Layout>
  )
}
