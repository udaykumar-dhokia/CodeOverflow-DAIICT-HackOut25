import ChatWidget from '@/components/custom/chatbot/ChatBot'
import Footer from '@/components/custom/Footer'
import Header from '@/components/custom/Header'
import Hero from '@/components/custom/Hero'
import MainHero from '@/components/custom/MainHero'
import Steps from '@/components/custom/Steps'
import Team from '@/components/custom/Team'
import FeaturesSectionDemo from '@/components/ui/features-section-demo-1'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: App,
})

function App() {
  return (
    <>
      <Header />
      <MainHero />
      <Hero />
      <FeaturesSectionDemo />
      <Steps />
      <Team />
      <Footer />
    </>
  )
}
