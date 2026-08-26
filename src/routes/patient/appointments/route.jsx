import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/patient/appointments')({
  component: Outlet,
})
