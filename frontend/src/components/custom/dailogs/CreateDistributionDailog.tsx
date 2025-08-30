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
} from '../ui/dialog'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { store, type RootState } from '@/store/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { axiosInstance } from '@/api/axiosInstance'
import { addDistributionHub } from '@/store/slices/assets.slice'

interface DistributionHubData {
  budget: number
  capacity: number
  service_radius: number
  proximity_preference: string
  land_requirement: number
  project_name: string
}

interface DistributionHubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultHubData: DistributionHubData = {
  budget: 100000,
  capacity: 5000,
  service_radius: 60,
  proximity_preference: 'near pipeline',
  land_requirement: 2000,
  project_name: 'Finolex',
}

export default function DistributionHubDialog({
  open,
  onOpenChange,
}: DistributionHubDialogProps) {
  const [formData, setFormData] = useState<DistributionHubData>(defaultHubData)
  const [loading, setLoading] = useState(false)
  const user = useSelector((state: RootState) => state.projectDeveloper.user)

  const handleChange = (
    name: keyof DistributionHubData,
    value: string | number,
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
        '/assets/upload-data/distribution-hub',
        payload,
      )
      console.log('Response:', res.data)
      const data = await res.data
      store.dispatch(addDistributionHub(data))
      toast.success('Distribution Hub data uploaded successfully!')
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to upload data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Analyse New Distribution Hub Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new Distribution Hub project.
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
            <Label htmlFor="capacity">Capacity (tonns/day)</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', Number(e.target.value))}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="service_radius">Service Radius (km)</Label>
            <Input
              id="service_radius"
              type="number"
              value={formData.service_radius}
              onChange={(e) =>
                handleChange('service_radius', Number(e.target.value))
              }
              className="rounded-none"
            />
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
                <SelectItem value="near pipeline">Near Pipeline</SelectItem>
                <SelectItem value="near hub">Near Hub</SelectItem>
                <SelectItem value="near plant">Near Plant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="land_requirement">Land Requirement (sqm)</Label>
            <Input
              id="land_requirement"
              type="number"
              value={formData.land_requirement}
              onChange={(e) =>
                handleChange('land_requirement', Number(e.target.value))
              }
              className="rounded-none"
            />
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
