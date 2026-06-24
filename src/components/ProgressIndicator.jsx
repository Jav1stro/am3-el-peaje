import { useEffect, useRef } from 'react'
import { useProgressStore } from '../store/useProgressStore'
import { PROGRESS } from '../data/progressConfig'

export default function ProgressIndicator() {
  const percent = useProgressStore((s) => s.percent)
  const connectedVisitors = useProgressStore((s) => s.connectedVisitors)
  const showJoinAlert = useProgressStore((s) => s.showJoinAlert)
  const clearJoinAlert = useProgressStore((s) => s.clearJoinAlert)
  const alertTimerRef = useRef(null)

  useEffect(() => {
    if (!showJoinAlert) return
    clearTimeout(alertTimerRef.current)
    alertTimerRef.current = setTimeout(clearJoinAlert, 3000)
    return () => clearTimeout(alertTimerRef.current)
  }, [showJoinAlert])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        padding: '10px 16px',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            letterSpacing: '0.04em',
          }}
        >
          <span>Progreso</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {percent >= PROGRESS.CEILING_THRESHOLD ? percent.toFixed(3) : Math.floor(percent)}%
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: 4,
            backgroundColor: 'var(--border)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(percent, 100)}%`,
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 2,
              transition: 'width 0.6s ease-out',
              boxShadow: `0 0 6px rgba(var(--primary-rgb), 0.4)`,
            }}
          />
        </div>

        {showJoinAlert && (
          <div
            style={{
              marginTop: 8,
              padding: '6px 10px',
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'var(--color-error)',
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--border-radius)',
              textAlign: 'center',
              animation: 'fadeInAddendum 0.3s ease-out',
            }}
          >
            Nuevo visitante en la fila · Progreso −{PROGRESS.JOIN_PENALTY}%
          </div>
        )}

        {connectedVisitors.length > 0 && (
          <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 6 }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 4,
                opacity: 0.7,
              }}
            >
              En fila · {connectedVisitors.length + 1}
            </div>
            {connectedVisitors.map((v) => (
              <div
                key={v.visitorId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    boxShadow: `0 0 4px rgba(var(--primary-rgb), 0.5)`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '10px' }}>
                  {Math.floor(v.percent)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
