import { Link } from '@tanstack/react-router'
import { Button } from '../../design-system'
import { DoctorIdentity, LocationMeta } from './EntityMeta'

export function DoctorCard({
  doctor,
  variant = 'standard',
  actionLabel = 'Voir le profil',
}) {
  return (
    <article className={`entity-card doctor-card doctor-card--${variant}`}>
      <DoctorIdentity
        doctor={doctor}
        size={variant === 'compact' ? 'sm' : 'lg'}
      />
      <div className="entity-card__body">
        <LocationMeta>{doctor.clinic}</LocationMeta>
        {doctor.nextAvailability && variant !== 'compact' ? (
          <p className="entity-card__availability">
            Prochain créneau : <strong>{doctor.nextAvailability}</strong>
          </p>
        ) : null}
      </div>
      <Button
        className="entity-card__action"
        render={
          <Link params={{ doctorId: doctor.id }} to="/doctors/$doctorId" />
        }
        size="sm"
        variant={variant === 'featured' ? 'primary' : 'secondary'}
      >
        {actionLabel}
      </Button>
    </article>
  )
}
