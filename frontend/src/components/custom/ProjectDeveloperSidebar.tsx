import { ChevronUp, Inbox, MessageCircle, User, User2 } from 'lucide-react'

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
    title: 'Projects',
    url: '/project-developer/dashboard',
    icon: Inbox,
  },
  {
    title: 'Open Maps',
    url: '/project-developer/openmap',
    icon: Inbox,
  },
  {
    title: 'Chat',
    url: '#',
    icon: MessageCircle,
  },
  {
    title: 'Profile',
    url: '#',
    icon: User,
  },
]

export function ProjectDeveloperSidebar() {
  const logout = useLogout()
  const { user } = useSelector((state: RootState) => state.projectDeveloper)

  const currentPath = window.location.pathname

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <h1 className="text-4xl font-bold text-primary">
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
