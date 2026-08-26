import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export const Route = createFileRoute('/doctor/appointments')({
  component: DoctorAppointmentsPage,
})

function DoctorAppointmentsPage() {
  return (
    <PlaceholderPage
      eyebrow="Espace médecin"
      title="Demandes de rendez-vous"
      description="La confirmation et le refus passent par les routes métier protégées."
    />
  )
}
