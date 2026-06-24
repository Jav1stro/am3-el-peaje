import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFlowStore } from '../store/useFlowStore'
import { useProgressStore } from '../store/useProgressStore'
import { PROGRESS } from '../data/progressConfig'
import Layout from '../components/Layout'
import CheckboxCaptcha from './captchas/CheckboxCaptcha'
import ImageCaptcha from './captchas/ImageCaptcha'
import AbsurdCaptcha from './captchas/AbsurdCaptcha'
import DistortedTextCaptcha from './captchas/DistortedTextCaptcha'
import TosCaptcha from './captchas/TosCaptcha'
import MicrophoneCaptcha from './captchas/MicrophoneCaptcha'
import SecurityQuestionCaptcha from './captchas/SecurityQuestionCaptcha'

const CAPTCHA_COMPONENTS = {
  checkbox: CheckboxCaptcha,
  image: ImageCaptcha,
  absurd: AbsurdCaptcha,
  distorted: DistortedTextCaptcha,
  tos: TosCaptcha,
  microphone: MicrophoneCaptcha,
  security: SecurityQuestionCaptcha,
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
}

function VerifyingSpinner() {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 0',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
          }}
        >
          Verificando...
        </p>
      </div>
    </Layout>
  )
}

function EndingMessage() {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 0',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '3px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'var(--color-primary)',
            fontWeight: 700,
          }}
        >
          ✓
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            textAlign: 'center',
          }}
        >
          {PROGRESS.ENDING_MESSAGE}
        </p>
      </div>
    </Layout>
  )
}

function FailedMessage() {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 0',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '3px solid var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'var(--color-error)',
            fontWeight: 700,
          }}
        >
          ✕
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--color-error)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            textShadow: '0 0 6px rgba(var(--error-rgb), 0.4)',
          }}
        >
          {PROGRESS.FAIL_MESSAGE}
        </p>
      </div>
    </Layout>
  )
}

export default function CaptchaRouter() {
  const pool = useFlowStore((s) => s.pool)
  const poolIndex = useFlowStore((s) => s.poolIndex)
  const seq = useFlowStore((s) => s.seq)
  const isVerifying = useFlowStore((s) => s.isVerifying)
  const setVerifying = useFlowStore((s) => s.setVerifying)
  const nextCaptcha = useFlowStore((s) => s.nextCaptcha)
  const decideCaptchaResult = useProgressStore((s) => s.decideCaptchaResult)
  const applyCaptchaResult = useProgressStore((s) => s.applyCaptchaResult)
  const showEnding = useProgressStore((s) => s.showEnding)
  const resetAll = useProgressStore((s) => s.resetAll)
  const [failed, setFailed] = useState(false)
  const timerRef = useRef(null)
  const failTimerRef = useRef(null)
  const endingTimerRef = useRef(null)

  function handleCaptchaDone(captchaType) {
    const result = decideCaptchaResult(captchaType)
    setVerifying(true)

    timerRef.current = setTimeout(() => {
      applyCaptchaResult(result)
      if (result === 'fail') {
        setFailed(true)
        failTimerRef.current = setTimeout(() => {
          setFailed(false)
          nextCaptcha()
        }, 2000)
      } else {
        nextCaptcha()
      }
    }, 1500)
  }

  useEffect(() => {
    if (!showEnding) return

    endingTimerRef.current = setTimeout(() => {
      setFailed(false)
      resetAll()
      nextCaptcha()
    }, 4000)

    return () => clearTimeout(endingTimerRef.current)
  }, [showEnding])

  const idleTimerRef = useRef(null)

  function resetIdleTimer() {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setFailed(false)
      resetAll()
      nextCaptcha()
    }, PROGRESS.IDLE_TIMEOUT)
  }

  useEffect(() => {
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    const handler = () => resetIdleTimer()
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }))
    resetIdleTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler))
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearTimeout(failTimerRef.current)
    clearTimeout(endingTimerRef.current)
  }, [])

  const currentType = pool[poolIndex]
  const CaptchaComponent = CAPTCHA_COMPONENTS[currentType]
  const animKey = showEnding
    ? 'ending'
    : failed
      ? 'failed'
      : isVerifying
        ? 'verifying'
        : `${currentType}-${seq}`

  return (
    <AnimatePresence mode="wait">
      <motion.div key={animKey} {...fade} style={{ width: '100%' }}>
        {showEnding ? (
          <EndingMessage />
        ) : failed ? (
          <FailedMessage />
        ) : isVerifying ? (
          <VerifyingSpinner />
        ) : (
          <Layout>
            {CaptchaComponent && (
              <CaptchaComponent onDone={() => handleCaptchaDone(currentType)} />
            )}
          </Layout>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
