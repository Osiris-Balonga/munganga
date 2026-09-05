export function SegmentedControl({ items, value, onChange, ariaLabel }) {
  return (
    <div className="kb-seg" role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          aria-selected={value === item.id}
          className={value === item.id ? 'is-active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
