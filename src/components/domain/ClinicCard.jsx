import { Link } from '@tanstack/react-router'
import { Clock3, Hospital } from 'lucide-react'
import { Button } from '../../design-system'
import { LocationMeta } from './EntityMeta'

export function ClinicCard({ clinic, variant = 'standard' }) {
  return (
    <article className={`entity-card clinic-card clinic-card--${variant}`}>
      <div className="clinic-card__media">
        {clinic.imageUrl ? (
          <img src={clinic.imageUrl} alt="" />
        ) : (
          <span className="clinic-card__mark" aria-hidden="true">
            <Hospital />
          </span>
        )}
        {clinic.status ? (
          <span
            className={`clinic-card__status clinic-card__status--${clinic.statusTone ?? 'success'}`}
          >
            {clinic.status}
          </span>
        ) : null}
      </div>
      <div className="clinic-card__content">
        <div className="clinic-card__heading">
          <div>
            <h3>{clinic.name}</h3>
            <p>{clinic.type ?? 'Clinique'}</p>
          </div>
        </div>
        <LocationMeta>{clinic.address}</LocationMeta>
        {clinic.hours ? (
          <span className="clinic-card__hours">
            <Clock3 aria-hidden="true" />
            {clinic.hours}
          </span>
        ) : null}
        {variant !== 'compact' && clinic.specialties?.length ? (
          <ul className="clinic-card__specialties" aria-label="Spécialités">
            {clinic.specialties.slice(0, 3).map((specialty) => (
              <li key={specialty}>{specialty}</li>
            ))}
          </ul>
        ) : null}
        <Button
          className="entity-card__action"
          render={
            <Link params={{ clinicId: clinic.id }} to="/clinics/$clinicId" />
          }
          size="sm"
          variant="secondary"
        >
          Voir la clinique
        </Button>
      </div>
    </article>
  )
}
