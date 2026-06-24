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

const CAPTCHA_COMPONENTS = {
  checkbox: CheckboxCaptcha,
  image: ImageCaptcha,
  absurd: AbsurdCaptcha,
  distorted: DistortedTextCaptcha,
  tos: TosCaptcha,
  microphone: MicrophoneCaptcha,
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
  const isVerifying = useFlowStore((s) => s.isVerifying)
  const setVerifying = useFlowStore((s) => s.setVerifying)
  const nextCaptcha = useFlowStore((s) => s.nextCaptcha)
  const recordCaptchaResult = useProgressStore((s) => s.recordCaptchaResult)
  const [failed, setFailed] = useState(false)
  const timerRef = useRef(null)
  const failTimerRef = useRef(null)

  function handleCaptchaDone() {
    const result = recordCaptchaResult()
    setVerifying(true)

    timerRef.current = setTimeout(() => {
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

  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearTimeout(failTimerRef.current)
  }, [])

  const currentType = pool[poolIndex]
  const CaptchaComponent = CAPTCHA_COMPONENTS[currentType]
  const animKey = failed ? 'failed' : isVerifying ? 'verifying' : `${currentType}-${poolIndex}`

  return (
    <AnimatePresence mode="wait">
      <motion.div key={animKey} {...fade} style={{ width: '100%' }}>
        {failed ? (
          <FailedMessage />
        ) : isVerifying ? (
          <VerifyingSpinner />
        ) : (
          <Layout>
            {CaptchaComponent && <CaptchaComponent onDone={handleCaptchaDone} />}
          </Layout>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
