import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Shield, Award, Users, Building2 } from "lucide-react"

const stats = [
  {
    icon: Building2,
    value: "500+",
    label: "Partner Hospitals",
    description: "Across Dhaka City",
  },
  {
    icon: Users,
    value: "1M+",
    label: "Registered Patients",
    description: "Trust MediHub",
  },
  {
    icon: Award,
    value: "99.9%",
    label: "Uptime",
    description: "Always Available",
  },
  {
    icon: Shield,
    value: "0",
    label: "Data Breaches",
    description: "Since Launch",
  },
]

const testimonials = [
  {
    quote: "MediHub saved my father&apos;s life. We found an ICU bed in 10 minutes when every hospital we called said no beds available.",
    author: "Fatima Rahman",
    role: "Patient Family",
  },
  {
    quote: "As a hospital administrator, MediHub has reduced our emergency room chaos by 40%. Patients arrive informed and prepared.",
    author: "Dr. Karim Ahmed",
    role: "Dhaka Medical College",
  },
  {
    quote: "The blood donation network connected us with 5 donors within an hour. This platform is genuinely life-saving.",
    author: "Mohammad Hasan",
    role: "Emergency Case",
  },
]

export function TrustSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-border/50 bg-card p-6 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="font-medium text-foreground">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-secondary/30 text-secondary">
              Trusted by Thousands
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Real Stories, Real Impact
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-secondary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
