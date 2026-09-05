import { redirect } from '@tanstack/react-router'
import { clearSession, getSession, saveSession } from './tokenStorage'

export const auth = {
  getSession,
  saveSession,
  clearSession,
}

/**
 * Guard de route par rôle.
 * Un praticien (`doctor`) peut ouvrir les surfaces patient sans perdre
 * son identité de session — nécessaire pour le switch mode médecin/patient.
 * Seul un compte `doctor` peut entrer dans `/doctor/*`.
 */
export function requireRole(expectedRole) {
  const session = getSession()
  const role = session?.user?.role

  if (!session?.accessToken || !role) {
    throw redirect({ to: '/login' })
  }

  if (expectedRole === 'patient' && (role === 'patient' || role === 'doctor')) {
    return session
  }

  if (role !== expectedRole) {
    throw redirect({ to: '/login' })
  }

  return session
}
