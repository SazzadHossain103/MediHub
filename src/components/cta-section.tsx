import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 md:px-12 md:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1" fill="currentColor" className="text-primary-foreground" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-primary-foreground/90">
              Join thousands of patients who have already discovered stress-free healthcare. Your health journey starts here.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                asChild
              >
                <Link href="/dashboard" className="cursor-pointer">
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Phone className="h-4 w-4" />
                Call: 16789
              </Button>
            </div>

            <p className="mt-8 text-sm text-primary-foreground/70">
              Free to use. No credit card required. Available 24/7.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
