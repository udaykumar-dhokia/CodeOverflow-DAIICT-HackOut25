import { Icons } from '@/assets/icons'
import Hero from '@/components/custom/Hero'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/openmap',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="">
        <header className="flex items-center justify-between px-6 pt-6 bg-white">
          <h1 className="text-3xl font-bold text-gray-800">Open Map</h1>
          <Button className="bg-primary hover:bg-primary/80 cursor-pointer rounded-none">
            <Icons.Plus /> Start New Project
          </Button>
        </header>
        <Hero />
      </div>
    </>
  )
}
