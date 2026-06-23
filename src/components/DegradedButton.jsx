export default function DegradedButton({ children, onClick, disabled, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
      style={style}
    >
      {children}
    </button>
  )
}
