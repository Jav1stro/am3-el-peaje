import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useFlowStore } from '../store/useFlowStore'
import Layout from '../components/Layout'
import ConceptPhrase from '../components/ConceptPhrase'
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

const CAPTCHA_TITLES = {
  checkbox: 'Verificación humana',
  image: 'Selección de imágenes',
  absurd: 'Verificación lógica',
  distorted: 'Transcripción de texto',
  tos: 'Términos de uso',
}

export default function CaptchaRouter() {
  const captchaQueue = useFlowStore((s) => s.captchaQueue)
  const captchaIndex = useFlowStore((s) => s.captchaIndex)
  const phraseIndex = useFlowStore((s) => s.phraseIndex)
  const advanceCaptcha = useFlowStore((s) => s.advanceCaptcha)
  const advancePhraseIndex = useFlowStore((s) => s.advancePhraseIndex)
  const nextStep = useFlowStore((s) => s.nextStep)

  const [showingPhrase, setShowingPhrase] = useState(true)

  function handlePhraseDone() {
    setShowingPhrase(false)
  }

  function handleCaptchaDone() {
    const nextIndex = captchaIndex + 1
    if (nextIndex >= captchaQueue.length) {
      nextStep()
      return
    }
    advanceCaptcha()
    advancePhraseIndex()
    setShowingPhrase(true)
  }

  const currentType = captchaQueue[captchaIndex]
  const CaptchaComponent = CAPTCHA_COMPONENTS[currentType]

  return (
    <AnimatePresence mode="wait">
      {showingPhrase ? (
        <ConceptPhrase
          key={`phrase-${phraseIndex}`}
          index={phraseIndex}
          onDone={handlePhraseDone}
        />
      ) : (
        <Layout key={`captcha-${captchaIndex}`}>
          <p
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              fontWeight: '500',
            }}
          >
            Paso {captchaIndex + 2} de 6 · {CAPTCHA_TITLES[currentType]}
          </p>
          {CaptchaComponent && <CaptchaComponent onDone={handleCaptchaDone} />}
        </Layout>
      )}
    </AnimatePresence>
  )
}
