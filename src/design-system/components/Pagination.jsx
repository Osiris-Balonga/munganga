import { Button } from './Button'

export function Pagination({ page, pageCount, onPageChange }) {
  return (
    <nav className="ds-pagination" aria-label="Pagination">
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        size="sm"
        variant="secondary"
      >
        Précédent
      </Button>
      <span aria-live="polite">
        Page {page} sur {pageCount}
      </span>
      <Button
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        size="sm"
        variant="secondary"
      >
        Suivant
      </Button>
    </nav>
  )
}
