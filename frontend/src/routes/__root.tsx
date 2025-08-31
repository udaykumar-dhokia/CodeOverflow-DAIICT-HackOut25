import ChatWidget from '@/components/custom/chatbot/ChatBot'
import { Toaster } from '@/components/ui/sonner'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ChatWidget />
      <Toaster />
    </>
  ),
})
