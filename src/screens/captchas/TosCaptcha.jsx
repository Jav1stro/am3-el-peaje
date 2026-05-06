import { useState, useRef, useEffect } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

// Fases: 0 = TOS principal, 1 = Adenda I revelada, 2 = Adenda II revelada, 3 = aceptado
const PHASE_HEIGHTS = ['260px', '420px', '560px']

export default function TosCaptcha({ onDone }) {
  const [phase, setPhase] = useState(0)
  const [canAccept, setCanAccept] = useState(false)
  const [containerHeight, setContainerHeight] = useState(PHASE_HEIGHTS[0])
  const scrollRef = useRef(null)
  const addendumRef = useRef(null)

  // Cuando cambia la fase, expandir el contenedor y scrollear al nuevo contenido
  useEffect(() => {
    if (phase === 0) return
    setContainerHeight(PHASE_HEIGHTS[Math.min(phase, PHASE_HEIGHTS.length - 1)])

    // Scrollear al inicio del nuevo bloque después de que el DOM se actualiza
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
        // Revelar Adenda I
        setPhase(1)
        setCanAccept(false)
      } else if (phase === 1) {
        // Revelar Adenda II
        setPhase(2)
        setCanAccept(false)
      } else if (phase === 2) {
        // Ahora sí pueden aceptar
        setCanAccept(true)
      }
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '2px' }}>
        Términos y condiciones
      </p>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
        Debés leer y aceptar la totalidad del documento para continuar.
        {phase > 0 && (
          <span style={{ color: 'var(--color-error)', marginLeft: '4px', fontWeight: '500' }}>
            {phase === 1 ? ' — Se ha agregado: Adenda I' : ' — Se ha agregado: Adenda II'}
          </span>
        )}
      </p>

      {/* Contenedor que crece */}
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            height: containerHeight,
            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowY: 'scroll',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px 14px',
            fontSize: '11px',
            lineHeight: '1.75',
            color: 'var(--text-secondary)',
            backgroundColor: '#fafafa',
            marginBottom: '0',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* TOS principal */}
          <div style={{ whiteSpace: 'pre-wrap' }}>{captchas.tos}</div>

          {/* Adenda I — aparece al llegar al final */}
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

          {/* Adenda II — aparece al llegar al final de Adenda I */}
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

        {/* Texto fantasma que "se escapa" por abajo del contenedor */}
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
              opacity: 0.25,
              overflow: 'hidden',
              height: '22px',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textOverflow: 'clip',
              filter: 'blur(0.5px)',
            }}
          >
            {phase === 0
              ? 'ADENDA I — DISPOSICIONES COMPLEMENTARIAS AL TRATAMIENTO DE DATOS CONDUCTUALES Versión 3.0.2 — Incorporada por referencia...'
              : 'ADENDA II — CLAUSULAS ESPECIALES PARA USUARIOS QUE HAN LLEGADO HASTA AQUÍ...'}
          </div>
        )}
      </div>

      {/* Espacio para el texto fantasma */}
      <div style={{ height: phase < 2 ? '30px' : '14px', transition: 'height 0.4s ease' }} />

      {!canAccept && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginBottom: '10px' }}>
          ↓ Scrolleá hasta el final para continuar
        </p>
      )}

      <DegradedButton onClick={onDone} disabled={!canAccept}>
        Acepto y continúo
      </DegradedButton>

      <style>{`
        @keyframes fadeInAddendum {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
