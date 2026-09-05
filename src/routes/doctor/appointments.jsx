import { createFileRoute } from '@tanstack/react-router'
import { DoctorAppointmentsView } from '../../features/doctor-workspace/DoctorAppointmentsView'

export const Route = createFileRoute('/doctor/appointments')({
  component: DoctorAppointmentsPage,
})

function DoctorAppointmentsPage() {
  return <DoctorAppointmentsView />
}
