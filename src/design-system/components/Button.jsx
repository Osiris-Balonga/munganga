import { Button as BaseButton } from '@base-ui/react/button'

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  render,
  ...props
}) {
  return (
    <BaseButton
      className={`ds-button ds-button--${variant} ds-button--${size} ${className}`}
      nativeButton={!render}
      render={render}
      {...props}
    />
  )
}

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <BaseButton
      aria-label={label}
      className={`ds-icon-button ${className}`}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
