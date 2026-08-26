import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '../../lib/auth/auth'

export const Route = createFileRoute('/doctor')({
  beforeLoad: () => requireRole('doctor'),
  component: Outlet,
})
