import { AreaChart } from './visuals'

export function StatsFunnel({ metrics }) {
  const columns = [
    {
      label: 'Rendez-vous programmés',
      value: metrics.programmed,
      hint: `${metrics.cancelledShare}% d’annulation`,
      trend: '+8.3%',
      chartId: 'funnel-a',
    },
    {
      label: 'Confirmés',
      value: metrics.confirmed,
      hint: `${metrics.confirmedShare}% du planning`,
      trend: '+4.1%',
      chartId: 'funnel-b',
    },
    {
      label: 'En cours',
      value: metrics.inProgress,
      hint: `${metrics.waitingShare}% en salle`,
      trend: '+1.2%',
      chartId: 'funnel-c',
    },
    {
      label: 'Terminés',
      value: metrics.completed,
      hint: `${metrics.doneShare}% déjà reçus`,
      trend: '+6.4%',
      chartId: 'funnel-d',
    },
  ]

  return (
    <section className="mb-card mb-funnel">
      <div className="mb-card__head">
        <h2>Suivi des rendez-vous du jour</h2>
      </div>
      <div className="mb-funnel__grid">
        {columns.map((column) => (
          <article className="mb-funnel__col" key={column.label}>
            <div className="mb-funnel__top">
              <span>{column.label}</span>
              <b>{column.trend}</b>
            </div>
            <strong>{String(column.value).padStart(2, '0')}</strong>
            <small>{column.hint}</small>
            <AreaChart id={column.chartId} />
          </article>
        ))}
      </div>
    </section>
  )
}
