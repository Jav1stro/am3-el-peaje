import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import CheckboxCaptcha from './captchas/CheckboxCaptcha'
import ImageCaptcha from './captchas/ImageCaptcha'
import AbsurdCaptcha from './captchas/AbsurdCaptcha'
import DistortedTextCaptcha from './captchas/DistortedTextCaptcha'
import TosCaptcha from './captchas/TosCaptcha'

const CAPTCHA_COMPONENTS = {
  checkbox: CheckboxCaptcha,
  image: ImageCaptcha,
  absurd: AbsurdCaptcha,
  distorted: DistortedTextCaptcha,
  tos: TosCaptcha,
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

export default function CaptchaRouter() {
  const pool = useFlowStore((s) => s.pool)
  const poolIndex = useFlowStore((s) => s.poolIndex)
  const isVerifying = useFlowStore((s) => s.isVerifying)
  const setVerifying = useFlowStore((s) => s.setVerifying)
  const nextCaptcha = useFlowStore((s) => s.nextCaptcha)
  const timerRef = useRef(null)

  function handleCaptchaDone() {
    setVerifying(true)
    timerRef.current = setTimeout(() => {
      nextCaptcha()
    }, 1500)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const currentType = pool[poolIndex]
  const CaptchaComponent = CAPTCHA_COMPONENTS[currentType]
  const animKey = isVerifying ? 'verifying' : `${currentType}-${poolIndex}`

  return (
    <AnimatePresence mode="wait">
      <motion.div key={animKey} {...fade} style={{ width: '100%' }}>
        {isVerifying ? (
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
