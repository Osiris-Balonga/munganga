import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '../../lib/auth/auth'
import { DoctorWorkspaceLayout } from '../../features/doctor-workspace/DoctorWorkspaceLayout'

export const Route = createFileRoute('/doctor')({
  beforeLoad: () => requireRole('doctor'),
  component: DoctorWorkspaceLayout,
})
