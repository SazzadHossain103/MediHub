import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { 
  Bed, 
  Stethoscope, 
  Ambulance, 
  UserRound, 
  Droplets, 
  FileText,
  Brain,
  Activity
} from "lucide-react"

const services = [
  {
    icon: Bed,
    title: "Emergency Bed Tracking",
    description: "Real-time availability of ICU, CCU, and general beds across all hospitals. Never arrive to find no beds available.",
    badge: "Real-time",
    color: "primary",
  },
  {
    icon: Stethoscope,
    title: "Doctor Appointments",
    description: "Book appointments with specialists, view doctor profiles, and get test reviews - all from home.",
    badge: "Online Booking",
    color: "secondary",
  },
  {
    icon: Ambulance,
    title: "Ambulance Service",
    description: "Track available ambulances in your area with ETA estimates. One-tap emergency dispatch.",
    badge: "24/7 Available",
    color: "primary",
  },
  {
    icon: UserRound,
    title: "Nurse Services",
    description: "Request qualified nurses for at-home medical assistance, post-operative care, and elderly support.",
    badge: "Home Care",
    color: "secondary",
  },
  {
    icon: Droplets,
    title: "Blood Donation Network",
    description: "Connect with verified donors instantly. Real-time availability during emergencies saves lives.",
    badge: "Life Saving",
    color: "primary",
  },
  {
    icon: FileText,
    title: "Digital Medical Profile",
    description: "Your complete medical history, prescriptions, and test reports - secure, accessible, and always with you.",
    badge: "Blockchain Secured",
    color: "secondary",
  },
  {
    icon: Brain,
    title: "AI Health Interpreter",
    description: "Understand complex medical terms and reports with our AI-powered health interpreter in Bengali and English.",
    badge: "AI Powered",
    color: "primary",
  },
  {
    icon: Activity,
    title: "Pandemic Monitoring",
    description: "Stay informed with real-time disease outbreak tracking and health advisories for your area.",
    badge: "Safety First",
    color: "secondary",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-secondary/30 text-secondary">
            Our Services
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Complete Healthcare at Your Fingertips
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            From emergency services to routine check-ups, MediHub brings all healthcare solutions under one roof.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    service.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                  }`}>
                    <service.icon className={`h-6 w-6 ${
                      service.color === "primary" ? "text-primary" : "text-secondary"
                    }`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      service.color === "primary" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
              {/* Hover Gradient */}
              <div className={`absolute inset-x-0 bottom-0 h-1 ${
                service.color === "primary" 
                  ? "bg-gradient-to-r from-primary/0 via-primary to-primary/0" 
                  : "bg-gradient-to-r from-secondary/0 via-secondary to-secondary/0"
              } opacity-0 transition-opacity group-hover:opacity-100`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
