import { createRootRouteWithContext } from '@tanstack/react-router'
import { AppShell } from '../components/AppShell'

export const Route = createRootRouteWithContext()({
  component: AppShell,
})
