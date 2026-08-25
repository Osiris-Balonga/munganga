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
  const mode = pathname.startsWith('/doctor/')
    ? 'doctor'
    : pathname.startsWith('/patient/')
      ? 'patient'
      : 'visitor'

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
