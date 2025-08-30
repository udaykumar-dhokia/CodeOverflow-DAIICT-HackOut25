import { axiosInstance } from '@/api/axiosInstance'

export const persistProjectDeveloperData = async () => {
  try {
    const res = await axiosInstance.get('/auth/project-developer/exists')
    return res?.data?.user || null
  } catch {
    return null
  }
}

export const persistProjectsAssetsData = async (projectDeveloperId: string) => {
  try {
    const res = await axiosInstance.get(
      `/assets/get-all-projects-developer/${projectDeveloperId}`,
    )
    return res?.data?.data || null
  } catch (err) {
    console.error('Error fetching projects:', err)
    return null
  }
}

export const persistCompanyData = async () => {
  try {
    const res = await axiosInstance.get('/auth/company/exists')
    return res?.data?.user || null
  } catch {
    return null
  }
}
