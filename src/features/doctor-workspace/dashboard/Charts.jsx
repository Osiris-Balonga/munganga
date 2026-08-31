export function Sparkline({ values, color = '#2563EB' }) {
  const max = Math.max(...values, 1)
  const width = 72
  const height = 28
  const gap = 3
  const barWidth = (width - gap * (values.length - 1)) / values.length

  return (
    <svg aria-hidden="true" className="kb-spark" height={height} width={width}>
      {values.map((value, index) => {
        const h = Math.max(4, (value / max) * height)
        return (
          <rect
            fill={index === values.length - 1 ? color : `${color}55`}
            height={h}
            key={`${value}-${index}`}
            rx="2"
            width={barWidth}
            x={index * (barWidth + gap)}
            y={height - h}
          />
        )
      })}
    </svg>
  )
}

export function SalesDonut({ total, segments }) {
  const size = 200
  const center = size / 2
  const radius = 68
  const stroke = 14
  const circumference = 2 * Math.PI * radius
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
    <div className="kb-donut">
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="#E8EEF7"
          strokeWidth={stroke}
        />
        {paths.map((segment) => (
          <circle
            cx={center}
            cy={center}
            fill="none"
            key={segment.label}
            r={radius}
            stroke={segment.color}
            strokeDasharray={segment.dash}
            strokeDashoffset={circumference * 0.25 - segment.start}
            strokeLinecap="round"
            strokeWidth={stroke}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
      </svg>
      <div className="kb-donut__center">
        <strong>{total}</strong>
        <span>consultations</span>
      </div>
    </div>
  )
}

export function RevenueBars({ series }) {
  const max = Math.max(
    ...series.flatMap((item) => [item.confirmed, item.pending]),
    1,
  )

  return (
    <div
      className="kb-bars"
      role="img"
      aria-label="Volume de rendez-vous par jour"
    >
      {series.map((item) => (
        <div className="kb-bars__col" key={item.label}>
          <div className="kb-bars__stack">
            <span
              className="is-confirmed"
              style={{ height: `${(item.confirmed / max) * 100}%` }}
            />
            <span
              className="is-pending"
              style={{ height: `${(item.pending / max) * 100}%` }}
            />
          </div>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  )
}
