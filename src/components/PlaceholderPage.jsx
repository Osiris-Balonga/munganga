export function PlaceholderPage({
  eyebrow = 'Socle initial',
  title,
  description,
}) {
  return (
    <section className="placeholder-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}
