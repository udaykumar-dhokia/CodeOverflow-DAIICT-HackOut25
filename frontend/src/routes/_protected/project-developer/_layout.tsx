import { ProjectDeveloperSidebar } from '@/components/custom/ProjectDeveloperSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { setProjects } from '@/store/slices/assets.slice'
import { loginSuccess } from '@/store/slices/project-developer.slice'
import { store } from '@/store/store'
import {
  persistProjectDeveloperData,
  persistProjectsAssetsData,
} from '@/utils/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/project-developer/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await persistProjectDeveloperData()
    if (!user) {
      throw redirect({ to: '/auth/project-developer/login' })
    }
    store.dispatch(loginSuccess(user))
    const assets = await persistProjectsAssetsData(user._id)
    store.dispatch(setProjects(assets))
  },
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <ProjectDeveloperSidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
