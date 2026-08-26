import { createFileRoute } from '@tanstack/react-router'
import { UiKitPage } from './-ui-kit/UiKitPage'

export const Route = createFileRoute('/ui-kit')({
  component: UiKitPage,
})
