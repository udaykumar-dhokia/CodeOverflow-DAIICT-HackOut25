import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { axiosInstance } from '@/api/axiosInstance'
import { useSelector } from 'react-redux'
import { store, type RootState } from '@/store/store'
import { addStorage } from '@/store/slices/assets.slice'

interface StorageData {
  budget: number
  capacity: number
  technology: string
  proximity_preference: string
  location: string[]
  project_name: string
}

interface StorageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultStorageData: StorageData = {
  budget: 1500000,
  capacity: 500,
  technology: 'battery',
  proximity_preference: 'plant',
  location: [],
  project_name: 'Finolex',
}

export default function StorageDialog({
  open,
  onOpenChange,
}: StorageDialogProps) {
  const [formData, setFormData] = useState<StorageData>(defaultStorageData)
  const [loading, setLoading] = useState(false)
  const user = useSelector((state: RootState) => state.projectDeveloper.user)

  const handleChange = (
    name: keyof StorageData,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const payload = {
        ...formData,
        project_developer_id: user?._id,
      }
      const res = await axiosInstance.post(
        '/assets/upload-data/storage',
        payload,
      )
      store.dispatch(addStorage(res.data))
      console.log('Response:', res.data)
      toast.success('Storage data uploaded successfully!')
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(
        err.response?.data?.message || 'Failed to upload storage data',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Analyse New Storage Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new Storage project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="project_name">Project Name</Label>
            <Input
              id="project_name"
              type="text"
              value={formData.project_name}
              onChange={(e) => handleChange('project_name', e.target.value)}
              className="rounded-none"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', Number(e.target.value))}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="capacity">Capacity (tonns)</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', Number(e.target.value))}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="technology">Technology</Label>
            <Select
              value={formData.technology}
              onValueChange={(value) => handleChange('technology', value)}
            >
              <SelectTrigger className="rounded-none border border-gray-300 p-2 w-full">
                <SelectValue placeholder="Select technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="pumped_hydro">Pumped Hydro</SelectItem>
                <SelectItem value="hydrogen">Hydrogen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="proximity_preference">Proximity Preference</Label>
            <Select
              value={formData.proximity_preference}
              onValueChange={(value) =>
                handleChange('proximity_preference', value)
              }
            >
              <SelectTrigger className="rounded-none border border-gray-300 p-2 w-full">
                <SelectValue placeholder="Select proximity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant">Near Plant</SelectItem>
                <SelectItem value="hub">Near Hub</SelectItem>
                <SelectItem value="grid">Near Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80 rounded-none w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Analyse your plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
