import { configureStore } from '@reduxjs/toolkit'
import projectDeveloperReducer from './slices/project-developer.slice'

export const store = configureStore({
  reducer: {
    projectDeveloper: projectDeveloperReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
