export function AreaChart({ id, accent = '#4CAF6D' }) {
  return (
    <svg
      aria-hidden="true"
      className="mb-area"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 160 72"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d="M0 52 C18 48 28 22 46 28 C64 34 72 12 90 18 C108 24 122 8 140 16 C150 20 156 28 160 24 L160 72 L0 72 Z"
        fill={`url(#${id})`}
      />
      <path
        d="M0 52 C18 48 28 22 46 28 C64 34 72 12 90 18 C108 24 122 8 140 16 C150 20 156 28 160 24"
        stroke={accent}
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  )
}

export function DoctorHeroIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="mb-hero__art"
      fill="none"
      viewBox="0 0 280 200"
    >
      <ellipse
        cx="168"
        cy="168"
        fill="#0F5C38"
        opacity="0.28"
        rx="78"
        ry="14"
      />
      <circle cx="188" cy="58" fill="#F2C14E" r="28" />
      <path d="M170 48c8-14 28-16 36-4" stroke="#fff" strokeWidth="3" />
      <rect fill="#E8F6EE" height="92" rx="18" width="70" x="142" y="72" />
      <rect fill="#1F7A4D" height="28" rx="8" width="70" x="142" y="72" />
      <circle cx="177" cy="58" fill="#F8D7B0" r="16" />
      <rect fill="#4CAF6D" height="40" rx="10" width="48" x="153" y="100" />
      <path
        d="M158 118h38"
        stroke="#E8F6EE"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <circle cx="86" cy="118" fill="#F4A261" r="22" />
      <path d="M86 102v32M70 118h32" stroke="#fff" strokeWidth="5" />
      <rect fill="#fff" height="36" rx="10" width="52" x="40" y="138" />
      <path
        d="M48 148h36M48 158h24"
        stroke="#1F7A4D"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

export function EventIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="mb-event__art"
      fill="none"
      viewBox="0 0 220 120"
    >
      <rect fill="#1F7A4D" height="120" rx="20" width="220" />
      <circle cx="168" cy="38" fill="#F2C14E" opacity="0.9" r="22" />
      <rect fill="#E8F6EE" height="58" rx="12" width="72" x="28" y="36" />
      <rect fill="#4CAF6D" height="18" width="72" x="28" y="36" />
      <path
        d="M40 68h32M40 78h20"
        stroke="#1F7A4D"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="150" cy="82" fill="#F8D7B0" r="16" />
      <rect fill="#fff" height="36" rx="12" width="44" x="128" y="96" />
    </svg>
  )
}

export function UpgradeIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="mb-upgrade__art"
      fill="none"
      viewBox="0 0 120 72"
    >
      <rect fill="#F4A261" height="44" rx="12" width="52" x="34" y="20" />
      <path d="M46 20v-6a14 14 0 0 1 28 0v6" stroke="#1F7A4D" strokeWidth="4" />
      <circle cx="60" cy="42" fill="#fff" r="8" />
      <path d="M60 38v8" stroke="#1F7A4D" strokeWidth="2" />
    </svg>
  )
}

export function CategoryDonut({ total, segments }) {
  const stroke = 18
  const circumference = Math.PI * 72
  const paths = segments.reduce(
    (acc, segment) => {
      const length = (segment.value / 100) * circumference
      return {
        cursor: acc.cursor + length,
        items: [
          ...acc.items,
          {
            ...segment,
            dash: `${length} ${circumference}`,
            start: acc.cursor,
          },
        ],
      }
    },
    { cursor: 0, items: [] },
  ).items

  return (
    <div className="mb-donut">
      <svg aria-hidden="true" viewBox="0 0 200 120">
        <path
          d="M28 110 A72 72 0 0 1 172 110"
          fill="none"
          stroke="#E8F6EE"
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        {paths.map((segment) => (
          <path
            d="M28 110 A72 72 0 0 1 172 110"
            fill="none"
            key={segment.label}
            stroke={segment.color}
            strokeDasharray={segment.dash}
            strokeDashoffset={-segment.start}
            strokeLinecap="butt"
            strokeWidth={stroke}
          />
        ))}
      </svg>
      <div className="mb-donut__center">
        <span>Total du mois</span>
        <strong>{total}</strong>
      </div>
    </div>
  )
}
