"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet"
import {
  LayoutDashboard,
  User,
  MapPin,
  Calendar,
  FileText,
  TestTube,
  Bell,
  Settings,
  LogOut,
  Menu,
  Shield,
  Heart,
  Stethoscope,
  Cross,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "./../../store/useAuthStore"


const sidebarLinks = [
  { href: "/patient", label: "Overview", icon: LayoutDashboard },
  { href: "/patient/profile", label: "Medical Profile", icon: User },
  { href: "/patient/hospitals", label: "Nearby Hospitals", icon: MapPin },
  { href: "/patient/doctors", label: "Find Doctors", icon: Stethoscope },
  { href: "/patient/nurses", label: "Find Nurses", icon: Cross },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar },
  { href: "/patient/tests", label: "Medical Tests", icon: TestTube },
  { href: "/patient/reports", label: "Test Reports", icon: FileText },
]

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-accent/50 p-4">
          <div className="flex items-center gap-2 text-secondary">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-semibold">HIPAA Compliant</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Your health data is encrypted and protected with industry-leading security standards.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuthStore()

  const logoutUser = async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include", // 🔥 VERY IMPORTANT
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();       // 🔥 clear cookie (server)
      logout();            // 🔥 clear Zustand (client)

      router.push("/login");    // 🔥 redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              <Heart className="h-4 w-4 text-secondary" />
              <span>Your health, our priority</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Patient" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium md:inline-block">John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <button onClick={handleLogout}>Logout</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
