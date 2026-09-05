import { createFileRoute } from '@tanstack/react-router'
import { DoctorAvailabilityView } from '../../features/doctor-workspace/DoctorAvailabilityView'

export const Route = createFileRoute('/doctor/availability')({
  component: DoctorAvailabilityPage,
})

function DoctorAvailabilityPage() {
  return <DoctorAvailabilityView />
}
