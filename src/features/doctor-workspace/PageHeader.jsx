export function PageHeader({ title, description, action, variant = 'plain' }) {
  return (
    <header className={variant === 'hero' ? 'kb-subhero' : 'kb-page-head'}>
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="kb-page-head__action">{action}</div> : null}
    </header>
  )
}
