import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/company/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/company/_layout/dashboard"!</div>
}
