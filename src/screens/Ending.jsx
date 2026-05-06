import { useEffect, useState } from 'react'
import { useFlowStore } from '../store/useFlowStore'
import { endings } from '../data/endings'
import Layout from '../components/Layout'
import DegradedButton from '../components/DegradedButton'

export default function Ending() {
  const endingIndex = useFlowStore((s) => s.endingIndex)
  const resetFlow = useFlowStore((s) => s.resetFlow)
  const ending = endings[endingIndex]

  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    if (!ending?.autoRestart) return

    const total = ending.autoRestartDelay || 4000
    const tick = 1000
    let remaining = total

    setCountdown(Math.ceil(remaining / tick))

    const interval = setInterval(() => {
      remaining -= tick
      setCountdown(Math.ceil(remaining / tick))
      if (remaining <= 0) {
        clearInterval(interval)
        resetFlow()
      }
    }, tick)

    return () => clearInterval(interval)
  }, [ending, resetFlow])

  if (!ending) return null

  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            animation: ending.glitch ? 'blink 1s step-end infinite' : 'none',
          }}
        >
          {ending.icon}
        </div>

        <h2
          style={{
            fontSize: ending.glitch ? '14px' : '18px',
            fontWeight: '500',
            color: ending.glitch ? 'var(--color-error)' : 'var(--text-main)',
            marginBottom: '16px',
            fontFamily: ending.glitch ? "'Space Mono', monospace" : 'inherit',
            letterSpacing: ending.glitch ? '0.05em' : 'normal',
          }}
        >
          {ending.title}
        </h2>

        <p
          style={{
            fontSize: ending.glitch ? '12px' : '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            marginBottom: '24px',
            whiteSpace: 'pre-wrap',
            fontFamily: ending.glitch ? "'Space Mono', monospace" : 'inherit',
            textAlign: ending.glitch ? 'left' : 'center',
          }}
        >
          {ending.body}
          {countdown !== null && (
            <span style={{ display: 'block', marginTop: '8px', color: 'var(--color-error)' }}>
              Reiniciando en {countdown}...
            </span>
          )}
        </p>

        {!ending.autoRestart && (
          <DegradedButton onClick={resetFlow}>Volver a intentar</DegradedButton>
        )}

        <p
          style={{
            fontSize: '10px',
            color: '#aaa',
            marginTop: '24px',
            fontFamily: 'monospace',
          }}
        >
          SESSION_ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} · LOGGED
        </p>
      </div>
    </Layout>
  )
}
