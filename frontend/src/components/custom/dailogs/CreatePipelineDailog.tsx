import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog'
import { axiosInstance } from '@/api/axiosInstance'
import { useSelector } from 'react-redux'
import { store, type RootState } from '@/store/store'
import { addPipeline, type Pipeline } from '@/store/slices/assets.slice'
import Loader from '../Loader'

interface PipelineData {
  budget: number
  capacity: number
  length_estimate: number
  route_preference: string
  project_developer_id?: string
  location: string[]
  project_name: string
}

interface PipelineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultPipelineData = {
  budget: 2000000,
  capacity: 1000,
  length_estimate: 150,
  route_preference: 'coastal',
  project_developer_id: '',
  location: [],
  project_name: 'Finolex',
}

export default function PipelineDialog({
  open,
  onOpenChange,
}: PipelineDialogProps) {
  const { user } = useSelector((state: RootState) => state.projectDeveloper)

  const [formData, setFormData] = useState<PipelineData>({
    ...defaultPipelineData,
    project_developer_id: user?._id,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['budget', 'capacity', 'length_estimate'].includes(name)
        ? Number(value)
        : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.post(
        '/assets/upload-data/pipelines',
        formData,
      )
      toast.success(res.data.message || 'Pipeline uploaded successfully!')
      const newPipeline: Pipeline = res.data.pipeline || res.data
      store.dispatch(addPipeline(newPipeline))
      onOpenChange(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Analyse New Pipeline Project</DialogTitle>
          <DialogDescription>
            Fill in the details for your new Pipeline project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="budget">Project Name</Label>
            <Input
              id="project_name"
              name="project_name"
              type="text"
              value={formData.project_name}
              onChange={handleChange}
              className="rounded-none"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="length_estimate">Length Estimate (km)</Label>
            <Input
              id="length_estimate"
              name="length_estimate"
              type="number"
              value={formData.length_estimate}
              onChange={handleChange}
              className="rounded-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="route_preference">Route Preference</Label>
            <select
              id="route_preference"
              name="route_preference"
              value={formData.route_preference}
              onChange={handleChange}
              className="rounded-none border border-gray-300 p-2"
            >
              <option value="coastal">Coastal</option>
              <option value="inland">Inland</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/80 rounded-none w-full"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Get Analysis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
