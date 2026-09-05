export function PageBanner({ eyebrow, title, description, action, side }) {
  return (
    <section className="kb-banner">
      <div>
        {eyebrow ? <p>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        {action}
      </div>
      {side ? <div className="kb-banner__side">{side}</div> : null}
    </section>
  )
}
