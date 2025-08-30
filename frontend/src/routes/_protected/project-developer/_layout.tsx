import { ProjectDeveloperSidebar } from '@/components/custom/ProjectDeveloperSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { loginSuccess } from '@/store/slices/project-developer.slice'
import { store } from '@/store/store'
import { persistProjectDeveloperData } from '@/utils/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/project-developer/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await persistProjectDeveloperData()
    if (!user) {
      throw redirect({ to: '/auth/project-developer/login' })
    }
    store.dispatch(loginSuccess(user))
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
