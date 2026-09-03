import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, ErrorState, TextField } from '../../design-system'
import { login } from './authApi'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('dr.makaya@munganga.cg')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const session = await login({ email, password })
      const role = session.user?.role
      navigate({
        to: role === 'doctor' ? '/doctor' : '/patient/appointments',
      })
    } catch (submitError) {
      setError(submitError.message || 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="placeholder-page auth-page">
      <p className="eyebrow">Connexion</p>
      <h1>Accéder à Munganga</h1>
      <p>
        Utilisez votre compte patient ou médecin. Les comptes de démonstration
        sont documentés dans le README.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <TextField
          autoComplete="email"
          label="Adresse e-mail"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <TextField
          autoComplete="current-password"
          label="Mot de passe"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        {error ? (
          <ErrorState
            description={error}
            onRetry={() => setError(null)}
            title="Connexion refusée"
          />
        ) : null}
        <Button disabled={loading} type="submit">
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>
    </section>
  )
}
