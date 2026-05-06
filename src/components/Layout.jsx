import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFlowStore } from '../store/useFlowStore'
import ProgressBar from './ProgressBar'

// Colores del flash de glitch según el nivel al que se está llegando
const GLITCH_COLORS = ['#ffffff', '#c8e0c8', '#00cc44', '#00ff55', '#00ff41']

export default function Layout({ children }) {
  const degradationLevel = useFlowStore((s) => s.degradationLevel)
  const [displayedLevel, setDisplayedLevel] = useState(
    () => Number(document.documentElement.getAttribute('data-deg') ?? 0)
  )
  const [glitchColor, setGlitchColor] = useState(null)
  const pendingRef = useRef([])

  useEffect(() => {
    // Limpiar timeouts anteriores si el nivel cambia mientras transiciona
    pendingRef.current.forEach(clearTimeout)
    pendingRef.current = []

    if (degradationLevel === displayedLevel) return

    const dir = degradationLevel > displayedLevel ? 1 : -1
    const steps = []
    let cur = displayedLevel
    while (cur !== degradationLevel) {
      cur += dir
      steps.push(cur)
    }

    // Intervalo entre pasos: 900ms para que se sienta pesado
    steps.forEach((level, i) => {
      const t = setTimeout(() => {
        // Flash de glitch breve antes de aplicar cada nivel
        setGlitchColor(GLITCH_COLORS[level] ?? '#ffffff')
        setTimeout(() => setGlitchColor(null), 160)

        setDisplayedLevel(level)
        document.documentElement.setAttribute('data-deg', String(level))
      }, i * 900)
      pendingRef.current.push(t)
    })

    return () => {
      pendingRef.current.forEach(clearTimeout)
    }
  }, [degradationLevel]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
      }}
    >
      {/* Flash de glitch: cubre toda la pantalla brevemente */}
      <AnimatePresence>
        {glitchColor && (
          <motion.div
            key={glitchColor + Date.now()}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: glitchColor,
              pointerEvents: 'none',
              zIndex: 999,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="card"
        style={{
          backgroundColor: 'var(--card-bg)',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden',
        }}
      >
        <ProgressBar />
        <div style={{ padding: '32px 24px' }}>{children}</div>
      </div>
    </div>
  )
}
