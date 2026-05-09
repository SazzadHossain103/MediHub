"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Checkbox } from "@/src/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Search, Star, HeartPulse } from "lucide-react"

// Service type options for filtering
const serviceTypes = [
  { id: "general-care", label: "General Care" },
  { id: "saline-setup", label: "Saline Setup" },
  { id: "injection-support", label: "Injection Support" },
  { id: "dengue-monitoring", label: "Dengue Monitoring" },
]

// Gender filter options
const genderOptions = [
  { value: "all", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

// Experience filter options
const experienceOptions = [
  { value: "all", label: "All Experience" },
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
]

// Mock nurse data
const nursesData = [
  {
    id: 1,
    name: "Fatima Akter",
    image: "/placeholder.svg?height=200&width=200",
    experience: 6,
    services: ["general-care", "saline-setup", "dengue-monitoring"],
    rating: 4.8,
    available: true,
    gender: "female",
  },
  {
    id: 2,
    name: "Rafiq Hasan",
    image: "/placeholder.svg?height=200&width=200",
    experience: 4,
    services: ["injection-support", "saline-setup"],
    rating: 4.5,
    available: true,
    gender: "male",
  },
  {
    id: 3,
    name: "Salma Khatun",
    image: "/placeholder.svg?height=200&width=200",
    experience: 8,
    services: ["general-care", "dengue-monitoring", "injection-support", "saline-setup"],
    rating: 4.9,
    available: false,
    gender: "female",
  },
  {
    id: 4,
    name: "Kamal Uddin",
    image: "/placeholder.svg?height=200&width=200",
    experience: 2,
    services: ["general-care", "injection-support"],
    rating: 4.3,
    available: true,
    gender: "male",
  },
  {
    id: 5,
    name: "Nasreen Begum",
    image: "/placeholder.svg?height=200&width=200",
    experience: 10,
    services: ["saline-setup", "dengue-monitoring"],
    rating: 4.7,
    available: true,
    gender: "female",
  },
  {
    id: 6,
    name: "Abdul Rahman",
    image: "/placeholder.svg?height=200&width=200",
    experience: 3,
    services: ["general-care", "injection-support", "saline-setup"],
    rating: 4.4,
    available: true,
    gender: "male",
  },
]

// Nurse card props interface
interface NurseCardProps {
  name: string
  image: string
  experience: number
  services: string[]
  rating: number
  available: boolean
  onBookNurse: () => void
}

function NurseCard({
  name,
  image,
  experience,
  services,
  rating,
  available,
  onBookNurse,
}: NurseCardProps) {
  // Get service labels from IDs
  const serviceLabels = services.map((serviceId) => {
    const service = serviceTypes.find((s) => s.id === serviceId)
    return service?.label || serviceId
  })

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          {/* Nurse Image */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          {/* Nurse Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {experience} {experience === 1 ? "year" : "years"} exp
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-foreground">{rating}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Services */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Services</p>
          <div className="flex flex-wrap gap-1.5">
            {serviceLabels.map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability Status */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
          <div
            className={`h-2 w-2 rounded-full ${
              available ? "bg-secondary" : "bg-destructive"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {available ? "Available for booking" : "Currently unavailable"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 pt-4">
        <Button
          className="w-full gap-2"
          onClick={onBookNurse}
          variant={available ? "default" : "secondary"}
          disabled={!available}
        >
          <HeartPulse className="h-4 w-4" />
          Book Nurse
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function NursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Handle service checkbox toggle
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Filter nurses based on all criteria
  const filteredNurses = nursesData.filter((nurse) => {
    // Search filter
    const matchesSearch = nurse.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    // Gender filter
    const matchesGender =
      selectedGender === "all" || nurse.gender === selectedGender

    // Experience filter
    let matchesExperience = true
    if (selectedExperience === "0-2") {
      matchesExperience = nurse.experience <= 2
    } else if (selectedExperience === "3-5") {
      matchesExperience = nurse.experience >= 3 && nurse.experience <= 5
    } else if (selectedExperience === "5+") {
      matchesExperience = nurse.experience > 5
    }

    // Services filter
    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.some((service) => nurse.services.includes(service))

    return matchesSearch && matchesGender && matchesExperience && matchesServices
  })

  // Handle book nurse callback
  const handleBookNurse = (nurseId: number) => {
    const nurse = nursesData.find((n) => n.id === nurseId)
    if (nurse) {
      // Callback prop - no backend, just console log for now
      console.log("Book nurse requested:", nurse.name, "ID:", nurseId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find Nurse</h1>
        <p className="text-muted-foreground">
          Book a qualified nurse for at-home treatment and care
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            {experienceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content: Sidebar + Nurse Cards */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Sidebar - Service Type Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 font-semibold text-foreground">Service Type</h2>
            <div className="space-y-3">
              {serviceTypes.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <Label
                    htmlFor={service.id}
                    className="cursor-pointer text-sm text-foreground"
                  >
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setSelectedServices([])}
              >
                Clear filters
              </Button>
            )}
          </div>
        </aside>

        {/* Right Side - Nurse Cards Grid */}
        <div className="flex-1">
          {/* Results count */}
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {filteredNurses.length} nurse
            {filteredNurses.length !== 1 ? "s" : ""}
          </p>

          {/* Nurses Grid */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredNurses.map((nurse) => (
              <NurseCard
                key={nurse.id}
                name={nurse.name}
                image={nurse.image}
                experience={nurse.experience}
                services={nurse.services}
                rating={nurse.rating}
                available={nurse.available}
                onBookNurse={() => handleBookNurse(nurse.id)}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredNurses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HeartPulse className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground">
                No nurses found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
