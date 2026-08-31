import { redirect } from '@tanstack/react-router'
import { getSession, saveSession } from '../../lib/auth/tokenStorage'
import { practitioner } from './mockData'

export function ensureDoctorPreviewSession() {
  const session = getSession()

  if (session?.accessToken && session.user?.role === 'doctor') {
    return session
  }

  if (session?.user?.role === 'patient') {
    throw redirect({ to: '/login' })
  }

  const previewSession = {
    accessToken: 'preview-doctor',
    user: {
      id: practitioner.userId,
      email: practitioner.email,
      firstName: practitioner.firstName,
      lastName: practitioner.lastName,
      role: 'doctor',
    },
  }
  saveSession(previewSession)
  return previewSession
}
