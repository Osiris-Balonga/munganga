import { Link } from '@tanstack/react-router'
import { Button } from '../../design-system'
import { LocationMeta } from './EntityMeta'

export function ClinicCard({ clinic, variant = 'standard' }) {
  return (
    <article className={`entity-card clinic-card clinic-card--${variant}`}>
      <div className="clinic-card__heading">
        <span className="clinic-card__mark" aria-hidden="true">
          +
        </span>
        <div>
          <h3>{clinic.name}</h3>
          <p>{clinic.type ?? 'Clinique'}</p>
        </div>
      </div>
      <div className="entity-card__body">
        <LocationMeta>{clinic.address}</LocationMeta>
        {variant !== 'compact' && clinic.specialties?.length ? (
          <ul className="clinic-card__specialties" aria-label="Spécialités">
            {clinic.specialties.slice(0, 3).map((specialty) => (
              <li key={specialty}>{specialty}</li>
            ))}
          </ul>
        ) : null}
      </div>
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
    </article>
  )
}
