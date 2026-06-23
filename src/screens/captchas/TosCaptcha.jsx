import { useState, useRef, useEffect } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

const PHASE_HEIGHTS = ['260px', '420px', '560px']

export default function TosCaptcha({ onDone }) {
  const [phase, setPhase] = useState(0)
  const [canAccept, setCanAccept] = useState(false)
  const [containerHeight, setContainerHeight] = useState(PHASE_HEIGHTS[0])
  const scrollRef = useRef(null)
  const addendumRef = useRef(null)

  useEffect(() => {
    if (phase === 0) return
    setContainerHeight(PHASE_HEIGHTS[Math.min(phase, PHASE_HEIGHTS.length - 1)])
    setTimeout(() => {
      if (addendumRef.current) {
        addendumRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 350)
  }, [phase])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 12

    if (atBottom) {
      if (phase === 0) {
        setPhase(1)
        setCanAccept(false)
      } else if (phase === 1) {
        setPhase(2)
        setCanAccept(false)
      } else if (phase === 2) {
        setCanAccept(true)
      }
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-main)',
          marginBottom: '2px',
          letterSpacing: '0.04em',
        }}
      >
        Términos y condiciones
      </p>
      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '10px',
          letterSpacing: '0.02em',
        }}
      >
        Debés leer y aceptar la totalidad del documento para continuar.
        {phase > 0 && (
          <span
            style={{
              color: 'var(--color-error)',
              marginLeft: '4px',
              textShadow: '0 0 4px rgba(var(--error-rgb),0.4)',
            }}
          >
            {phase === 1 ? ' — Se ha agregado: Adenda I' : ' — Se ha agregado: Adenda II'}
          </span>
        )}
      </p>

      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            height: containerHeight,
            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowY: 'scroll',
            border: '1px solid var(--border)',
            padding: '12px 14px',
            fontSize: '11px',
            lineHeight: '1.75',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--tos-bg)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{captchas.tos}</div>

          {phase >= 1 && (
            <div
              ref={phase === 1 ? addendumRef : null}
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '2px solid var(--border)',
                whiteSpace: 'pre-wrap',
                animation: 'fadeInAddendum 0.6s ease forwards',
              }}
            >
              {captchas.tosAddendum1}
            </div>
          )}

          {phase >= 2 && (
            <div
              ref={phase === 2 ? addendumRef : null}
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '2px dashed var(--border)',
                whiteSpace: 'pre-wrap',
                fontSize: '10.5px',
                animation: 'fadeInAddendum 0.6s ease forwards',
              }}
            >
              {captchas.tosAddendum2}
            </div>
          )}
        </div>

        {phase < 2 && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-22px',
              left: '14px',
              right: '14px',
              fontSize: '10px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)',
              opacity: 0.2,
              overflow: 'hidden',
              height: '22px',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textOverflow: 'clip',
              filter: 'blur(0.5px)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {phase === 0
              ? 'ADENDA I — DISPOSICIONES COMPLEMENTARIAS AL TRATAMIENTO DE DATOS CONDUCTUALES...'
              : 'ADENDA II — CLAUSULAS ESPECIALES PARA USUARIOS QUE HAN LLEGADO HASTA AQUÍ...'}
          </div>
        )}
      </div>

      <div style={{ height: phase < 2 ? '30px' : '14px', transition: 'height 0.4s ease' }} />


      <DegradedButton onClick={onDone} disabled={!canAccept}>
        Acepto y continúo
      </DegradedButton>
    </div>
  )
}
