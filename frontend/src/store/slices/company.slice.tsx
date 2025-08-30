import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Company {
  _id: string
  name: string
  website: string
  GSTIN?: string
  about_us?: string
  company_size?: string
  location?: string
  email: string
  contact?: string
  asset_type?: 'plant' | 'storage' | 'pipeline' | 'distribution_hub' | ''
  latitude?: number
  longitude?: number
}

interface CompanyState {
  isAuthenticated: boolean
  user: Company | null
  token: string | null
}

const initialState: CompanyState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const companyAuthSlice = createSlice({
  name: 'companyAuth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: Company; token: string }>,
    ) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
    setUser: (state, action: PayloadAction<Company>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { loginSuccess, logout, setUser } = companyAuthSlice.actions
export default companyAuthSlice.reducer
