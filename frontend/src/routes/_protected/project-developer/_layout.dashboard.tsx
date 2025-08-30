import { useState } from 'react'
import { Icons } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { type RootState } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'
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
            <span className="text-primary">$ </span>
            {totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      <DashboardCharts
        plants={plants}
        storage={storage}
        pipelines={pipelines}
        distributionHubs={distributionHubs}
      />
    </div>
  )
}
