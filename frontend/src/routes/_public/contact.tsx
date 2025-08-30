import Footer from '@/components/custom/Footer'
import Header from '@/components/custom/Header'
import Team from '@/components/custom/Team'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <div className="">
        <Team />
      </div>
      <Footer />
    </>
  )
}
