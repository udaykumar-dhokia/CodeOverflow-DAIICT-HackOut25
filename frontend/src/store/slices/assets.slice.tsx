import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Plant {
  _id: string
  budget: number
  capacity: number
  preferred_source: string
  location: string[]
  logistic_preference: string
  project_developer_id: string
  createdAt: string
  updatedAt: string
}

interface Storage {
  _id: string
  budget: number
  capacity: number
  technology: string
  proximity_preference: string
  location: string[]
  project_developer_id: string
  createdAt: string
  updatedAt: string
}

export interface Pipeline {
  _id: string
  budget: number
  capacity: number
  length_estimate: number
  route_preference: string
  location: string[]
  project_developer_id: string
  createdAt: string
  updatedAt: string
}

interface DistributionHub {
  _id: string
  budget: number
  capacity: number
  service_radius: number
  proximity_preference: string
  land_requirement: number
  location: string[]
  project_developer_id: string
  createdAt: string
  updatedAt: string
}

interface ProjectDeveloperAssetsState {
  plants: Plant[]
  storage: Storage[]
  pipelines: Pipeline[]
  distributionHubs: DistributionHub[]
}

const initialState: ProjectDeveloperAssetsState = {
  plants: [],
  storage: [],
  pipelines: [],
  distributionHubs: [],
}

const ProjectDeveloperAssetsSlice = createSlice({
  name: 'ProjectDeveloperAssets',
  initialState,
  reducers: {
    setProjects: (
      state,
      action: PayloadAction<{
        plants: Plant[]
        storage: Storage[]
        pipelines: Pipeline[]
        distributionHubs: DistributionHub[]
      }>,
    ) => {
      state.plants = action.payload.plants
      state.storage = action.payload.storage
      state.pipelines = action.payload.pipelines
      state.distributionHubs = action.payload.distributionHubs
    },
    addPlant: (state, action: PayloadAction<Plant>) => {
      state.plants.push(action.payload)
    },
    addStorage: (state, action: PayloadAction<Storage>) => {
      state.storage.push(action.payload)
    },
    addPipeline: (state, action: PayloadAction<Pipeline>) => {
      state.pipelines.push(action.payload)
    },
    addDistributionHub: (state, action: PayloadAction<DistributionHub>) => {
      state.distributionHubs.push(action.payload)
    },
  },
})

export const {
  setProjects,
  addPlant,
  addStorage,
  addPipeline,
  addDistributionHub,
} = ProjectDeveloperAssetsSlice.actions
export default ProjectDeveloperAssetsSlice.reducer
