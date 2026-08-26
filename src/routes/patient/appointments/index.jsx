import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../../components/PlaceholderPage'

export const Route = createFileRoute('/patient/appointments/')({
  component: PatientAppointmentsPage,
})

function PatientAppointmentsPage() {
  return (
    <PlaceholderPage
      eyebrow="Espace patient"
      title="Mes rendez-vous"
      description="Les rendez-vous futurs, passés, refusés et annulés seront listés ici."
    />
  )
}
