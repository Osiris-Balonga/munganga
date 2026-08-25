import { StatusBadge } from '../../design-system'

export function ScheduleEvent({ event }) {
  return (
    <article className={`schedule-event schedule-event--${event.status}`}>
      <time className="schedule-event__time">{event.time}</time>
      <div className="schedule-event__copy">
        <div>
          <strong>{event.patientName}</strong>
          <StatusBadge status={event.status} />
        </div>
        <span>{event.reason}</span>
      </div>
    </article>
  )
}
