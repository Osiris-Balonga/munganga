import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../../components/PlaceholderPage'

export const Route = createFileRoute('/doctors/$doctorId/')({
  component: DoctorPage,
})

function DoctorPage() {
  return (
    <PlaceholderPage
      title="Fiche du médecin"
      description="Les informations du praticien et ses créneaux seront affichés ici."
    />
  )
}
