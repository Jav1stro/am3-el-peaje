import { AnimatePresence, motion } from 'framer-motion'
import { useFlowStore } from './store/useFlowStore'
import EmailStep from './screens/EmailStep'
import EmailFailed from './screens/EmailFailed'
import EmailSent from './screens/EmailSent'
import NoEmailReceived from './screens/NoEmailReceived'
import PhysicalCount from './screens/PhysicalCount'
import CaptchaRouter from './screens/CaptchaRouter'
import Ending from './screens/Ending'

const SCREENS = {
  0: EmailStep,
  1: EmailFailed,
  2: EmailSent,
  3: NoEmailReceived,
  4: PhysicalCount,
  5: CaptchaRouter,
  6: Ending,
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
}

export default function App() {
  const step = useFlowStore((s) => s.step)
  const Screen = SCREENS[step] ?? Ending

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        {...fade}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  )
}
