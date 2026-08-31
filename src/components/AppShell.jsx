import { Outlet, useRouterState } from '@tanstack/react-router'
import {
  DesktopHeader,
  MobileBottomNav,
  MobileTopBar,
} from './navigation/AppNavigation'

export function AppShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isDoctorSpace =
    pathname === '/doctor' || pathname.startsWith('/doctor/')
  const mode = isDoctorSpace
    ? 'doctor'
    : pathname.startsWith('/patient/')
      ? 'patient'
      : 'visitor'

  if (isDoctorSpace) {
    return (
      <div className="app-shell app-shell--doctor">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <DesktopHeader mode={mode} />
      <MobileTopBar mode={mode} />
      <main>
        <Outlet />
      </main>
      <MobileBottomNav mode={mode} />
    </div>
  )
}
