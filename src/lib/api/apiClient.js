import { clearSession, getAccessToken } from '../auth/tokenStorage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function getErrorMessage(payload, status) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (
    payload &&
    typeof payload === 'object' &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }

  return `Erreur API (${status})`
}

export async function apiClient(path, options = {}) {
  const token = getAccessToken()
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearSession()

    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }

    throw new Error('Votre session a expiré.')
  }

  const payload =
    response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status))
  }

  return payload
}
