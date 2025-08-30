import { useState } from 'react'
import { Icons } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { store, type RootState } from '@/store/store'
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
import { axiosInstance } from '@/api/axiosInstance'
import { toast } from 'sonner'
import { setProjects } from '@/store/slices/assets.slice'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { persistProjectsAssetsData } from '@/utils/auth'
import { ReportDialog } from '@/components/custom/dailogs/ReportDialog'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/projects',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const assetsData = useSelector(
    (state: RootState) => state.projectDeveloperAssets,
  )
  const { user } = useSelector((state: RootState) => state.projectDeveloper)

  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false)
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false)
  const [isPipelineDialogOpen, setIsPipelineDialogOpen] = useState(false)
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] =
    useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<'budget' | 'capacity' | ''>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string
    id: string
    name: string
  } | null>(null)

  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const {
    plants = [],
    storage = [],
    pipelines = [],
    distributionHubs = [],
  } = assetsData || {}

  const filterAndSort = (items: any[]) => {
    let filtered = items.filter((item) =>
      item.project_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey] || 0
        const valB = b[sortKey] || 0
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }

  const handleViewReport = (type: string, id: string) => {
    let reportData: any = null

    switch (type) {
      case 'plant':
        reportData = plants.find((p) => p._id === id)
        break
      case 'storage':
        reportData = storage.find((s) => s._id === id)
        break
      case 'pipeline':
        reportData = pipelines.find((pl) => pl._id === id)
        break
      case 'distributionHub':
        reportData = distributionHubs.find((d) => d._id === id)
        break
    }

    if (reportData) {
      setSelectedReport(reportData)
      setReportDialogOpen(true)
    }
  }

  const handleDelete = (type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const { type, id } = deleteTarget
    let endpoint = ''

    switch (type) {
      case 'plant':
        endpoint = `/assets/delete-plants/${id}`
        break
      case 'storage':
        endpoint = `/assets/delete-storage/${id}`
        break
      case 'pipeline':
        endpoint = `/assets/delete-pipeline/${id}`
        break
      case 'distributionHub':
        endpoint = `/assets/delete-distribution/${id}`
        break
      default:
        return
    }

    try {
      await axiosInstance.delete(endpoint)
      toast.success(`${type} deleted successfully!`)

      const state = store.getState().projectDeveloperAssets
      switch (type) {
        case 'plant':
          store.dispatch(
            setProjects({
              ...state,
              plants: state.plants.filter((p) => p._id !== id),
            }),
          )
          break
        case 'storage':
          store.dispatch(
            setProjects({
              ...state,
              storage: state.storage.filter((s) => s._id !== id),
            }),
          )
          break
        case 'pipeline':
          store.dispatch(
            setProjects({
              ...state,
              pipelines: state.pipelines.filter((pl) => pl._id !== id),
            }),
          )
          break
        case 'distributionHub':
          store.dispatch(
            setProjects({
              ...state,
              distributionHubs: state.distributionHubs.filter(
                (d) => d._id !== id,
              ),
            }),
          )
          break
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to delete asset!')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

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
          className="rounded-none flex-1 cursor-pointer bg-primary text-white"
          onClick={() => handleViewReport(type, asset._id)}
        >
          View Report
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          className="rounded-none flex-1 hover:bg-primary hover:text-white cursor-pointer"
        >
          Download
        </Button>
        <Button
          size="sm"
          variant={'outline'}
          className="rounded-none flex-1 cursor-pointer hover:border-red-400 hover:border"
          onClick={() =>
            handleDelete(type, asset._id, asset.project_name || '')
          }
        >
          <Icons.Trash />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          report={selectedReport}
        />

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

      {/* Search */}
      <div className="flex items-center gap-2 px-6 mb-6">
        <Icons.Search />
        <Input
          placeholder="Search your projects here..."
          className="rounded-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-none flex items-center gap-2"
                >
                  <Icons.Sort /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSortKey('budget')
                    setSortOrder('asc')
                  }}
                >
                  Budget (Low → High)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortKey('budget')
                    setSortOrder('desc')
                  }}
                >
                  Budget (High → Low)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortKey('capacity')
                    setSortOrder('asc')
                  }}
                >
                  Capacity (Low → High)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortKey('capacity')
                    setSortOrder('desc')
                  }}
                >
                  Capacity (High → Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Manual refresh */}
            <Button
              variant="outline"
              className="rounded-none flex items-center gap-2"
              onClick={async () => {
                if (!user?._id) return
                const assetData = await persistProjectsAssetsData(user._id)
                store.dispatch(setProjects(assetData))
              }}
            >
              <Icons.Refresh /> Reload
            </Button>
          </div>
        </div>
      </div>

      {/* Asset Lists */}
      <div className="p-6 space-y-8">
        {/* Plants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Plants</h2>
          {plants.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterAndSort(plants).map((p) =>
                renderAssetCard(p, 'plant', [
                  { label: 'Source', value: p.preferred_source },
                  { label: 'Name', value: p.project_name },
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
              {filterAndSort(storage).map((s) =>
                renderAssetCard(s, 'storage', [
                  { label: 'Technology', value: s.technology },
                  { label: 'Name', value: s.project_name },
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
              {filterAndSort(pipelines).map((pl) =>
                renderAssetCard(pl, 'pipeline', [
                  { label: 'Name', value: pl.project_name },
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
              {filterAndSort(distributionHubs).map((d) =>
                renderAssetCard(d, 'distributionHub', [
                  { label: 'Name', value: d.project_name },
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `You are about to delete ${deleteTarget.name} (${deleteTarget.type}). This action cannot be undone.`
                : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-none cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-none bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
