import { useState, useEffect } from 'react'
import { Circle, Check } from 'lucide-react'
import {
  Button,
  ConfirmationDialog,
  Skeleton,
  TextField,
} from '../../design-system'
import { registerPatient } from './authApi'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

const STEPS = ['Identité', 'Contact', 'Sécurité']

export function SignupForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState(0)
  const [isHydrating, setIsHydrating] = useState(true)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    requestAnimationFrame(() => setIsHydrating(false))
  }, [])

  const setters = {
    firstName: setFirstName,
    lastName: setLastName,
    phone: setPhone,
    email: setEmail,
    password: setPassword,
  }

  const values = {
    firstName,
    lastName,
    phone,
    email,
    password,
  }

  const validators = {
    firstName: (v) => (v.trim() ? '' : 'Le prénom est requis.'),
    lastName: (v) => (v.trim() ? '' : 'Le nom est requis.'),
    phone: (v) => {
      const cleaned = v.replace(/\D/g, '')
      if (!cleaned) return 'Le numéro de téléphone est requis.'
      return /^[0-9]{8,15}$/.test(cleaned)
        ? ''
        : 'Numéro de téléphone invalide.'
    },
    email: (v) =>
      !v.trim()
        ? "L'adresse email est requise."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? 'Adresse email invalide.'
          : '',
    password: (v) =>
      v.length >= 8
        ? ''
        : 'Le mot de passe doit contenir au moins 8 caractères.',
  }

  const stepsFields = [
    ['firstName', 'lastName'],
    ['phone', 'email'],
    ['password'],
  ]

  const validateFields = (names) => {
    const nextErrors = {}
    names.forEach((name) => {
      const message = validators[name](values[name])
      if (message) nextErrors[name] = message
    })
    return nextErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setters[name](value)
    if (touched[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        const message = validators[name](value)
        if (message) next[name] = message
        else delete next[name]
        return next
      })
    }
  }

  const handleNext = () => {
    const fields = stepsFields[step]
    const nextErrors = validateFields(fields)
    setErrors(nextErrors)
    setTouched((prev) => {
      const next = { ...prev }
      fields.forEach((name) => (next[name] = true))
      return next
    })
    if (Object.keys(nextErrors).length === 0) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }
  }

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setPhone('')
    setEmail('')
    setPassword('')
    setErrors({})
    setTouched({})
    setStep(0)
  }

  const signupMutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      setIsSuccessOpen(true)
      resetForm()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const fields = stepsFields[step]
    const nextErrors = validateFields(fields)
    setErrors(nextErrors)
    setTouched((prev) => {
      const next = { ...prev }
      fields.forEach((name) => (next[name] = true))
      return next
    })
    if (Object.keys(nextErrors).length === 0) {
      signupMutation.mutate({ email, password, firstName, lastName, phone })
    }
  }

  const isLastStep = step === STEPS.length - 1

  if (isHydrating) {
    return (
      <section className="signup-container" aria-busy="true">
        <div className="signup-header">
          <Skeleton className="signup-skeleton__title" />
          <Skeleton className="signup-skeleton__description" />
        </div>
        <div className="signup-form signup-form--skeleton">
          <div className="signup-skeleton__steps">
            <Skeleton className="signup-skeleton__step" />
            <Skeleton className="signup-skeleton__step" />
            <Skeleton className="signup-skeleton__step" />
          </div>
          <Skeleton className="signup-skeleton__field" />
          <Skeleton className="signup-skeleton__field" />
          <Skeleton className="signup-skeleton__button" />
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="signup-container">
        <div className="signup-header">
          <h1>Créer un compte</h1>
          <p className="signup-description">
            Accédez à votre espace avec vos identifiants.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <ol className="signup-steps">
            {STEPS.map((label, index) => {
              const isActive = index === step
              const isCompleted = index < step
              return (
                <li
                  key={label}
                  className={`signup-step${isActive ? ' signup-step--active' : ''}${isCompleted ? ' signup-step--completed' : ''}`}
                >
                  {isCompleted ? (
                    <Check
                      className="signup-step__icon"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="signup-step__dot"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                  <span className="signup-step__label">{label}</span>
                </li>
              )
            })}
          </ol>

          {step === 0 && (
            <div className="signup-step__fields">
              <TextField
                label="Prénom"
                type="text"
                name="firstName"
                required
                placeholder="Votre prénom"
                value={firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <TextField
                label="Nom"
                type="text"
                name="lastName"
                required
                placeholder="Votre nom"
                value={lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>
          )}

          {step === 1 && (
            <div className="signup-step__fields">
              <TextField
                label="Numéro de téléphone"
                type="text"
                name="phone"
                required
                placeholder="Votre numéro de téléphone"
                value={phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
          )}

          {step === 2 && (
            <div className="signup-step__fields">
              <TextField
                label="Mot de passe"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
          )}

          {signupMutation.isError ? (
            <p className="signup-form__error" role="alert">
              {signupMutation.error?.message}
            </p>
          ) : null}

          <div className="signup-actions">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={handlePrev}>
                Retour
              </Button>
            )}
            {isLastStep ? (
              <Button type="submit" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? 'Création…' : 'Créer un compte'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            )}
          </div>
        </form>
      </section>
      <ConfirmationDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Compte créé"
        description="Votre compte a été créé avec succès. Confirmez pour vous rendre sur la page de connexion."
        confirmLabel="Aller à la connexion"
        cancelLabel="Fermer"
        onConfirm={() => navigate({ to: '/login' })}
      />
    </>
  )
}
