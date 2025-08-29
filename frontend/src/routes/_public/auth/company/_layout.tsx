import Footer from '@/components/custom/Footer'
import Header from '@/components/custom/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/company/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
