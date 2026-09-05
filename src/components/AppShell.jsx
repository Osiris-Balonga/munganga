import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  DesktopHeader,
  MobileBottomNav,
  MobileTopBar,
} from './navigation/AppNavigation'
import { clearSession, getSession } from '../lib/auth/tokenStorage'

export function AppShell() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const session = getSession()
  const accountRole = session?.user?.role
  const canSwitchWorkspace = accountRole === 'doctor'
  const isDoctorSpace =
    pathname === '/doctor' || pathname.startsWith('/doctor/')
  const mode = isDoctorSpace
    ? 'doctor'
    : pathname.startsWith('/patient/')
      ? 'patient'
      : 'visitor'

  const user = session?.user
    ? {
        name: `${session.user.firstName} ${session.user.lastName}`,
        role: accountRole,
      }
    : undefined

  function handleRoleSwitch(nextMode) {
    if (nextMode === 'doctor' && accountRole !== 'doctor') return
    navigate({
      to: nextMode === 'doctor' ? '/doctor' : '/patient/appointments',
    })
  }

  function handleLogout() {
    clearSession()
    navigate({ to: '/' })
  }

  return (
    <div className={`app-shell ${isDoctorSpace ? 'app-shell--doctor' : ''}`}>
      <DesktopHeader
        canSwitchWorkspace={canSwitchWorkspace}
        mode={mode}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        user={user}
      />
      <MobileTopBar
        canSwitchWorkspace={canSwitchWorkspace}
        mode={mode}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        user={user}
      />
      <main>
        <Outlet />
      </main>
      <MobileBottomNav mode={mode} />
    </div>
  )
}
