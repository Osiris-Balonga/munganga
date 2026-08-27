import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../components/PlaceholderPage'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <PlaceholderPage
      title="Connexion"
      description="Le formulaire utilisera le JWT réel fourni par json-server-auth."
    />
  )
}
