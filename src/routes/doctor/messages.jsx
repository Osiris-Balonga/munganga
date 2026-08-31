import { createFileRoute } from '@tanstack/react-router'
import { DoctorMessagesView } from '../../features/doctor-workspace/ExtraViews'

export const Route = createFileRoute('/doctor/messages')({
  component: DoctorMessagesPage,
})

function DoctorMessagesPage() {
  return <DoctorMessagesView />
}
