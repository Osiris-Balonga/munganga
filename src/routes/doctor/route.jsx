import { createFileRoute } from '@tanstack/react-router'
import { DoctorWorkspaceLayout } from '../../features/doctor-workspace/DoctorWorkspaceLayout'
import { ensureDoctorPreviewSession } from '../../features/doctor-workspace/previewSession'

export const Route = createFileRoute('/doctor')({
  beforeLoad: () => ensureDoctorPreviewSession(),
  component: DoctorWorkspaceLayout,
})
