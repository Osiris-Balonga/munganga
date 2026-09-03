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
      }
    : undefined

  function handleRoleSwitch(nextMode) {
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
        mode={mode}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        user={user}
      />
      <MobileTopBar
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
