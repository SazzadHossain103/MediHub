import Image from "next/image"
import Link from "next/link"
import { Shield, Lock, HeartPulse } from "lucide-react"

const footerLinks = {
  services: [
    { href: "#", label: "Emergency Beds" },
    { href: "#", label: "Doctor Appointments" },
    { href: "#", label: "Ambulance Service" },
    { href: "#", label: "Nurse Services" },
    { href: "#", label: "Blood Donation" },
  ],
  company: [
    { href: "#", label: "About Us" },
    { href: "#", label: "Our Mission" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Press" },
  ],
  support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Contact Us" },
    { href: "#", label: "FAQs" },
    { href: "#", label: "Emergency: 999" },
  ],
  legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Data Protection" },
    { href: "#", label: "Cookie Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Trust Indicators */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-secondary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-5 w-5 text-primary" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HeartPulse className="h-5 w-5 text-secondary" />
              <span>Trusted by 500+ Hospitals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Image
              src="/images/medihub-footer.png"
              alt="MediHub - Every Solution. One Hub."
              width={150}
              height={180}
              className="h-32 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Transforming healthcare delivery in Dhaka City through a centralized platform connecting hospitals, patients, and emergency services.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Services</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Support</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MediHub. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Your health data is protected with blockchain-based security.
          </p>
        </div>
      </div>
    </footer>
  )
}
