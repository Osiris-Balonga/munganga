import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/doctors/')({
  component: DoctorsPage,
})

function DoctorsPage() {
  return (
    <PlaceholderPage
      title="Trouver un médecin"
      description="La liste, la recherche et les filtres seront ajoutés ici."
    />
  )
}
