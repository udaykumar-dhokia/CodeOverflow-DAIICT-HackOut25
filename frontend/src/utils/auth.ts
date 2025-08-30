import { axiosInstance } from '@/api/axiosInstance'

export const persistProjectDeveloperData = async () => {
  try {
    const res = await axiosInstance.get('/auth/project-developer/exists')
    return res?.data?.user || null
  } catch {
    return null
  }
}
