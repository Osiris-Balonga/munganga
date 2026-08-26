import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '../../lib/auth/auth'

export const Route = createFileRoute('/patient')({
  beforeLoad: () => requireRole('patient'),
  component: Outlet,
})
