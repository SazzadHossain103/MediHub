"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Clock,
  CheckCircle,
  Building2,
  LogOut,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/src/hooks/use-toast"
import {
  getLoggedInHospital,
  getHospitalById,
  clearLoggedInHospital,
  type Hospital,
} from "@/src/lib/mock-data"

export default function HospitalStatusPage() {
  const router = useRouter()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hospitalId = getLoggedInHospital()
    
    if (!hospitalId) {
      router.push("/hospital/login")
      return
    }

    const hospitalData = getHospitalById(hospitalId)
    if (!hospitalData) {
      router.push("/hospital/login")
      return
    }

    setHospital(hospitalData)
    setIsLoading(false)
  }, [router])

  const handleRefresh = () => {
    const hospitalId = getLoggedInHospital()
    if (hospitalId) {
      const hospitalData = getHospitalById(hospitalId)
      if (hospitalData) {
        setHospital(hospitalData)
      }
    }
  }

  const handleLogout = () => {
    clearLoggedInHospital()
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    router.push("/hospital/login")
  }

  const handleGoToDashboard = () => {
    if (hospital) {
      router.push(`/hospital/dashboard/${hospital.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading hospital status...</p>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return null
  }

  const isPending = hospital.status === "pending"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/images/medihub-header.png"
              alt="MediHub"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Hospital Info Card */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{hospital.name}</CardTitle>
              </div>
              <CardDescription>{hospital.address}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>License: {hospital.licenseNumber}</p>
                <p>Email: {hospital.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className={isPending ? "border-amber-200 bg-amber-50/50" : "border-secondary/50 bg-secondary/5"}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {isPending ? (
                  <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-amber-500" />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-secondary" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">
                Hospital Status
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {isPending ? (
                <>
                  <Badge className="bg-amber-100 text-amber-700 text-lg px-4 py-2">
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Approval
                  </Badge>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      Your hospital registration is currently under review by our admin team.
                    </p>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-left">
                        This process typically takes 1-2 business days. Once approved, 
                        you will be able to access your hospital dashboard and start 
                        managing your services on MediHub.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Status
                  </Button>
                </>
              ) : (
                <>
                  <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approved
                  </Badge>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      Congratulations! Your hospital has been approved and is now active on MediHub.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can now access your dashboard to manage tests, beds, emergency queue, 
                      and other hospital services.
                    </p>
                  </div>
                  <Button size="lg" onClick={handleGoToDashboard}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Need help? Contact our support team at{" "}
                  <a href="mailto:support@/srcmedihub.com" className="text-primary hover:underline">
                    support@/srcmedihub.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
