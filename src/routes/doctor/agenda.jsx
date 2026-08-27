import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/doctor/agenda')({
  component: DoctorAgendaPage,
})

function DoctorAgendaPage() {
  return (
    <PlaceholderPage
      eyebrow="Espace médecin"
      title="Agenda"
      description="Les vues Jour, Semaine et Mois seront ajoutées ici."
    />
  )
}
