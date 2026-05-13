"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Sheet, SheetContent } from "@/src/components/ui/sheet"
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  Stethoscope,
} from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/doctor/dashboard" },
  { id: "chamber", label: "Chamber Info", icon: Building2, href: "/doctor/dashboard/chamber-info" },
  { id: "patients", label: "Patients", icon: Users, href: "/doctor/dashboard/patients" },
  { id: "settings", label: "Settings", icon: Settings, href: "/doctor/dashboard/settings" },
]

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout, doctorToken } = useAuthStore();

  useEffect(() => {
     
    if (!user) {
      router.push("/doctor/login")
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/doctor/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${doctorToken}`,
        },
        credentials: "include", // 🔥 VERY IMPORTANT
      });
      if (!res.ok) {
        console.error("Logout failed with status:", res.status);
        // return;
      }

      logout();            // 🔥 clear Zustand (client)

      router.push("/doctor/login") // 🔥 redirect to login page
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const isActive = (href: string) => {
    if (href === "/doctor/dashboard") {
      return pathname === "/doctor/dashboard"
    }
    return pathname.startsWith(href)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub"
            width={120}
            height={35}
            className="h-8 w-auto"
          />
        </Link>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span>Doctor Portal</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card px-4 h-16 flex items-center justify-between lg:justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Dr. {user?.name}</p>
              <p className="text-xs text-muted-foreground">Doctor Portal</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
