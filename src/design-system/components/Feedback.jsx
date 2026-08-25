import { CircleAlert, SearchX } from 'lucide-react'
import { Button } from './Button'

const statusLabels = {
  confirmed: 'Confirmé',
  pending: 'En attente',
  cancelled: 'Annulé',
  refused: 'Refusé',
  completed: 'Terminé',
}

export function StatusBadge({ status, children }) {
  return (
    <span className={`ds-status ds-status--${status}`}>
      {children ?? statusLabels[status] ?? status}
    </span>
  )
}

export function FilterChip({
  active = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      aria-pressed={active}
      className={`ds-chip ${active ? 'is-active' : ''} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export function Skeleton({ className = '', ...props }) {
  return (
    <span
      aria-hidden="true"
      className={`ds-skeleton ${className}`}
      {...props}
    />
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <section className="ds-state" aria-labelledby="empty-state-title">
      <span className="ds-state__symbol" aria-hidden="true">
        <SearchX />
      </span>
      <h2 className="ds-state__title" id="empty-state-title">
        {title}
      </h2>
      <p className="ds-state__description">{description}</p>
      {action}
    </section>
  )
}

export function ErrorState({ title, description, onRetry }) {
  return (
    <section className="ds-state" role="alert">
      <span
        className="ds-state__symbol ds-state__symbol--danger"
        aria-hidden="true"
      >
        <CircleAlert />
      </span>
      <h2 className="ds-state__title">{title}</h2>
      <p className="ds-state__description">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Réessayer</Button> : null}
    </section>
  )
}
