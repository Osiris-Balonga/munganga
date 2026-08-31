import { createFileRoute } from '@tanstack/react-router'
import { DoctorStatsView } from '../../features/doctor-workspace/ExtraViews'

export const Route = createFileRoute('/doctor/stats')({
  component: DoctorStatsPage,
})

function DoctorStatsPage() {
  return <DoctorStatsView />
}
