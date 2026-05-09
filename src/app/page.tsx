import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { HeroSection } from "../components/hero-section"
import { ServicesSection } from "../components/services-section"
import { HowItWorksSection } from "../components/how-it-works-section"
import { FeaturesSection } from "../components/features-section"
import { NearbyHospitals } from "../components/nearby-hospitals"
import { TrustSection } from "../components/trust-section"
import { CTASection } from "../components/cta-section"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <FeaturesSection />
        <NearbyHospitals />
        <TrustSection />
        <CTASection /> 
      </main>
      <Footer />
    </div>
  )
}
