import { useState, useRef, useEffect } from 'react'
import { captchas } from '../../data/captchas'
import DegradedButton from '../../components/DegradedButton'

const RECORD_SECONDS = 5
const ANALYZE_MS = 2500
const d = captchas.microphone

export default function MicrophoneCaptcha({ onDone }) {
  const [phase, setPhase] = useState('idle')
  const [countdown, setCountdown] = useState(RECORD_SECONDS)
  const [visibleMetrics, setVisibleMetrics] = useState([])
  const [rejectionMessage, setRejectionMessage] = useState('')

  const requiredAttemptsRef = useRef(Math.floor(Math.random() * 3) + 1)
  const attemptRef = useRef(0)

  const canvasRef = useRef(null)
  const audioRef = useRef({ stream: null, ctx: null, analyser: null })
  const rafRef = useRef(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => () => stopAudio(), [])

  function stopAudio() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const { stream, ctx } = audioRef.current
    if (stream) stream.getTracks().forEach((t) => t.stop())
    if (ctx && ctx.state !== 'closed') ctx.close()
    audioRef.current = { stream: null, ctx: null, analyser: null }
  }

  async function handleActivate() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      if (ctx.state === 'suspended') await ctx.resume()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.85
      ctx.createMediaStreamSource(stream).connect(analyser)
      audioRef.current = { stream, ctx, analyser }
      setCountdown(RECORD_SECONDS)
      setPhase('recording')
    } catch {
      setPhase('denied')
    }
  }

  useEffect(() => {
    if (phase !== 'recording') return

    let stopped = false

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          stopAudio()
          setPhase('analyzing')
          return 0
        }
        return c - 1
      })
    }, 1000)

    const canvas = canvasRef.current
    const analyser = audioRef.current.analyser
    if (canvas && analyser) {
      const c = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      c.scale(dpr, dpr)

      const w = rect.width
      const h = rect.height
      const bufLen = analyser.frequencyBinCount
      const data = new Uint8Array(bufLen)

      const style = getComputedStyle(document.documentElement)
      const primary = style.getPropertyValue('--color-primary').trim()
      const rgb = style.getPropertyValue('--primary-rgb').trim()
      const border = style.getPropertyValue('--border').trim()

      const draw = () => {
        if (stopped) return
        analyser.getByteTimeDomainData(data)
        c.clearRect(0, 0, w, h)

        c.strokeStyle = border
        c.lineWidth = 0.5
        c.globalAlpha = 0.3
        for (let i = 1; i < 4; i++) {
          c.beginPath()
          c.moveTo(0, (h / 4) * i)
          c.lineTo(w, (h / 4) * i)
          c.stroke()
        }
        c.globalAlpha = 1

        c.beginPath()
        c.lineWidth = 2
        c.strokeStyle = primary
        c.shadowColor = `rgba(${rgb}, 0.5)`
        c.shadowBlur = 6
        const slice = w / bufLen
        let x = 0
        for (let i = 0; i < bufLen; i++) {
          const y = (data[i] / 128.0) * (h / 2)
          i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)
          x += slice
        }
        c.stroke()
        c.shadowBlur = 0

        rafRef.current = requestAnimationFrame(draw)
      }
      draw()
    }

    return () => {
      stopped = true
      clearInterval(interval)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'analyzing') return

    const metrics = d.metrics.map((label) => ({
      label,
      value: Math.floor(Math.random() * 25) + 72,
    }))

    setVisibleMetrics([])
    const timers = []

    metrics.forEach((m, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleMetrics((prev) => [...prev, m])
        }, (i + 1) * 450)
      )
    })

    timers.push(
      setTimeout(() => {
        attemptRef.current += 1
        if (attemptRef.current < requiredAttemptsRef.current) {
          const msg = d.rejections[Math.floor(Math.random() * d.rejections.length)]
          setRejectionMessage(msg)
          setPhase('rejected')
        } else {
          onDoneRef.current()
        }
      }, ANALYZE_MS)
    )

    return () => timers.forEach(clearTimeout)
  }, [phase])

  if (phase === 'idle') {
    return (
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '0.04em',
          }}
        >
          {d.title}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            lineHeight: '1.6',
          }}
        >
          {d.instruction}
        </p>
        <DegradedButton onClick={handleActivate}>Activar micrófono</DegradedButton>
      </div>
    )
  }

  if (phase === 'denied') {
    return (
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '0.04em',
          }}
        >
          {d.title}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            lineHeight: '1.6',
          }}
        >
          {d.permissionDenied}
        </p>
        <DegradedButton onClick={handleActivate}>Reintentar</DegradedButton>
      </div>
    )
  }

  if (phase === 'recording') {
    return (
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '0.04em',
          }}
        >
          {d.title}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-error)',
              display: 'inline-block',
              animation: 'blink 1.2s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(var(--error-rgb), 0.6)',
            }}
          />
          {d.recordingLabel}
        </p>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '120px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--border-radius)',
            marginBottom: '12px',
            display: 'block',
          }}
        />
        <p
          style={{
            fontSize: '28px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-primary)',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '0.1em',
            textShadow: '0 0 12px rgba(var(--primary-rgb), 0.4)',
          }}
        >
          {countdown}
        </p>
      </div>
    )
  }

  if (phase === 'rejected') {
    return (
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '0.04em',
          }}
        >
          {d.title}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-error)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            lineHeight: '1.6',
          }}
        >
          {rejectionMessage}
        </p>
        <DegradedButton onClick={handleActivate}>Reintentar</DegradedButton>
      </div>
    )
  }

  if (phase === 'analyzing') {
    return (
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '0.04em',
          }}
        >
          {d.title}
        </p>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          {d.analyzingLabel}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleMetrics.map((m, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-main)',
                letterSpacing: '0.02em',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span>{m.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{m.value}%</span>
              </div>
              <div
                style={{
                  height: '4px',
                  backgroundColor: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${m.value}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-primary)',
                    boxShadow: `0 0 6px rgba(var(--primary-rgb), 0.4)`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
