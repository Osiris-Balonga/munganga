import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../../components/PlaceholderPage'

export const Route = createFileRoute('/patient/appointments/$appointmentId')({
  component: PatientAppointmentPage,
})

function PatientAppointmentPage() {
  return (
    <PlaceholderPage
      eyebrow="Espace patient"
      title="Détail du rendez-vous"
      description="Le détail et l'annulation autorisée seront ajoutés ici."
    />
  )
}
