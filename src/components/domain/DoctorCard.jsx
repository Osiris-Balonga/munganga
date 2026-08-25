import { Link } from '@tanstack/react-router'
import { Button } from '../../design-system'
import { DoctorIdentity, LocationMeta } from './EntityMeta'

export function DoctorCard({ doctor, variant = 'standard' }) {
  const isCompact = variant === 'compact'

  return (
    <article className={`entity-card doctor-card doctor-card--${variant}`}>
      <div className="doctor-card__identity">
        <DoctorIdentity doctor={doctor} size={isCompact ? 'sm' : 'lg'} />
      </div>
      <div className="entity-card__body doctor-card__details">
        <LocationMeta>{doctor.clinic}</LocationMeta>
        {doctor.address && !isCompact ? (
          <span className="doctor-card__address">{doctor.address}</span>
        ) : null}
        {doctor.nextAvailability ? (
          <div className="doctor-card__availability">
            <span>Prochaine disponibilité</span>
            <strong>{doctor.nextAvailability}</strong>
          </div>
        ) : null}
      </div>
      <div className="doctor-card__actions">
        {!isCompact ? (
          <Button
            render={
              <Link params={{ doctorId: doctor.id }} to="/doctors/$doctorId" />
            }
            size="sm"
            variant="secondary"
          >
            Profil
          </Button>
        ) : null}
        <Button
          render={
            <Link
              params={{ doctorId: doctor.id }}
              to="/doctors/$doctorId/book"
            />
          }
          size="sm"
        >
          Prendre RDV
        </Button>
      </div>
    </article>
  )
}
