# Dashboard Design Kit — Espace praticien Munganga

Ce document extrait le **design du tableau de bord** (`/doctor`) pour le reproduire dans un autre projet React.  
Les classes CSS utilisent le préfixe `kb-` (kit dashboard).

## Fichiers sources (projet Munganga)

| Rôle                   | Chemin                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Page dashboard         | `src/features/doctor-workspace/DoctorDashboard.jsx`                                                                  |
| Graphiques SVG         | `src/features/doctor-workspace/dashboard/Charts.jsx`                                                                 |
| Calculs KPI / barres   | `src/features/doctor-workspace/dashboard/metrics.js`                                                                 |
| Styles dashboard       | `src/features/doctor-workspace/mboka-theme.css` (sections `kb-banner`, `kb-kpi`, `kb-charts`, `kb-donut`, `kb-bars`) |
| Données exemple motifs | `src/features/doctor-workspace/mockData.js` → `consultationMix`                                                      |

## Dépendances

```bash
npm install react lucide-react
# ou
pnpm add react lucide-react
```

Icônes utilisées : `CalendarCheck`, `Clock3`, `Percent`, `Stethoscope` (package `lucide-react`).

Pour le routage, Munganga utilise `@tanstack/react-router` (`Link`). Dans un autre projet, remplacez par `<a href="...">` ou le routeur de votre choix.

---

## Structure visuelle

```
.kb-dash
├── .kb-banner              ← bannière dégradée bleue + CTA + sélecteur période
├── .kb-kpis                ← grille 4 cards KPI (2 cols mobile, 4 cols desktop)
│   └── .kb-kpi × 4
└── .kb-charts              ← 2 cards graphiques côte à côte (desktop)
    ├── .kb-card.kb-card--motifs   ← donut + légende
    └── .kb-card                   ← barres empilées
```

---

## Variables CSS (tokens)

À placer sur un conteneur racine (ex. `.dashboard-shell` ou `.dw-shell`) :

```css
.dashboard-shell {
  --kb-bg: #f3f5f9;
  --kb-card: #ffffff;
  --kb-ink: #0f172a;
  --kb-muted: #64748b;
  --kb-line: #e2e8f0;
  --kb-blue: #2563eb;
  --kb-blue-2: #3b82f6;
  --kb-shadow: 0 1px 2px rgb(15 23 42 / 0.06), 0 10px 24px rgb(15 23 42 / 0.06);
  background: var(--kb-bg);
  color: var(--kb-ink);
  font-family: system-ui, sans-serif;
}
```

Palette principale : dégradé `#1e3a8a → #1d4ed8 → #3b82f6`, accents verts/rouges pour badges KPI.

---

## Données exemple

```javascript
// Segments du donut (pourcentages, total = 100)
export const consultationMix = [
  { label: 'Consultation générale', value: 52, color: '#1d4ed8' },
  { label: 'Suivi', value: 31, color: '#3b82f6' },
  { label: 'Urgence', value: 17, color: '#93c5fd' },
]

// Série barres (12 jours)
export const barSeriesExample = [
  { label: '20', confirmed: 4, pending: 1 },
  { label: '21', confirmed: 3, pending: 2 },
  { label: '22', confirmed: 5, pending: 0 },
  { label: '23', confirmed: 2, pending: 1 },
  { label: '24', confirmed: 6, pending: 2 },
  { label: '25', confirmed: 3, pending: 1 },
  { label: '26', confirmed: 4, pending: 0 },
  { label: '27', confirmed: 2, pending: 2 },
  { label: '28', confirmed: 5, pending: 1 },
  { label: '29', confirmed: 3, pending: 0 },
  { label: '30', confirmed: 4, pending: 1 },
  { label: '31', confirmed: 6, pending: 2 },
]

// Modèle d'une card KPI
const kpiCardExample = {
  label: 'Rendez-vous',
  value: '12',
  unit: 'sur la période',
  badge: '+12,4 %',
  tone: 'up', // 'up' | 'down'
  icon: CalendarCheck,
  color: '#1d4ed8',
  spark: [3, 5, 4, 7, 6, 12],
}
```

---

## React — Composants graphiques (`Charts.jsx`)

```jsx
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
```

---

## React — Page dashboard (version autonome)

Remplacez `Link` par votre composant de navigation si besoin.

```jsx
import { CalendarCheck, Clock3, Percent, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { RevenueBars, SalesDonut, Sparkline } from './Charts'

const periods = [
  { id: 'today', label: 'Aujourd’hui' },
  { id: 'month', label: 'Mois en cours' },
  { id: 'year', label: 'Année' },
]

const consultationMix = [
  { label: 'Consultation générale', value: 52, color: '#1d4ed8' },
  { label: 'Suivi', value: 31, color: '#3b82f6' },
  { label: 'Urgence', value: 17, color: '#93c5fd' },
]

export function DashboardPage() {
  const [period, setPeriod] = useState('month')
  const monthLabel = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const cards = [
    {
      label: 'Rendez-vous',
      value: '12',
      unit: period === 'today' ? 'aujourd’hui' : 'sur la période',
      badge: '+12,4 %',
      tone: 'up',
      icon: CalendarCheck,
      color: '#1d4ed8',
      spark: [3, 5, 4, 7, 6, 12],
    },
    {
      label: 'Confirmés',
      value: '8',
      unit: 'consultations',
      badge: '+8,1 %',
      tone: 'up',
      icon: Stethoscope,
      color: '#2563eb',
      spark: [2, 3, 3, 5, 4, 8],
    },
    {
      label: 'En attente',
      value: '2',
      unit: 'demandes',
      badge: '+1,2 %',
      tone: 'up',
      icon: Clock3,
      color: '#0ea5e9',
      spark: [1, 2, 1, 2, 3, 2],
    },
    {
      label: 'Taux d’occupation',
      value: '72 %',
      unit: 'de l’agenda',
      badge: '-5 pt',
      tone: 'up',
      icon: Percent,
      color: '#3b82f6',
      spark: [40, 55, 48, 62, 70, 72],
    },
  ]

  const bars = [
    { label: '20', confirmed: 4, pending: 1 },
    { label: '21', confirmed: 3, pending: 2 },
    { label: '22', confirmed: 5, pending: 0 },
    { label: '23', confirmed: 2, pending: 1 },
    { label: '24', confirmed: 6, pending: 2 },
    { label: '25', confirmed: 3, pending: 1 },
    { label: '26', confirmed: 4, pending: 0 },
    { label: '27', confirmed: 2, pending: 2 },
    { label: '28', confirmed: 5, pending: 1 },
    { label: '29', confirmed: 3, pending: 0 },
    { label: '30', confirmed: 4, pending: 1 },
    { label: '31', confirmed: 6, pending: 2 },
  ]

  return (
    <section className="kb-dash dashboard-shell">
      {/* ── Bannière ── */}
      <section className="kb-banner">
        <div>
          <p>Indicateurs calculés sur vos rendez-vous et vos disponibilités</p>
          <h1>Bonjour, Dr. Makaya</h1>
          <p>
            Voici la vue consolidée de votre activité médicale pour le{' '}
            {monthLabel}.
          </p>
          <a className="kb-banner__cta" href="/appointments">
            Créer un rendez-vous
          </a>
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

      {/* ── KPI ── */}
      <section className="kb-kpis">
        {cards.map((card) => (
          <article className="kb-kpi" key={card.label}>
            <div className="kb-kpi__top">
              <span
                className="kb-kpi__icon"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                <card.icon aria-hidden="true" size={18} />
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

      {/* ── Graphiques ── */}
      <section className="kb-charts">
        <article className="kb-card kb-card--motifs">
          <div className="kb-card__head">
            <div>
              <h2>Consultations par motif</h2>
              <p>Répartition réelle des rendez-vous</p>
            </div>
          </div>
          <div className="kb-donut-wrap">
            <SalesDonut segments={consultationMix} total={12} />
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
```

---

## CSS complet du dashboard

Copiez ce bloc dans un fichier `dashboard-kit.css` et importez-le dans votre app.

```css
/* ── Tokens (sur le conteneur racine) ── */
.dashboard-shell {
  --kb-bg: #f3f5f9;
  --kb-card: #ffffff;
  --kb-ink: #0f172a;
  --kb-muted: #64748b;
  --kb-line: #e2e8f0;
  --kb-blue: #2563eb;
  --kb-shadow: 0 1px 2px rgb(15 23 42 / 0.06), 0 10px 24px rgb(15 23 42 / 0.06);
  background: var(--kb-bg);
  color: var(--kb-ink);
}

/* ── Bannière ── */
.kb-banner {
  display: grid;
  gap: 16px;
  padding: 24px;
  overflow: hidden;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.1), transparent 42%),
    repeating-linear-gradient(
      0deg,
      rgb(255 255 255 / 0.07) 0 1px,
      transparent 1px 22px
    ),
    repeating-linear-gradient(
      90deg,
      rgb(255 255 255 / 0.07) 0 1px,
      transparent 1px 22px
    ),
    linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 48%, #3b82f6 100%);
  color: #fff;
}

.kb-banner p,
.kb-banner h1 {
  margin: 0;
}

.kb-banner p {
  font-size: 13px;
  opacity: 0.88;
}

.kb-banner h1 {
  margin-top: 6px;
  font-size: 28px;
  line-height: 1.15;
}

.kb-banner__cta {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  margin-top: 14px;
  border-radius: 999px;
  background: #fff;
  color: var(--kb-blue);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.kb-periods {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  max-width: min(100%, 420px);
  padding: 4px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.16);
}

.kb-periods button {
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.kb-periods button.is-active {
  background: #fff;
  color: var(--kb-blue);
}

/* ── KPI ── */
.kb-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.kb-kpi,
.kb-card {
  padding: 18px;
  border-radius: 16px;
  background: var(--kb-card);
  box-shadow: var(--kb-shadow);
}

.kb-kpi__top,
.kb-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.kb-kpi__icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
}

.kb-kpi__badge {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.kb-kpi__badge.is-up {
  background: #dcfce7;
  color: #15803d;
}

.kb-kpi__badge.is-down {
  background: #fee2e2;
  color: #b91c1c;
}

.kb-kpi span,
.kb-card__head p {
  color: var(--kb-muted);
  font-size: 13px;
}

.kb-kpi__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.kb-kpi strong {
  font-size: 22px;
  line-height: 1.1;
}

.kb-kpi__unit {
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

/* ── Zone graphiques ── */
.kb-charts {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.kb-card__head {
  align-items: flex-start;
  margin-bottom: 16px;
}

.kb-card__head h2,
.kb-card__head p {
  margin: 0;
}

.kb-card__head h2 {
  font-size: 16px;
}

.kb-card__head p {
  margin-top: 4px;
  font-size: 12px;
}

.kb-card--motifs {
  min-height: 100%;
  overflow: hidden;
}

/* ── Donut ── */
.kb-donut-wrap {
  display: grid;
  gap: 24px;
  align-items: center;
  justify-items: center;
  width: 100%;
  min-width: 0;
}

.kb-donut {
  position: relative;
  width: min(200px, 100%);
  max-width: 200px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.kb-donut svg {
  width: 100%;
  height: auto;
  display: block;
}

.kb-donut__center {
  position: absolute;
  inset: 22%;
  display: grid;
  place-content: center;
  text-align: center;
  border-radius: 50%;
  background: #fff;
  pointer-events: none;
}

.kb-donut__center strong {
  font-size: clamp(20px, 4vw, 28px);
  line-height: 1;
  letter-spacing: -0.03em;
}

.kb-donut__center span {
  display: block;
  margin-top: 6px;
  color: var(--kb-muted);
  font-size: 12px;
  font-weight: 500;
}

.kb-legend {
  width: 100%;
  min-width: 0;
  max-width: 320px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.kb-legend li {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
  font-size: 13px;
}

.kb-legend li:first-child {
  border-top: 0;
  padding-top: 0;
}

.kb-legend li span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kb-legend i,
.kb-legend-inline i {
  width: 10px;
  height: 10px;
  flex: none;
  border-radius: 50%;
}

.kb-legend strong {
  justify-self: end;
  flex-shrink: 0;
  color: var(--kb-ink);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.kb-legend-inline {
  display: flex;
  gap: 12px;
  color: var(--kb-muted);
  font-size: 12px;
}

.kb-legend-inline i {
  display: inline-block;
  margin-right: 4px;
}

/* ── Barres ── */
.kb-bars {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 8px;
  align-items: end;
  min-height: 220px;
}

.kb-bars__stack {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  max-width: 18px;
  height: 190px;
  overflow: hidden;
  border-radius: 6px 6px 2px 2px;
  background: #f1f5f9;
}

.kb-bars__stack .is-confirmed {
  background: var(--kb-blue);
}

.kb-bars__stack .is-pending {
  background: #f59e0b;
}

.kb-bars__col {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.kb-bars small {
  color: var(--kb-muted);
  font-size: 10px;
}

/* ── Responsive ── */
@media (max-width: 759px) {
  .kb-donut-wrap {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .kb-legend {
    max-width: 100%;
  }
}

@media (min-width: 760px) {
  .kb-banner {
    grid-template-columns: 1fr auto;
    align-items: center;
    min-height: 148px;
    padding: 26px 28px;
  }

  .kb-donut-wrap {
    grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
    gap: 28px;
    justify-items: stretch;
    align-items: center;
  }

  .kb-legend {
    max-width: none;
  }
}

@media (min-width: 1100px) {
  .kb-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .kb-charts {
    grid-template-columns: 0.95fr 1.25fr;
    gap: 18px;
  }

  .kb-card--motifs .kb-donut-wrap {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
  }

  .kb-card--motifs .kb-legend {
    max-width: 100%;
  }
}

@media (min-width: 1400px) {
  .kb-charts {
    grid-template-columns: 1fr 1.35fr;
  }

  .kb-card--motifs .kb-donut-wrap {
    grid-template-columns: minmax(150px, 190px) minmax(0, 1fr);
    justify-items: stretch;
    gap: 20px;
  }
}
```

---

## Intégration rapide dans un autre projet

1. Copier `Charts.jsx` et le composant `DashboardPage` ci-dessus.
2. Copier `dashboard-kit.css` et l’importer dans `main.jsx` ou `App.jsx`.
3. Envelopper la page dans `<div className="dashboard-shell">` (ou ajouter la classe sur `.kb-dash`).
4. Remplacer les données statiques par vos propres métriques.
5. Optionnel : reprendre `metrics.js` de Munganga pour calculer KPI/barres depuis un tableau de rendez-vous.

```jsx
// main.jsx
import './dashboard-kit.css'
import { DashboardPage } from './DashboardPage'

createRoot(document.getElementById('root')).render(<DashboardPage />)
```

---

## Logique métier (optionnelle — `metrics.js`)

```javascript
export function getKpi(appointments, period) {
  // Filtrer par période (today | month | year), puis :
  return {
    total: 12,
    confirmed: 8,
    pending: 2,
    occupancy: 72, // % confirmés / total
    cancelRate: 8, // % annulés / total
  }
}

export function getBarSeries(appointments) {
  // Retourne 12 objets { label, confirmed, pending } — un par jour
}
```

Voir le fichier complet : `src/features/doctor-workspace/dashboard/metrics.js`.

---

## Notes de design

- **Bannière** : fond bleu avec grille subtile (repeating-linear-gradient) + CTA pill blanc.
- **KPI** : icône colorée (fond `${color}18`), badge vert/rouge, valeur large + unité + sparkline SVG.
- **Donut** : SVG `stroke-dasharray` sur cercles, centre blanc avec total.
- **Barres** : colonnes empilées (confirmé bleu + en attente orange), hauteur relative au max de la série.
- **Breakpoints** : 760px (bannière 2 cols), 1100px (4 KPI + 2 graphiques côte à côte), 1400px (ratio graphiques ajusté).

---

_Extrait du projet Munganga — branche `feature/doctor-workspace` — septembre 2026._
