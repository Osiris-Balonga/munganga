import { Link } from '@tanstack/react-router'
import { DoctorHeroIllustration } from './visuals'
import { formatLongDate } from '../dates'

export function HeroBanner({ appointmentCount, remainingSlots, date }) {
  return (
    <section className="mb-hero">
      <div className="mb-hero__copy">
        <p>Voici ce qui vous attend aujourd’hui</p>
        <h2>
          {appointmentCount} rendez-vous
          <span> le {formatLongDate(date)}</span>
        </h2>
        <small>
          {remainingSlots} créneaux encore disponibles pour de nouvelles
          consultations.
        </small>
        <Link className="mb-pill" to="/doctor/agenda">
          Voir mon agenda →
        </Link>
      </div>
      <DoctorHeroIllustration />
    </section>
  )
}
