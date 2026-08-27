import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/clinics/$clinicId')({
  component: ClinicPage,
})

function ClinicPage() {
  return (
    <PlaceholderPage
      title="Fiche de la clinique"
      description="Les informations et médecins associés seront affichés ici."
    />
  )
}
