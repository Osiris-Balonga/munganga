import { Checkbox } from '@base-ui/react/checkbox'
import { Switch } from '@base-ui/react/switch'
import { CheckIcon } from './Icons'

export function CheckboxField({ label, className = '', ...props }) {
  return (
    <label className={`ds-control-label ${className}`}>
      <Checkbox.Root className="ds-checkbox" {...props}>
        <Checkbox.Indicator className="ds-checkbox__indicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>{label}</span>
    </label>
  )
}

export function SwitchField({ label, description, className = '', ...props }) {
  return (
    <label className={`ds-switch-field ${className}`}>
      <span>
        <span className="ds-switch-field__label">{label}</span>
        {description ? (
          <span className="ds-switch-field__description">{description}</span>
        ) : null}
      </span>
      <Switch.Root className="ds-switch" {...props}>
        <Switch.Thumb className="ds-switch__thumb" />
      </Switch.Root>
    </label>
  )
}
