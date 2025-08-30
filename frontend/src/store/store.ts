import { configureStore } from '@reduxjs/toolkit'
import projectDeveloperReducer from './slices/project-developer.slice'
import projectDeveloperAssetsReducer from './slices/assets.slice'
import companyAuthReducer from './slices/company.slice'

export const store = configureStore({
  reducer: {
    projectDeveloper: projectDeveloperReducer,
    projectDeveloperAssets: projectDeveloperAssetsReducer,
    companyAuthReducer: companyAuthReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
