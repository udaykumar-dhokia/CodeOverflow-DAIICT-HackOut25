import { useState } from 'react'
import { Icons } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { type RootState } from '@/store/store'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PlantDialog from '@/components/custom/dailogs/CreatePlantDailog'
import StorageDialog from '@/components/custom/dailogs/CreateStorageDailog'
import DistributionHubDialog from '@/components/custom/dailogs/CreateDistributionDailog'
import PipelineDialog from '@/components/custom/dailogs/CreatePipelineDailog'
import DashboardCharts from '@/components/custom/charts/DashboardCharts'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const assetsData = useSelector(
    (state: RootState) => state.projectDeveloperAssets,
  )
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false)
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false)
  const [isPipelineDialogOpen, setIsPipelineDialogOpen] = useState(false)
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] =
    useState(false)

  const {
    plants = [],
    storage = [],
    pipelines = [],
    distributionHubs = [],
  } = assetsData || {}

  const totalProjects =
    plants.length + storage.length + pipelines.length + distributionHubs.length

  const totalBudget =
    plants.reduce((a, p) => a + (p.budget || 0), 0) +
    storage.reduce((a, s) => a + (s.budget || 0), 0) +
    pipelines.reduce((a, pl) => a + (pl.budget || 0), 0) +
    distributionHubs.reduce((a, d) => a + (d.budget || 0), 0)

  // Collect all projects in one array for recent list
  const allProjects = [
    ...plants.map((p) => ({ ...p, type: 'Plant' })),
    ...storage.map((s) => ({ ...s, type: 'Storage' })),
    ...pipelines.map((pl) => ({ ...pl, type: 'Pipeline' })),
    ...distributionHubs.map((d) => ({ ...d, type: 'Distribution Hub' })),
  ]

  const recentProjects = allProjects.slice(-5).reverse()

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/80 cursor-pointer rounded-none flex items-center gap-2">
              <Icons.Plus /> Start New Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsPlantDialogOpen(true)}>
              Plant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsStorageDialogOpen(true)}>
              Storage
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsPipelineDialogOpen(true)}>
              Pipeline
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDistributionDialogOpen(true)}>
              Distribution Hub
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <PlantDialog
          open={isPlantDialogOpen}
          onOpenChange={setIsPlantDialogOpen}
        />
        <StorageDialog
          open={isStorageDialogOpen}
          onOpenChange={setIsStorageDialogOpen}
        />
        <DistributionHubDialog
          open={isDistributionDialogOpen}
          onOpenChange={setIsDistributionDialogOpen}
        />
        <PipelineDialog
          open={isPipelineDialogOpen}
          onOpenChange={setIsPipelineDialogOpen}
        />
      </header>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-none p-6 shadow flex flex-col">
          <h2 className="flex gap-2 text-lg font-medium text-gray-600">
            <Icons.Projects /> Projects
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white rounded-none p-6 shadow flex flex-col">
          <h2 className="flex gap-2 text-lg font-medium text-gray-600">
            <Icons.Wallet /> Budget
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            <span className="text-primary">₹ </span>
            {totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main content: Charts + Recent Projects */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts take 2/3 */}
        <div className="lg:col-span-2">
          <DashboardCharts
            plants={plants}
            storage={storage}
            pipelines={pipelines}
            distributionHubs={distributionHubs}
          />
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-none shadow p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Projects
            </h2>
            <Link to="/project-developer/projects">View All</Link>
          </div>
          <ul className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <li
                  key={project._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {project.project_name}
                    </p>
                    <p className="text-sm text-gray-500">{project.type}</p>
                  </div>
                  <div className="text-right">
                    {project.budget ? (
                      <p className="text-sm font-semibold text-primary">
                        ${project.budget.toLocaleString()}
                      </p>
                    ) : project.capacity ? (
                      <p className="text-sm text-gray-600">
                        {project.capacity} MW
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">—</p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent projects</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
