import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface projectDeveloper {
  _id: string
  name: string
  email: string
  asset_type?: 'plant' | 'storage' | 'pipeline' | 'distribution_hub' | ''
}

interface projectDeveloperState {
  isAuthenticated: boolean
  user: projectDeveloper | null
}

const initialState: projectDeveloperState = {
  isAuthenticated: false,
  user: null,
}

const projectDeveloperSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    setUser: (state, action: PayloadAction<projectDeveloper>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { loginSuccess, logout, setUser } = projectDeveloperSlice.actions
export default projectDeveloperSlice.reducer
