import { createFileRoute } from '@tanstack/react-router'
import { DoctorPatientsView } from '../../features/doctor-workspace/ExtraViews'

export const Route = createFileRoute('/doctor/patients')({
  component: DoctorPatientsPage,
})

function DoctorPatientsPage() {
  return <DoctorPatientsView />
}
