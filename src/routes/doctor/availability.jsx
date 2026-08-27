import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/doctor/availability')({
  component: DoctorAvailabilityPage,
})

function DoctorAvailabilityPage() {
  return (
    <PlaceholderPage
      eyebrow="Espace médecin"
      title="Disponibilités"
      description="La gestion des créneaux sera implémentée via des routes métier protégées."
    />
  )
}
