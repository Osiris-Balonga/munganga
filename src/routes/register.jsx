import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../components/PlaceholderPage'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <PlaceholderPage
      title="Créer un compte patient"
      description="Seuls les patients pourront s'inscrire depuis cette page."
    />
  )
}
