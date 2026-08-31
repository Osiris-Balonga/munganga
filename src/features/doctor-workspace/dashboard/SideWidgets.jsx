import { Link } from '@tanstack/react-router'
import { InitialsAvatar } from '../../../components/domain'
import { formatShortDate, formatTime } from '../dates'

export function LastAppointmentsList({ appointments }) {
  return (
    <section className="mb-card">
      <div className="mb-card__head">
        <h2>Derniers rendez-vous traités</h2>
      </div>
      <ul className="mb-event-list">
        {appointments.map((item) => (
          <li key={item.id}>
            <InitialsAvatar name={item.patientName} size="sm" />
            <span>
              <strong>{item.patientName}</strong>
              <small>
                {item.reason} · {formatShortDate(item.startAt)} ·{' '}
                {formatTime(item.startAt)}
              </small>
            </span>
          </li>
        ))}
      </ul>
      <Link className="mb-text-link" to="/doctor/appointments">
        Voir tout →
      </Link>
    </section>
  )
}

export function OccupancyCard({ rate, remainingSlots }) {
  return (
    <section className="mb-card mb-occupancy">
      <span>Taux d’occupation de l’agenda</span>
      <strong>{rate}%</strong>
      <small>{remainingSlots} créneaux encore libres aujourd’hui</small>
    </section>
  )
}
