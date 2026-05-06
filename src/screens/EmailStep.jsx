import { useState } from 'react'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import DegradedButton from '../components/DegradedButton'

export default function EmailStep() {
  const [value, setValue] = useState('')
  const setEmail = useFlowStore((s) => s.setEmail)
  const nextStep = useFlowStore((s) => s.nextStep)

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    setEmail(value.trim())
    nextStep()
  }

  return (
    <Layout>
      {/* Encabezado institucional */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            opacity: 0.7,
          }}
        >
          Sistema de Verificación de Acceso · v2.4.1
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: '400',
            color: 'var(--text-main)',
            marginBottom: '6px',
            lineHeight: '1.3',
          }}
        >
          Bienvenido/a
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          Verificación de identidad requerida
        </div>
      </div>

      {/* Descripción de la obra */}
      <div
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '28px', flexShrink: 0 }}>🥛</span>
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-main)',
                marginBottom: '2px',
              }}
            >
              Objeto en exposición
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Un vaso de agua · Caja de cristal sellada
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            margin: 0,
          }}
        >
          En esta sala hay un vaso de agua dentro de una caja de cristal. Para
          acceder a él, el sistema requiere verificar tu identidad como usuario
          autorizado. El proceso consta de múltiples etapas de validación. Una
          vez completadas, se evaluará tu solicitud de acceso.
        </p>
      </div>

      {/* Aviso de proceso */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '20px',
          padding: '10px 12px',
          borderLeft: '3px solid var(--color-primary)',
          backgroundColor: 'rgba(66, 133, 244, 0.04)',
        }}
      >
        Este proceso puede incluir verificaciones adicionales. Tené a mano papel
        y bolígrafo. La duración estimada es de 3 a 8 minutos.
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            className="field-label"
            htmlFor="email"
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
            id="email"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="email"
            placeholder="tu@correo.com"
            className="input-field"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              outline: 'none',
              color: 'var(--text-main)',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <DegradedButton type="submit" disabled={!value.trim()}>
          Iniciar verificación
        </DegradedButton>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            opacity: 0.4,
            fontSize: '11px',
            color: 'var(--text-secondary)',
          }}
        >
          <span>🔒</span>
          <span>Conexión segura</span>
          <span>·</span>
          <span>reCAPTCHA Enterprise</span>
        </div>
      </div>
    </Layout>
  )
}
