import { Icons } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const userData = useSelector((state: RootState) => state.projectDeveloper)

  const totalProjects = 0
  const totalBudget = 0

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/80 cursor-pointer rounded-none">
          <Icons.Plus /> Start New Project
        </Button>
      </header>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-none p-6 shadow flex flex-col">
          <h2 className="text-lg font-medium text-gray-600">Total Projects</h2>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white rounded-none p-6 shadow flex flex-col">
          <h2 className="text-lg font-medium text-gray-600">Total Budget</h2>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ${totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Optional: Add a project list */}
      {/* <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        {userData.projects && userData.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.projects.map((project: any) => (
              <div key={project.id} className="bg-white p-4 rounded-none shadow">
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <p className="text-gray-600 mt-1">
                  Budget: ${project.budget.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t added any projects yet.</p>
        )}
      </div> */}
    </div>
  )
}
