import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'

export default function EmailSent() {
  const email = useFlowStore((s) => s.email)
  const nextStep = useFlowStore((s) => s.nextStep)
  const setDegradation = useFlowStore((s) => s.setDegradation)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
      setDegradation(2)
    }, 8000)
    return () => clearTimeout(timer)
  }, [setDegradation])

  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '24px', fontSize: '40px' }}>📬</div>

        <h2
          style={{
            fontSize: '18px',
            fontWeight: '500',
            color: 'var(--text-main)',
            marginBottom: '12px',
          }}
        >
          Revisá tu correo
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Te enviamos un código de verificación a{' '}
          <strong style={{ color: 'var(--text-main)' }}>{email}</strong>. Puede demorar unos
          minutos.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            marginBottom: '32px',
          }}
        >
          <Spinner />
          <span>Esperando confirmación...</span>
        </div>

        {/* Botón notable — aparece después de 8s junto con la degradación */}
        <div style={{ minHeight: '64px' }}>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <button
                onClick={nextStep}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: '2px solid var(--color-error)',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                <span style={{ fontSize: '16px' }}>⚠</span>
                No recibí el correo
              </button>

              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginTop: '10px',
                  opacity: 0.7,
                }}
              >
                El sistema intentará una verificación alternativa.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function Spinner() {
  return (
    <div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
