import { Badge } from "@/src/components/ui/badge"
import { MapPin, Search, Calendar, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Share Your Location",
    description: "Enable location access to find hospitals, ambulances, and services near you instantly.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find What You Need",
    description: "Search for available beds, doctors, blood donors, or any healthcare service in real-time.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Book Instantly",
    description: "Reserve beds, schedule appointments, or request ambulances with just a few taps.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Get Care",
    description: "Arrive at the hospital with everything pre-arranged. No queues, no paperwork, no stress.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            How It Works
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Healthcare Made Simple
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Four simple steps to access quality healthcare without the usual hassles.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection Line - Desktop */}
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="relative mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/20 bg-card shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                    {step.number}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="my-4 h-8 w-0.5 bg-primary/20 sm:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
