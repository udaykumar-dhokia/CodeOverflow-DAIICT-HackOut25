import { useDispatch } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { logout } from '@/store/slices/project-developer.slice'
import { axiosInstance } from '@/api/axiosInstance'

export function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlLogout = async () => {
    try {
      await axiosInstance.post('/auth/project-developer/logout', {})

      dispatch(logout())
      navigate({ to: '/auth/project-developer/login' })
    } catch (error) {
      console.error('Failed to logout', error)
    }
  }

  return handlLogout
}
