import { useFlowStore } from '../store/useFlowStore'

export default function DegradedButton({ children, onClick, disabled, type = 'button', style = {} }) {
  const degradationLevel = useFlowStore((s) => s.degradationLevel)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
      style={{
        backgroundColor: disabled ? '#ccc' : 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
        letterSpacing: '0.25px',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
