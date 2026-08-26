import { Select } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon } from './Icons'

export function SelectField({
  label,
  placeholder = 'Sélectionner',
  items,
  className = '',
  ...rootProps
}) {
  return (
    <Select.Root items={items} {...rootProps}>
      <div className={`ds-field ${className}`}>
        <Select.Label className="ds-field__label">{label}</Select.Label>
        <Select.Trigger className="ds-select__trigger">
          <Select.Value
            className="ds-select__value"
            placeholder={placeholder}
          />
          <Select.Icon className="ds-select__icon">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
      </div>
      <Select.Portal>
        <Select.Positioner className="ds-select__positioner" sideOffset={6}>
          <Select.Popup className="ds-select__popup">
            <Select.List className="ds-select__list">
              {items.map((item) => (
                <Select.Item
                  className="ds-select__item"
                  key={item.value}
                  value={item.value}
                >
                  <Select.ItemIndicator className="ds-select__indicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>{item.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
