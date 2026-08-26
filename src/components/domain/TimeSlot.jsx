export function TimeSlot({ selected = false, children, ...props }) {
  return (
    <button
      aria-pressed={selected}
      className={`time-slot ${selected ? 'is-selected' : ''}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
