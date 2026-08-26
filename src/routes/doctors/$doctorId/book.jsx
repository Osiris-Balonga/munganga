import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../../components/PlaceholderPage'
import { requireRole } from '../../../lib/auth/auth'

export const Route = createFileRoute('/doctors/$doctorId/book')({
  beforeLoad: () => requireRole('patient'),
  component: BookPage,
})

function BookPage() {
  return (
    <PlaceholderPage
      title="Demander un rendez-vous"
      description="La réservation utilise exclusivement la route métier POST /api/book."
    />
  )
}
