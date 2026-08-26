import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '../components/PlaceholderPage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <PlaceholderPage
      eyebrow="MVP médical à Brazzaville"
      title="Bienvenue sur Munganga"
      description="Le socle technique est prêt. Les parcours complets seront construits lors de la prochaine étape."
    />
  )
}
