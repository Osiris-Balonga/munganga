import { Field } from '@base-ui/react/field'
import { SearchIcon } from './Icons'

export function TextField({
  label,
  description,
  error,
  className = '',
  ...inputProps
}) {
  return (
    <Field.Root className={`ds-field ${className}`} invalid={Boolean(error)}>
      <Field.Label className="ds-field__label">{label}</Field.Label>
      <Field.Control className="ds-input" {...inputProps} />
      {description && !error ? (
        <Field.Description className="ds-field__description">
          {description}
        </Field.Description>
      ) : null}
      {error ? (
        <Field.Error className="ds-field__error">{error}</Field.Error>
      ) : null}
    </Field.Root>
  )
}

export function SearchField({
  label = 'Rechercher',
  className = '',
  ...props
}) {
  return (
    <label className={`ds-search ${className}`}>
      <span className="sr-only">{label}</span>
      <SearchIcon className="ds-search__icon" />
      <input className="ds-search__input" type="search" {...props} />
    </label>
  )
}
