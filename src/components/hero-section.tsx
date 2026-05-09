import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Shield, Clock, HeartPulse, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 px-4 py-1 text-primary">
            Trusted by 500+ Hospitals in Dhaka
          </Badge>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Every Healthcare Solution.{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              One Hub.
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Experience seamless healthcare with real-time bed availability, instant appointments, emergency services, and your complete medical history - all in one secure platform.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">15 min</p>
              <p className="text-sm text-muted-foreground">Average Wait Time Reduced</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <HeartPulse className="h-6 w-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground">50,000+</p>
              <p className="text-sm text-muted-foreground">Patients Served Monthly</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Secure & Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
