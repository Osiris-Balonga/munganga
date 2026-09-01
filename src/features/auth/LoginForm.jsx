import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { login } from './authApi'
import { Button, Skeleton, TextField } from '../../design-system'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isHydrating, setIsHydrating] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrating(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      if (session.user.role === 'doctor') {
        navigate({ to: '/doctor/agenda' })
      } else if (session.user.role === 'patient') {
        navigate({ to: '/patient/appointments' })
      } else {
        navigate({ to: '/' })
      }
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    loginMutation.mutate({ email, password })
  }

  const fieldError = loginMutation.isError ? loginMutation.error?.message : null

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    if (loginMutation.isError) loginMutation.reset()
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    if (loginMutation.isError) loginMutation.reset()
  }

  if (isHydrating) {
    return (
      <section className="login-container" aria-busy="true">
        <div className="login-form login-form--skeleton">
          <Skeleton className="login-skeleton__title" />
          <Skeleton className="login-skeleton__field" />
          <Skeleton className="login-skeleton__field" />
          <Skeleton className="login-skeleton__button" />
        </div>
      </section>
    )
  }

  return (
    <section className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Connexion</h1>
        <p className="login-form__description">
          Accédez à votre espace avec vos identifiants.
        </p>

        <div className="login-form__fields">
          <TextField
            label="Email"
            type="email"
            name="email"
            required
            placeholder="Votre adresse email"
            value={email}
            onChange={handleEmailChange}
            error={fieldError}
          />
          <TextField
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={handlePasswordChange}
            error={fieldError}
          />

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Connexion…' : 'Connexion'}
          </Button>
        </div>
        <p className="login-form__alt">
          Pas encore de compte ?{' '}
          <Link to="/register" className="login-form__link">
            Créer un compte
          </Link>
        </p>
      </form>
    </section>
  )
}
