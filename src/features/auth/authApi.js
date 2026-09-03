import { apiClient } from '../../lib/api/apiClient'
import { saveSession } from '../../lib/auth/tokenStorage'

const LOGIN_ERROR_TRANSLATIONS = {
  'Incorrect password': 'Email ou mot de passe incorrect.',
  'Cannot find user': 'Email ou mot de passe incorrect.',
  'Email and password are required':
    'Veuillez renseigner votre email et votre mot de passe.',
}

const REGISTER_ERROR_TRANSLATIONS = {
  'Email and password are required':
    'Veuillez renseigner votre email et votre mot de passe.',
  'Email format is invalid': "L'adresse email est invalide.",
  'Password is too short':
    'Le mot de passe doit contenir au moins 4 caractères.',
  'Email already exists': 'Un compte existe déjà avec cette adresse email.',
}

function translateLoginError(error) {
  const translatedMessage = LOGIN_ERROR_TRANSLATIONS[error.message]

  if (translatedMessage) {
    return new Error(translatedMessage)
  }

  return error
}

function translateRegisterError(error) {
  const translatedMessage = REGISTER_ERROR_TRANSLATIONS[error.message]

  if (translatedMessage) {
    return new Error(translatedMessage)
  }

  return error
}
export async function login(credentials) {
  try {
    const session = await apiClient('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    saveSession(session)
    return session
  } catch (error) {
    throw translateLoginError(error)
  }
}

export async function registerPatient(formData) {
  try {
    const session = await apiClient('/register', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        role: 'patient',
      }),
    })

    saveSession(session)
    return session
  } catch (error) {
    throw translateRegisterError(error)
  }
}
