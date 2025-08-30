import { loginSuccess } from '@/store/slices/company.slice'
import { store } from '@/store/store'
import { persistCompanyData } from '@/utils/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/company/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await persistCompanyData()
    console.log(user)
    if (!user) {
      throw redirect({ to: '/auth/company/login' })
    }
    store.dispatch(loginSuccess(user))
    // const assets = await persistProjectsAssetsData(user._id)
    // store.dispatch(setProjects(assets))
  },
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
