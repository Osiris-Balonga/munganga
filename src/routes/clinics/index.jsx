import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/clinics/')({
  component: ClinicsPage,
})

function ClinicsPage() {
  return (
    <PlaceholderPage
      title="Cliniques"
      description="L'annuaire des cliniques sera affiché ici."
    />
  )
}
