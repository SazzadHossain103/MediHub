"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Skeleton } from "@/src/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { HospitalList, sampleHospitals, type Hospital } from "@/src/components/hospital-map"
import {
  Search,
  Filter,
  MapPin,
  List,
  Bed,
  Users,
  Phone,
  Calendar,
  ExternalLink,
  Clock,
  Shield,
} from "lucide-react"

// Dynamic import for the map to avoid SSR issues with Leaflet
const HospitalMap = dynamic(
  () => import("@/src/components/hospital-map").then((mod) => mod.HospitalMap),
  {
    ssr: false,
    loading: () => (
      <Card className="h-[500px] w-full">
        <Skeleton className="h-full w-full" />
      </Card>
    ),
  }
)

export default function HospitalsPage() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [view, setView] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user's location on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Default to Dhaka center if location denied
          setUserLocation({ lat: 23.7808, lng: 90.4094 })
        }
      )
    }
  }, [])

  const handleGetDirections = () => {
    if (!selectedHospital || !userLocation) {
      alert("Location or hospital information not available")
      return
    }

    // Create Google Maps directions URL
    const mapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedHospital.lat},${selectedHospital.lng}`
    window.open(mapsUrl, "_blank")
  }

  const filteredHospitals = sampleHospitals
    .filter(
      (h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance)
      }
      if (sortBy === "beds") {
        return b.availableBeds - a.availableBeds
      }
      if (sortBy === "queue") {
        return a.emergencyQueue - b.emergencyQueue
      }
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Nearby Hospitals</h1>
          <p className="text-muted-foreground">
            Find hospitals, check bed availability, and view emergency queue status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-secondary">
            <Shield className="h-3 w-3" />
            Real-time Data
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Updated 2 min ago
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hospitals or specialties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="beds">Available Beds</SelectItem>
                  <SelectItem value="queue">Shortest Queue</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border border-border">
                <Button
                  variant={view === "map" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setView("map")}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map / List View */}
        <div className="lg:col-span-2">
          {view === "map" ? (
            <HospitalMap
              onSelectHospital={setSelectedHospital}
              selectedHospitalId={selectedHospital?.id}
            />
          ) : (
            <Card className="h-[500px]">
              <ScrollArea className="h-full p-4">
                <HospitalList
                  hospitals={filteredHospitals}
                  selectedId={selectedHospital?.id}
                  onSelect={setSelectedHospital}
                />
              </ScrollArea>
            </Card>
          )}
        </div>

        {/* Hospital Details Sidebar */}
        <div>
          {selectedHospital ? (
            <Card className="sticky top-20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedHospital.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedHospital.distance} away
                    </CardDescription>
                  </div>
                  {selectedHospital.isOpen24Hours && (
                    <Badge className="bg-secondary text-secondary-foreground">24/7 Open</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Bed className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-secondary">
                        {selectedHospital.availableBeds}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Beds Available</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users
                        className={`h-5 w-5 ${
                          selectedHospital.emergencyQueue > 15
                            ? "text-red-500"
                            : selectedHospital.emergencyQueue > 8
                            ? "text-amber-500"
                            : "text-green-500"
                        }`}
                      />
                      <span className="text-2xl font-bold">{selectedHospital.emergencyQueue}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">ED Queue</p>
                  </div>
                </div>

                {/* Wait Time */}
                {/* <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-chart-3" />
                      <span className="font-medium">Estimated Wait</span>
                    </div>
                    <span className="text-xl font-bold">{selectedHospital.waitTime}</span>
                  </div>
                </div> */}

                {/* Contact */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Contact</h4>
                  <p className="text-sm">{selectedHospital.address}</p>
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="mt-2 flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedHospital.phone}
                  </a>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((spec) => (
                      <Badge key={spec} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {/* <Button className="w-full" asChild>
                    <a href={`/dashboard/appointments?hospital=${selectedHospital.id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </a>
                  </Button> */}
                  <Button variant="outline" className="w-full" onClick={handleGetDirections}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex h-[400px] flex-col items-center justify-center text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">Select a Hospital</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Click on a hospital marker on the map or select from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Hospital List (Mobile) */}
      {view === "map" && (
        <div className="lg:hidden">
          <h2 className="mb-4 text-lg font-semibold">All Hospitals</h2>
          <HospitalList
            hospitals={filteredHospitals}
            selectedId={selectedHospital?.id}
            onSelect={setSelectedHospital}
          />
        </div>
      )}
    </div>
  )
}
