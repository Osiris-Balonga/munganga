import { ErrorState, Skeleton } from '../../design-system'

export function DoctorDataState({
  isLoading,
  error,
  onRetry,
  children,
  loadingLabel = 'Chargement des données…',
}) {
  if (isLoading) {
    return (
      <section aria-busy="true" className="kb-page kb-page--loading">
        <p className="sr-only">{loadingLabel}</p>
        <div className="kb-kpis">
          {Array.from({ length: 4 }, (_, index) => (
            <article className="kb-kpi" key={index}>
              <Skeleton className="kb-skeleton-line kb-skeleton-line--sm" />
              <Skeleton className="kb-skeleton-line" />
              <Skeleton className="kb-skeleton-line kb-skeleton-line--lg" />
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="kb-page">
        <ErrorState
          description={
            error.message ||
            'Impossible de récupérer les données. Vérifiez votre connexion.'
          }
          onRetry={onRetry}
          title="Erreur de chargement"
        />
      </section>
    )
  }

  return children
}
