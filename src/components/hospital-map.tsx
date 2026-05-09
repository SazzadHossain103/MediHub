"use client"

import { useEffect, useState, useRef } from "react"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Skeleton } from "@/src/components/ui/skeleton"
import { MapPin, Navigation, Loader2, AlertCircle, Users, Bed, Clock, Phone } from "lucide-react"

interface Hospital {
  id: number
  name: string
  lat: number
  lng: number
  distance: string
  address: string
  phone: string
  emergencyQueue: number
  availableBeds: number
  totalBeds: number
  waitTime: string
  rating: number
  specialties: string[]
  isOpen24Hours: boolean
}

// Sample hospitals in Dhaka
const sampleHospitals: Hospital[] = [
  {
    id: 1,
    name: "Square Hospital",
    lat: 23.7525,
    lng: 90.3885,
    distance: "1.2 km",
    address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath",
    phone: "+880 2-8144466",
    emergencyQueue: 12,
    availableBeds: 45,
    totalBeds: 200,
    waitTime: "~25 min",
    rating: 4.8,
    specialties: ["Cardiology", "Neurology", "Oncology"],
    isOpen24Hours: true,
  },
  {
    id: 2,
    name: "United Hospital",
    lat: 23.7935,
    lng: 90.4145,
    distance: "2.5 km",
    address: "Plot 15, Road 71, Gulshan-2",
    phone: "+880 2-8836000",
    emergencyQueue: 8,
    availableBeds: 32,
    totalBeds: 150,
    waitTime: "~15 min",
    rating: 4.7,
    specialties: ["Orthopedics", "Pediatrics", "Gynecology"],
    isOpen24Hours: true,
  },
  {
    id: 3,
    name: "Labaid Hospital",
    lat: 23.7515,
    lng: 90.3925,
    distance: "0.8 km",
    address: "House 1, Road 4, Dhanmondi",
    phone: "+880 2-9666710",
    emergencyQueue: 18,
    availableBeds: 15,
    totalBeds: 100,
    waitTime: "~40 min",
    rating: 4.5,
    specialties: ["General Medicine", "Diagnostics", "Surgery"],
    isOpen24Hours: true,
  },
  {
    id: 4,
    name: "Apollo Hospital",
    lat: 23.8103,
    lng: 90.4125,
    distance: "3.1 km",
    address: "Plot 81, Block E, Bashundhara R/A",
    phone: "+880 2-8401661",
    emergencyQueue: 5,
    availableBeds: 58,
    totalBeds: 180,
    waitTime: "~10 min",
    rating: 4.9,
    specialties: ["Cardiac Surgery", "Transplant", "Oncology"],
    isOpen24Hours: true,
  },
  {
    id: 5,
    name: "Evercare Hospital",
    lat: 23.8145,
    lng: 90.4235,
    distance: "3.8 km",
    address: "Plot 81, Block E, Bashundhara",
    phone: "+880 2-8432345",
    emergencyQueue: 6,
    availableBeds: 72,
    totalBeds: 250,
    waitTime: "~12 min",
    rating: 4.8,
    specialties: ["Multi-specialty", "Emergency", "ICU"],
    isOpen24Hours: true,
  },
]

interface HospitalMapProps {
  onSelectHospital?: (hospital: Hospital) => void
  selectedHospitalId?: number
}

export function HospitalMap({ onSelectHospital, selectedHospitalId }: HospitalMapProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setHospitals(sampleHospitals)
          setIsLoading(false)
        },
        (error) => {
          console.log("[v0] Geolocation error:", error.message)
          // Default to Dhaka center if location denied
          setLocation({ lat: 23.7808, lng: 90.4094 })
          setHospitals(sampleHospitals)
          setLocationError("Location access denied. Showing Dhaka city center.")
          setIsLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      setLocation({ lat: 23.7808, lng: 90.4094 })
      setHospitals(sampleHospitals)
      setLocationError("Geolocation not supported. Showing Dhaka city center.")
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!location || !mapContainerRef.current) return

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([location.lat, location.lng], 13)
    mapRef.current = map

    // Add tile layer with a clean, medical-friendly style
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    // Custom icons
    const userIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const hospitalIcon = (isSelected: boolean, queueSize: number) => {
      const bgColor = queueSize > 15 ? "#ef4444" : queueSize > 8 ? "#f59e0b" : "#22c55e"
      const borderColor = isSelected ? "#2563eb" : "white"
      const borderWidth = isSelected ? "3" : "2"
      
      return L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 rounded-full border-${borderWidth} shadow-lg" style="background-color: ${bgColor}; border-color: ${borderColor}; border-width: ${borderWidth}px;">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18M9 8h6M12 8v6M9 14h6M6 21V4a2 2 0 012-2h8a2 2 0 012 2v17"/>
          </svg>
        </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })
    }

    // Add user marker
    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>")

    // Add hospital markers
    markersRef.current = hospitals.map((hospital) => {
      const marker = L.marker([hospital.lat, hospital.lng], {
        icon: hospitalIcon(hospital.id === selectedHospitalId, hospital.emergencyQueue),
      })
        .addTo(map)
        .bindPopup(
          `<div class="p-2">
            <h3 class="font-bold text-sm">${hospital.name}</h3>
            <p class="text-xs text-gray-600">${hospital.address}</p>
            <div class="mt-2 flex gap-2">
              <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">${hospital.availableBeds} beds</span>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${hospital.waitTime}</span>
            </div>
          </div>`
        )

      marker.on("click", () => {
        if (onSelectHospital) {
          onSelectHospital(hospital)
        }
      })

      return marker
    })

    // Fit bounds to show all markers
    const bounds = L.latLngBounds([
      [location.lat, location.lng],
      ...hospitals.map((h) => [h.lat, h.lng] as [number, number]),
    ])
    map.fitBounds(bounds, { padding: [50, 50] })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [location, hospitals, selectedHospitalId, onSelectHospital])

  const handleCenterOnUser = () => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.lat, location.lng], 14)
    }
  }

  if (isLoading) {
    return (
      <Card className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Getting your location...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative h-[500px] w-full overflow-hidden">
      {locationError && (
        <div className="absolute left-4 right-4 top-4 z-[1000] rounded-lg bg-amber-50 p-3 shadow-md">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{locationError}</span>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full" />
      <Button
        size="icon"
        className="absolute bottom-4 right-4 z-[1000] shadow-lg"
        onClick={handleCenterOnUser}
      >
        <Navigation className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur">
        <p className="mb-2 text-xs font-semibold text-foreground">Queue Status</p>
        <div className="flex gap-2">
          <Badge className="bg-green-500 text-white">Low {"<"}8</Badge>
          <Badge className="bg-amber-500 text-white">Medium 8-15</Badge>
          <Badge className="bg-red-500 text-white">High {">"}15</Badge>
        </div>
      </div>
    </Card>
  )
}

export function HospitalList({
  hospitals = sampleHospitals,
  selectedId,
  onSelect,
}: {
  hospitals?: Hospital[]
  selectedId?: number
  onSelect?: (hospital: Hospital) => void
}) {
  return (
    <div className="space-y-3">
      {hospitals.map((hospital) => (
        <Card
          key={hospital.id}
          className={`cursor-pointer p-4 transition-all hover:shadow-md ${
            selectedId === hospital.id ? "border-primary ring-2 ring-primary/20" : ""
          }`}
          onClick={() => onSelect?.(hospital)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{hospital.name}</h3>
                {hospital.isOpen24Hours && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                    24/7
                  </Badge>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {hospital.address}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {hospital.phone}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {hospital.specialties.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="ml-4 text-right">
              <Badge variant="outline" className="mb-2">
                {hospital.distance}
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Users
                  className={`h-4 w-4 ${
                    hospital.emergencyQueue > 15
                      ? "text-red-500"
                      : hospital.emergencyQueue > 8
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                />
                <span className="text-lg font-bold">{hospital.emergencyQueue}</span>
              </div>
              <p className="text-xs text-muted-foreground">In Queue</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Bed className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-secondary">{hospital.availableBeds}</span>
                <span className="text-sm text-muted-foreground">/{hospital.totalBeds}</span>
              </div>
              <p className="text-xs text-muted-foreground">Beds Available</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-4 w-4 text-chart-3" />
                <span className="text-lg font-bold">{hospital.waitTime}</span>
              </div>
              <p className="text-xs text-muted-foreground">Wait Time</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export { sampleHospitals }
export type { Hospital }
