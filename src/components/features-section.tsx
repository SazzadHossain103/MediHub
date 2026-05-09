import { Badge } from "@/src/components/ui/badge"
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Bell, 
  Smartphone,
  Database,
  HeartHandshake
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your health data is protected following international healthcare privacy standards.",
  },
  {
    icon: Lock,
    title: "Blockchain Security",
    description: "Decentralized medical records ensure your data cannot be tampered with or accessed without permission.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Live bed availability, ambulance tracking, and queue positions updated every second.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Full support for Bengali and English, making healthcare accessible to everyone.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get alerts for appointment reminders, queue updates, and health advisories.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for mobile use in emergencies. Works offline with critical features.",
  },
  {
    icon: Database,
    title: "Complete History",
    description: "Access your entire medical history, prescriptions, and test results anytime.",
  },
  {
    icon: HeartHandshake,
    title: "Verified Network",
    description: "All hospitals, doctors, and service providers are verified and rated by patients.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-4 w-fit border-secondary/30 text-secondary">
              Why Choose MediHub
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Built for Trust, Designed for Emergencies
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              In healthcare, every second counts. MediHub is engineered with security, speed, and reliability at its core - because your health cannot wait.
            </p>
            
            <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your Data, Your Control</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We use blockchain technology to ensure you have complete control over who accesses your medical records. No data is shared without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
