import { Outlet } from '@tanstack/react-router'
import { DoctorWorkspaceProvider, useDoctorWorkspace } from './workspaceContext'
import './doctor-workspace.css'
import './mboka-theme.css'

function WorkspaceFrame() {
  const { toast } = useDoctorWorkspace()

  return (
    <>
      <div className="dw-content kb-doctor-page">
        <Outlet />
      </div>
      {toast ? (
        <div className="dw-toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  )
}

export function DoctorWorkspaceLayout() {
  return (
    <DoctorWorkspaceProvider>
      <WorkspaceFrame />
    </DoctorWorkspaceProvider>
  )
}
