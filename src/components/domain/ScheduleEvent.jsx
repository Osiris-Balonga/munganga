import { StatusBadge } from '../../design-system'

export function ScheduleEvent({ event }) {
  const [startTime, endTime] = event.time.split('–')

  return (
    <article className={`schedule-event schedule-event--${event.status}`}>
      <time
        aria-label={endTime ? `${startTime} à ${endTime}` : startTime}
        className="schedule-event__time"
      >
        <span>{startTime}</span>
        {endTime ? <span>{endTime}</span> : null}
      </time>
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
