import { useState } from 'react'
import { Icons } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { RootState } from '@/store/store'
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

  // Total projects
  const totalProjects =
    plants.length + storage.length + pipelines.length + distributionHubs.length

  // Total budget (safe for undefined budgets)
  const totalBudget =
    plants.reduce((a, p) => a + (p.budget || 0), 0) +
    storage.reduce((a, s) => a + (s.budget || 0), 0) +
    pipelines.reduce((a, pl) => a + (pl.budget || 0), 0) +
    distributionHubs.reduce((a, d) => a + (d.budget || 0), 0)

  // Handlers
  const handleViewReport = (type: string, id: string) => {
    console.log('View report:', type, id)
  }

  const handleDelete = (type: string, id: string) => {
    console.log('Delete asset:', type, id)
  }

  // Render each asset card safely
  const renderAssetCard = (
    asset: any,
    type: string,
    extraFields: { label: string; value: any }[] = [],
  ) => (
    <div
      key={asset._id}
      className="bg-white p-4 rounded-none shadow flex flex-col justify-between"
    >
      <div className="space-y-1">
        <p>
          <strong>Budget:</strong> ${(asset.budget || 0).toLocaleString()}
        </p>
        <p>
          <strong>Capacity:</strong> {asset.capacity || 0}
        </p>
        {extraFields.map((f) => (
          <p key={f.label}>
            <strong>{f.label}:</strong> {f.value || '-'}
          </p>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant={'outline'}
          className="rounded-none flex-1 cursor-pointer hover:bg-primary/80 hover:text-white"
          onClick={() => handleViewReport(type, asset._id)}
        >
          View Report
        </Button>
        <Button
          size="sm"
          variant={'outline'}
          className="rounded-none flex-1 cursor-pointer hover:border-red-400 hover:border"
          onClick={() => handleDelete(type, asset._id)}
        >
          <Icons.Trash />
        </Button>
      </div>
    </div>
  )

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

      {/* Search */}
      <div className="flex items-center gap-2 px-6 mb-6">
        <Icons.Search />
        <Input
          placeholder="Search your projects here..."
          className="rounded-none"
        />
        <div className="flex items-center gap-2">
          <Icons.Sort />
          <Icons.Refresh />
        </div>
      </div>

      {/* Asset Lists */}
      <div className="p-6 space-y-8">
        {/* Plants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Plants</h2>
          {plants.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map((p) =>
                renderAssetCard(p, 'plant', [
                  { label: 'Source', value: p.preferred_source },
                ]),
              )}
            </div>
          ) : (
            <p>No Plants added yet.</p>
          )}
        </div>

        {/* Storage */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Storage</h2>
          {storage.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storage.map((s) =>
                renderAssetCard(s, 'storage', [
                  { label: 'Technology', value: s.technology },
                ]),
              )}
            </div>
          ) : (
            <p>No Storage added yet.</p>
          )}
        </div>

        {/* Pipelines */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pipelines</h2>
          {pipelines.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pipelines.map((pl) =>
                renderAssetCard(pl, 'pipeline', [
                  { label: 'Length', value: pl.length_estimate + ' km' },
                  { label: 'Route Preference', value: pl.route_preference },
                ]),
              )}
            </div>
          ) : (
            <p>No Pipelines added yet.</p>
          )}
        </div>

        {/* Distribution Hubs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Distribution Hubs</h2>
          {distributionHubs.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {distributionHubs.map((d) =>
                renderAssetCard(d, 'distributionHub', [
                  { label: 'Service Radius', value: d.service_radius + ' km' },
                  { label: 'Proximity', value: d.proximity_preference },
                  {
                    label: 'Land Requirement',
                    value: d.land_requirement + ' m²',
                  },
                ]),
              )}
            </div>
          ) : (
            <p>No Distribution Hubs added yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
