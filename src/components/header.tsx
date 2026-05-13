"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetDescription } from "@/src/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#hospitals", label: "Nearby Hospitals" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  // const { user } = useAuthStore() // Get user from Zustand store
  const { logout, user, token } = useAuthStore()
  const router = useRouter()

  const logoutUser = async () => {
    if (user?.role === "patient") {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // 🔥 VERY IMPORTANT

      });
    }
    else if (user?.role === "doctor") {
      await fetch("/api/doctor/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // 🔥 VERY IMPORTANT
      });
    }
    else if (user?.role === "hospital") {
      await fetch("/api/hospital/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // 🔥 VERY IMPORTANT
      });
    }
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub - Every Solution. One Hub."
            width={180}
            height={50}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {
          user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center cursor-pointer gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Patient" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden font-medium md:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href={`/${user?.role === "patient" ? "patient" : `${user?.role}/dashboard`}`}>Profile </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <button onClick={handleLogout} className="cursor-pointer">Logout</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )

        }



        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-5 bg-card">
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="mt-4 flex flex-col gap-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/${user?.role === "patient" ? "patient" : `${user?.role}/dashboard`}`} onClick={() => setIsOpen(false)}>Profile</Link>
                  </Button>
                  <Button variant="outline" className="w-full cursor-pointer " onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
