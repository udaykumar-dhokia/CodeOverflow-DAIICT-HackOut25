import { Icons } from '@/assets/icons'
import { Card, CardContent } from '@/components/ui/card'
import type { RootState } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useSelector } from 'react-redux'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/profile',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useSelector((state: RootState) => state.projectDeveloper)
  const assets = useSelector((state: RootState) => state.projectDeveloperAssets)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <User className="w-12 h-12 mb-4" />
        <p>No profile data available. Please login.</p>
      </div>
    )
  }
  const totalProjects =
    assets.plants.length +
    assets.storage.length +
    assets.pipelines.length +
    assets.distributionHubs.length

  const totalBudget =
    assets.plants.reduce((a, p) => a + (p.budget || 0), 0) +
    assets.storage.reduce((a, s) => a + (s.budget || 0), 0) +
    assets.pipelines.reduce((a, pl) => a + (pl.budget || 0), 0) +
    assets.distributionHubs.reduce((a, d) => a + (d.budget || 0), 0)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="shadow">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="w-16 h-16 bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user.asset_type && (
              <p className="text-sm text-gray-500 capitalize">
                Specialization: {user.asset_type.replace('_', ' ')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardContent className="p-6">
            <h3 className="flex gap-2 items-center text-gray-600 font-medium">
              <Icons.Projects /> Total Projects
            </h3>
            <p className="mt-2 text-3xl font-bold">{totalProjects}</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardContent className="p-6">
            <h3 className="flex gap-2 items-center text-gray-600 font-medium">
              <Icons.Wallet /> Total Budget
            </h3>
            <p className="mt-2 text-3xl font-bold text-primary">
              ₹{totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Projects
          </h3>
          <ul className="space-y-3">
            {[
              ...assets.plants,
              ...assets.storage,
              ...assets.pipelines,
              ...assets.distributionHubs,
            ]
              .slice(-5)
              .reverse()
              .map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{p.project_name}</p>
                    <p className="text-sm text-gray-500">
                      Budget: ${p.budget.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
