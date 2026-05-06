import { useEffect, useRef } from 'react'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import DegradedButton from '../components/DegradedButton'

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function NoEmailReceived() {
  const nextStep = useFlowStore((s) => s.nextStep)
  const setMathChallenge = useFlowStore((s) => s.setMathChallenge)
  const mathChallenge = useFlowStore((s) => s.mathChallenge)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const a = randomBetween(200, 500)
      const b = randomBetween(100, 300)
      setMathChallenge({ a, b, result: a + b })
    }
  }, [setMathChallenge])

  if (!mathChallenge) return null

  return (
    <Layout>
      <h2
        style={{
          fontSize: '17px',
          fontWeight: '500',
          color: 'var(--text-main)',
          marginBottom: '16px',
        }}
      >
        Verificación alternativa
      </h2>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Entendemos que a veces los sistemas fallan. Para continuar de todos modos, necesitamos
        verificarte de otra manera.
      </p>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '500',
          }}
        >
          Instrucción de verificación física
        </p>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-main)',
            lineHeight: '1.7',
            margin: 0,
          }}
        >
          Tomá un papel y un bolígrafo. Calculá{' '}
          <strong>
            {mathChallenge.a} + {mathChallenge.b}
          </strong>
          . Escribí el resultado en el papel. Lo vas a necesitar.
        </p>
      </div>

      <DegradedButton onClick={nextStep}>Ya lo tengo escrito</DegradedButton>
    </Layout>
  )
}
