import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useState } from 'react'
import PlantDialog from './dailogs/CreatePlantDailog'
import StorageDialog from './dailogs/CreateStorageDailog'
import DistributionHubDialog from './dailogs/CreateDistributionDailog'
import PipelineDialog from './dailogs/CreatePipelineDailog'
import { Plus } from 'lucide-react'

const FloatingButton = () => {
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false)
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false)
  const [isPipelineDialogOpen, setIsPipelineDialogOpen] = useState(false)
  const [isDistributionDialogOpen, setIsDistributionDialogOpen] =
    useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary hover:bg-primary/80 cursor-pointer flex items-center justify-center w-14 h-14 p-0">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-56">
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
    </div>
  )
}

export default FloatingButton
