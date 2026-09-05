import { Sparkline } from './dashboard/Charts'

export function KpiCards({ cards }) {
  return (
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
            {card.badge ? (
              <b className={`kb-kpi__badge is-${card.tone || 'up'}`}>
                {card.badge}
              </b>
            ) : null}
          </div>
          <span>{card.label}</span>
          <div className="kb-kpi__bottom">
            <strong>
              {card.value}
              {card.unit ? (
                <small className="kb-kpi__unit">{card.unit}</small>
              ) : null}
            </strong>
            {card.spark ? (
              <Sparkline color={card.color} values={card.spark} />
            ) : null}
          </div>
        </article>
      ))}
    </section>
  )
}
