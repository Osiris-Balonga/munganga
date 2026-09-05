import { createFileRoute } from '@tanstack/react-router'
import { DoctorAgendaView } from '../../features/doctor-workspace/DoctorAgendaView'

export const Route = createFileRoute('/doctor/agenda')({
  component: DoctorAgendaPage,
})

function DoctorAgendaPage() {
  return <DoctorAgendaView />
}
