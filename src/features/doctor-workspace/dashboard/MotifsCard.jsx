import { Link } from '@tanstack/react-router'
import { CategoryDonut } from './visuals'
import { consultationMix } from '../mockData'

export function MotifsCard({ monthlyTotal }) {
  return (
    <section className="mb-card">
      <div className="mb-card__head">
        <h2>Répartition des motifs</h2>
      </div>
      <CategoryDonut segments={consultationMix} total={monthlyTotal} />
      <ul className="mb-legend">
        {consultationMix.map((item) => (
          <li key={item.label}>
            <i style={{ background: item.color }} />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </li>
        ))}
      </ul>
      <Link className="mb-text-link" to="/doctor/stats">
        Voir les détails →
      </Link>
    </section>
  )
}
