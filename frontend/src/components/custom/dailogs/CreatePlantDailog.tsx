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
import { addPlant } from '@/store/slices/assets.slice'

interface PlantData {
  budget: number
  capacity: number
  preferred_source: string
  logistic_preference: string
  project_name: string
}

interface PlantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultPlantData: PlantData = {
  budget: 3000000,
  capacity: 2000,
  preferred_source: 'solar',
  logistic_preference: 'port',
  project_name: 'Finolex',
}

export default function PlantDialog({ open, onOpenChange }: PlantDialogProps) {
  const [formData, setFormData] = useState<PlantData>(defaultPlantData)
  const [loading, setLoading] = useState(false)

  const user = useSelector((state: RootState) => state.projectDeveloper.user)

  const handleChange = (name: keyof PlantData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'budget' || name === 'capacity' ? Number(value) || 0 : value,
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
        '/assets/upload-data/plants',
        payload,
      )
      console.log('Response:', res.data)
      const planData = await res.data
      store.dispatch(addPlant(planData))
      toast.success('Plant data uploaded successfully!')
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to upload plant data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Plant Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new Plant project.
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
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget || ''}
              onChange={(e) => handleChange('budget', e.target.value)}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="capacity">Capacity (tonns/day)</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="preferred_source">Preferred Source</Label>
            <Select
              value={formData.preferred_source}
              onValueChange={(value) => handleChange('preferred_source', value)}
            >
              <SelectTrigger className="rounded-none border border-gray-300 p-2 w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydrogen">Hydrogen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="logistic_preference">Logistic Preference</Label>
            <Select
              value={formData.logistic_preference}
              onValueChange={(value) =>
                handleChange('logistic_preference', value)
              }
            >
              <SelectTrigger className="rounded-none border border-gray-300 p-2 w-full">
                <SelectValue placeholder="Select logistic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="port">Port</SelectItem>
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80 rounded-none w-full"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Analyse your plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
