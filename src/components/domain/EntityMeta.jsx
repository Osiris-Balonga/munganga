export function InitialsAvatar({ name, imageUrl, size = 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return imageUrl ? (
    <img
      className={`entity-avatar entity-avatar--${size}`}
      src={imageUrl}
      alt=""
    />
  ) : (
    <span className={`entity-avatar entity-avatar--${size}`} aria-hidden="true">
      {initials}
    </span>
  )
}

export function DoctorIdentity({ doctor, size = 'md' }) {
  return (
    <div className="doctor-identity">
      <InitialsAvatar
        imageUrl={doctor.imageUrl}
        name={doctor.name}
        size={size}
      />
      <div className="doctor-identity__copy">
        <strong>{doctor.name}</strong>
        <span>{doctor.specialty}</span>
      </div>
    </div>
  )
}

export function DateTimeMeta({ date, time }) {
  return (
    <span className="entity-meta">
      <span aria-hidden="true">◷</span>
      <span>
        {date} · {time}
      </span>
    </span>
  )
}

export function LocationMeta({ children }) {
  return (
    <span className="entity-meta">
      <span aria-hidden="true">⌖</span>
      <span>{children}</span>
    </span>
  )
}
