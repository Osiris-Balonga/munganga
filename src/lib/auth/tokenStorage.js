const SESSION_KEY = 'munganga.session'

export function getSession() {
  const value = localStorage.getItem(SESSION_KEY)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getAccessToken() {
  return getSession()?.accessToken ?? null
}
