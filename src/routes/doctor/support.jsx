import { createFileRoute } from '@tanstack/react-router'
import { DoctorSupportView } from '../../features/doctor-workspace/ExtraViews'

export const Route = createFileRoute('/doctor/support')({
  component: DoctorSupportPage,
})

function DoctorSupportPage() {
  return <DoctorSupportView />
}
