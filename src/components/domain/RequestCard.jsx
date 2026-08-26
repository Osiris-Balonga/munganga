import { Button, StatusBadge } from '../../design-system'
import { DateTimeMeta, InitialsAvatar } from './EntityMeta'

export function RequestCard({
  request,
  variant = 'pending',
  onAccept,
  onRefuse,
}) {
  return (
    <article className={`workflow-card request-card request-card--${variant}`}>
      <div className="workflow-card__header">
        <div className="request-card__patient">
          <InitialsAvatar name={request.patientName} />
          <div>
            <strong>{request.patientName}</strong>
            <span>Demande de rendez-vous</span>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <div className="workflow-card__details">
        <DateTimeMeta date={request.date} time={request.time} />
        <p className="workflow-card__reason">{request.reason}</p>
      </div>
      {variant === 'pending' ? (
        <div className="workflow-card__actions">
          <Button onClick={onAccept} size="sm">
            Confirmer
          </Button>
          <Button onClick={onRefuse} size="sm" variant="secondary">
            Refuser
          </Button>
        </div>
      ) : null}
    </article>
  )
}
