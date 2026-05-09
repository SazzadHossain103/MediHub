"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { MapPin, Navigation, Phone, Clock, Bed, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

interface Hospital {
  id: number
  name: string
  address: string
  distance: string
  phone: string
  availableBeds: number
  emergencyWaitTime: string
  specialties: string[]
  isOpen24Hours: boolean
}

// Sample hospital data - in a real app this would come from an API based on user location
const sampleHospitals: Hospital[] = [
  {
    id: 1,
    name: "Dhaka Medical College Hospital",
    address: "Secretariat Rd, Dhaka 1000",
    distance: "2.3 km",
    phone: "+880 2-55165088",
    availableBeds: 45,
    emergencyWaitTime: "15 min",
    specialties: ["Emergency", "Cardiology", "Neurology"],
    isOpen24Hours: true,
  },
  {
    id: 2,
    name: "Square Hospital",
    address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak",
    distance: "3.1 km",
    phone: "+880 2-8159457",
    availableBeds: 23,
    emergencyWaitTime: "10 min",
    specialties: ["Emergency", "Oncology", "Orthopedics"],
    isOpen24Hours: true,
  },
  {
    id: 3,
    name: "United Hospital",
    address: "Plot 15, Road 71, Gulshan-2",
    distance: "4.5 km",
    phone: "+880 2-8836000",
    availableBeds: 67,
    emergencyWaitTime: "8 min",
    specialties: ["Emergency", "Pediatrics", "Surgery"],
    isOpen24Hours: true,
  },
  {
    id: 4,
    name: "Labaid Hospital",
    address: "House 1, Road 4, Dhanmondi",
    distance: "5.2 km",
    phone: "+880 2-9611491",
    availableBeds: 12,
    emergencyWaitTime: "20 min",
    specialties: ["Emergency", "Gastroenterology", "Nephrology"],
    isOpen24Hours: true,
  },
]

type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "error"

export function NearbyHospitals() {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle")
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const requestLocation = () => {
    setLocationStatus("requesting")

    if (!navigator.geolocation) {
      setLocationStatus("error")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationStatus("granted")
        // In a real app, we would fetch hospitals based on the user's location
        setHospitals(sampleHospitals)
      },
      (error) => {
        console.error("Location error:", error)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied")
        } else {
          setLocationStatus("error")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }

  return (
    <section id="hospitals" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Find Hospitals Near You
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Nearby Hospitals & Emergency Services
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Allow location access to find hospitals near you with real-time bed availability, emergency wait times, and instant booking.
          </p>
        </div>

        {/* Location Permission Request */}
        {locationStatus === "idle" && (
          <div className="mx-auto mt-10 max-w-md">
            <Card className="border-primary/20 bg-card shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">Enable Location Access</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We need your location to show nearby hospitals and emergency services. Your location data is encrypted and never shared.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button onClick={requestLocation} size="lg" className="w-full gap-2">
                  <Navigation className="h-4 w-4" />
                  Share My Location
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Your data is protected with 256-bit encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {locationStatus === "requesting" && (
          <div className="mx-auto mt-10 max-w-md">
            <Card className="border-primary/20 bg-card shadow-lg">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  Getting your location and finding nearby hospitals...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Permission Denied */}
        {locationStatus === "denied" && (
          <div className="mx-auto mt-10 max-w-md">
            <Card className="border-destructive/20 bg-card shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-foreground">Location Access Denied</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please enable location access in your browser settings to find nearby hospitals.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={requestLocation} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hospital List */}
        {locationStatus === "granted" && hospitals.length > 0 && (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {hospitals.length} hospitals near your location
              </p>
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                Location Active
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="overflow-hidden border-border/50 bg-card shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg text-foreground">{hospital.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {hospital.address}
                        </CardDescription>
                      </div>
                      <Badge className="shrink-0 bg-secondary text-secondary-foreground">
                        {hospital.distance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{hospital.availableBeds} beds</p>
                          <p className="text-xs text-muted-foreground">Available</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{hospital.emergencyWaitTime}</p>
                          <p className="text-xs text-muted-foreground">Wait time</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {hospital.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {hospital.phone}
                      </div>
                      {hospital.isOpen24Hours && (
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                          24/7 Open
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1" size="sm">
                        Book Bed
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
