import { redirect } from '@tanstack/react-router'
import { clearSession, getSession, saveSession } from './tokenStorage'

export const auth = {
  getSession,
  saveSession,
  clearSession,
}

export function requireRole(expectedRole) {
  const session = getSession()

  if (!session?.accessToken || session.user?.role !== expectedRole) {
    throw redirect({ to: '/login' })
  }

  return session
}
