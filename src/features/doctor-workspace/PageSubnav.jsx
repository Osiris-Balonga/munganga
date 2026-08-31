import { SegmentedControl } from './SegmentedControl'

export function PageSubnav({ ariaLabel, items, onChange, value }) {
  return (
    <div className="kb-subnav">
      <SegmentedControl
        ariaLabel={ariaLabel}
        items={items}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
