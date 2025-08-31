import {
  BuildingIcon,
  ChevronUp,
  LayoutDashboard,
  MapPinPlus,
  MessageCircle,
  User,
  User2,
} from 'lucide-react'
import back from '/back.jpeg'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Link } from '@tanstack/react-router'
import { useLogout } from '@/hooks/useLogout'

const items = [
  {
    title: 'Dashoard',
    url: '/company/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '/company/projects',
    icon: BuildingIcon,
  },
  {
    title: 'Open Maps',
    url: '/company/openmap',
    icon: MapPinPlus,
  },
  {
    title: 'Profile',
    url: '/company/profile',
    icon: User,
  },
]

export function CompanySidebar() {
  const logout = useLogout()
  const { user } = useSelector((state: RootState) => state.companyAuthReducer)

  const currentPath = window.location.pathname

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <span className="sr-only">Home</span>
            <img src={back} alt="" className="w-15" />
            <h1 className="text-4xl text-primary font-bold">
              H<sub>2</sub>Grid
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = currentPath === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive ? 'bg-primary text-white rounded-none' : ''
                      }
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-2 px-2 py-1"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={logout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
