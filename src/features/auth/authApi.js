import { apiClient } from '../../lib/api/apiClient'
import { saveSession } from '../../lib/auth/tokenStorage'

export async function login(credentials) {
  const session = await apiClient('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  saveSession(session)
  return session
}

export async function registerPatient(formData) {
  const session = await apiClient('/register', {
    method: 'POST',
    body: JSON.stringify({ ...formData, role: 'patient' }),
  })
  saveSession(session)
  return session
}
