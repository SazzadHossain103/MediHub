"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { useAuthStore } from "@/src/store/useAuthStore"

// Dynamically import map component to avoid SSR issues
const LocationPickerMap = dynamic(() => import("@/src/components/location-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-lg border border-border bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading map...</span>
      </div>
    </div>
  ),
})

export default function HospitalRegistrationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    hospitalName: "",
    licenseNumber: "",
    address: "",
    phone: "",
    licenseDocument: null as File | null,
    email: "",
    password: "",
  })
  const [location, setLocation] = useState({ lat: 23.8103, lng: 90.4125 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { setUser} = useAuthStore()
  const { setOtpEmail } = useAuthStore();

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, licenseDocument: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Prepare form data for API
      const submitData = new FormData()
      submitData.append("hospitalName", formData.hospitalName)
      submitData.append("email", formData.email)
      submitData.append("password", formData.password)
      submitData.append("licenseNumber", formData.licenseNumber)
      submitData.append("address", formData.address)
      submitData.append("phone", formData.phone)
      submitData.append("location", JSON.stringify(location))

      if (formData.licenseDocument) {
        submitData.append("licenseDocument", formData.licenseDocument)
      }

      const response = await fetch("/api/hospital/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.hospitalName,
          email: formData.email,
          password: formData.password,
          licenseNumber: formData.licenseNumber,
          address: formData.address,
          phone: formData.phone,
          location,
          licenseDocument: formData.licenseDocument?.name || null,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setUser({
        id: "temp", // better: return from backend or decode JWT
        email: formData.email,
        role: "hospital",
      })
      setOtpEmail(formData.email);

      setSuccess(data.message || "Registration successful!")
      setTimeout(() => {
        router.push("/verify-email")
      }, 2000)

    } catch (error: any) {
      setError(error.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/images/medihub-header.png"
              alt="MediHub"
              width={140}
              height={40}
              className="h-10 w-auto"
              style={{ width: "auto" }}
            />
          </Link>
          <CardTitle className="text-2xl">Hospital Registration</CardTitle>
          <CardDescription>
            Register your hospital to join the MediHub network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                type="text"
                placeholder="Enter hospital name"
                value={formData.hospitalName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                placeholder="Enter license number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter hospital address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+880 2-XXXXXXXX"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseDocument">Upload License Document</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="licenseDocument"
                  name="licenseDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("licenseDocument")?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.licenseDocument ? formData.licenseDocument.name : "Choose File"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hospital Location</Label>
              <LocationPickerMap onLocationChange={handleLocationChange} />
              <p className="text-xs text-muted-foreground">
                Move the map to position the pin at your hospital location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hospital@/srcexample.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Hospital"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link href="/hospital/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
