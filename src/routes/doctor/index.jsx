import { createFileRoute } from '@tanstack/react-router'
import { DoctorDashboard } from '../../features/doctor-workspace/DoctorDashboard'

export const Route = createFileRoute('/doctor/')({
  component: DoctorDashboard,
})
