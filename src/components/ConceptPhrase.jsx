import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { phrases } from '../data/phrases'

export default function ConceptPhrase({ index, onDone }) {
  const text = phrases[index % phrases.length]

  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        zIndex: 100,
      }}
    >
      <p
        style={{
          color: '#fff',
          fontSize: 'clamp(18px, 4vw, 26px)',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '500px',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: '300',
          letterSpacing: '0.01em',
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}
