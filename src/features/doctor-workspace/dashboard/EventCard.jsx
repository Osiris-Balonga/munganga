import { Link } from '@tanstack/react-router'
import { EventIllustration } from './visuals'
import { upcomingClinicEvents } from '../decorativeFixtures'

export function EventCard() {
  return (
    <section className="mb-card mb-event">
      <EventIllustration />
      <div className="mb-card__head">
        <h2>Rappels importants</h2>
      </div>
      <ul className="mb-event-list">
        {upcomingClinicEvents.map((item) => (
          <li key={item.id}>
            <i className={`is-${item.tone}`} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
          </li>
        ))}
      </ul>
      <Link className="mb-text-link" to="/doctor/agenda">
        Voir le calendrier complet →
      </Link>
    </section>
  )
}
