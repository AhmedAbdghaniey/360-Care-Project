import HomeNavbar from '../../components/home/HomeNavbar'
import HeroSection from '../../components/home/HeroSection'
import FeaturesSection from '../../components/home/FeaturesSection'
import StatsSection from '../../components/home/StatsSection'
import HowItWorksSection from '../../components/home/HowItWorksSection'
import DoctorsShowcase from '../../components/home/DoctorsShowcase'
import TestimonialsSection from '../../components/home/TestimonialsSection'
import HospitalJobsSection from '../../components/home/HospitalJobsSection'
import CTASection from '../../components/home/CTASection'
import HomeFooter from '../../components/home/HomeFooter'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <DoctorsShowcase />
      <TestimonialsSection />
      <HospitalJobsSection />
      <CTASection />
      <HomeFooter />
    </div>
  )
}
