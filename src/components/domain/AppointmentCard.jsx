import { Button, StatusBadge } from '../../design-system'
import { DateTimeMeta, DoctorIdentity, LocationMeta } from './EntityMeta'

export function AppointmentCard({
  appointment,
  variant = 'upcoming',
  onCancel,
}) {
  return (
    <article
      className={`workflow-card appointment-card appointment-card--${variant}`}
    >
      <div className="workflow-card__header">
        <DoctorIdentity doctor={appointment.doctor} />
        <StatusBadge status={appointment.status} />
      </div>
      <div className="workflow-card__details">
        <DateTimeMeta date={appointment.date} time={appointment.time} />
        <LocationMeta>{appointment.clinic}</LocationMeta>
        <p className="workflow-card__reason">{appointment.reason}</p>
      </div>
      {variant === 'upcoming' ? (
        <div className="workflow-card__actions">
          <Button size="sm" variant="secondary">
            Voir le détail
          </Button>
          {onCancel ? (
            <Button onClick={onCancel} size="sm" variant="quiet">
              Annuler
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
