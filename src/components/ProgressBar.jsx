import { useFlowStore } from '../store/useFlowStore'

const TOTAL_STEPS = 6

export default function ProgressBar() {
  const step = useFlowStore((s) => s.step)
  const percent = Math.min((step / TOTAL_STEPS) * 100, 100)

  return (
    <div
      style={{
        height: '4px',
        backgroundColor: 'var(--border)',
        width: '100%',
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          height: '100%',
          width: `${percent}%`,
          backgroundColor: 'var(--color-primary)',
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}
