import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '../features/auth/'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return <SignupForm />
}
