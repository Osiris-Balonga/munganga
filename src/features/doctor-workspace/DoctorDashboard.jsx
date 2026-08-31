import { Link } from '@tanstack/react-router'
import { CalendarCheck, Clock3, Percent, Stethoscope } from 'lucide-react'
import { useMemo, useState } from 'react'
import { RevenueBars, SalesDonut, Sparkline } from './dashboard/Charts'
import { getBarSeries, getKpi } from './dashboard/metrics'
import { consultationMix } from './mockData'
import { useDoctorWorkspace } from './workspaceContext'

const periods = [
  { id: 'today', label: 'Aujourd’hui' },
  { id: 'month', label: 'Mois en cours' },
  { id: 'year', label: 'Année' },
]

export function DoctorDashboard() {
  const { practitioner, appointments } = useDoctorWorkspace()
  const [period, setPeriod] = useState('month')
  const kpi = getKpi(appointments, period)
  const bars = useMemo(() => getBarSeries(appointments), [appointments])
  const monthLabel = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const cards = [
    {
      label: 'Rendez-vous',
      value: String(kpi.total),
      unit: period === 'today' ? 'aujourd’hui' : 'sur la période',
      badge: '+12,4 %',
      tone: 'up',
      icon: CalendarCheck,
      color: '#1d4ed8',
      spark: [3, 5, 4, 7, 6, kpi.total || 4],
    },
    {
      label: 'Confirmés',
      value: String(kpi.confirmed),
      unit: 'consultations',
      badge: '+8,1 %',
      tone: 'up',
      icon: Stethoscope,
      color: '#2563eb',
      spark: [2, 3, 3, 5, 4, kpi.confirmed || 3],
    },
    {
      label: 'En attente',
      value: String(kpi.pending),
      unit: 'demandes',
      badge: kpi.pending ? '+1,2 %' : '0 en cours',
      tone: kpi.pending ? 'up' : 'down',
      icon: Clock3,
      color: '#0ea5e9',
      spark: [1, 2, 1, 2, 3, kpi.pending || 1],
    },
    {
      label: 'Taux d’occupation',
      value: `${kpi.occupancy} %`,
      unit: 'de l’agenda',
      badge: `-${kpi.cancelRate} pt`,
      tone: kpi.cancelRate > 20 ? 'down' : 'up',
      icon: Percent,
      color: '#3b82f6',
      spark: [40, 55, 48, 62, 70, kpi.occupancy || 50],
    },
  ]

  return (
    <section className="kb-dash">
      <section className="kb-banner">
        <div>
          <p>Indicateurs calculés sur vos rendez-vous et vos disponibilités</p>
          <h1>Bonjour, Dr. {practitioner.lastName}</h1>
          <p>
            Voici la vue consolidée de votre activité médicale pour le{' '}
            {monthLabel}.
          </p>
          <Link className="kb-banner__cta" to="/doctor/appointments">
            Créer un rendez-vous
          </Link>
        </div>
        <div className="kb-periods" role="tablist" aria-label="Période">
          {periods.map((item) => (
            <button
              aria-selected={period === item.id}
              className={period === item.id ? 'is-active' : ''}
              key={item.id}
              onClick={() => setPeriod(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="kb-kpis">
        {cards.map((card) => (
          <article className="kb-kpi" key={card.label}>
            <div className="kb-kpi__top">
              <span
                className="kb-kpi__icon"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                <card.icon aria-hidden="true" />
              </span>
              <b className={`kb-kpi__badge is-${card.tone}`}>{card.badge}</b>
            </div>
            <span>{card.label}</span>
            <div className="kb-kpi__bottom">
              <strong>
                {card.value}
                <small className="kb-kpi__unit">{card.unit}</small>
              </strong>
              <Sparkline color={card.color} values={card.spark} />
            </div>
          </article>
        ))}
      </section>

      <section className="kb-charts">
        <article className="kb-card kb-card--motifs">
          <div className="kb-card__head">
            <div>
              <h2>Consultations par motif</h2>
              <p>Répartition réelle des rendez-vous</p>
            </div>
          </div>
          <div className="kb-donut-wrap">
            <SalesDonut segments={consultationMix} total={kpi.total || 12} />
            <ul className="kb-legend">
              {consultationMix.map((item) => (
                <li key={item.label}>
                  <i style={{ background: item.color }} />
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article className="kb-card">
          <div className="kb-card__head">
            <div>
              <h2>Volume de rendez-vous</h2>
              <p className="kb-legend-inline">
                <span>
                  <i style={{ background: '#2563eb' }} /> Confirmés
                </span>
                <span>
                  <i style={{ background: '#f59e0b' }} /> En attente
                </span>
              </p>
            </div>
          </div>
          <RevenueBars series={bars} />
        </article>
      </section>
    </section>
  )
}
