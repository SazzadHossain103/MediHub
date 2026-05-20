"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Calendar as CalendarComponent } from "@/src/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/src/lib/utils"
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  Stethoscope,
  Phone,
  BadgeCheck,
  Calendar,
  CalendarIcon,
  User,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Map,
  Navigation,
  ExternalLink
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import for Leaflet map (client-side only)
const ChamberMapDialog = dynamic(() => import("@/src/components/chamber-map-dialog"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center bg-muted rounded-lg">
      <div className="animate-pulse text-muted-foreground">Loading map...</div>
    </div>
  )
})

// Doctor categories
const categories = [
  { value: "all", label: "All Specializations" },
  { value: "cardiologist", label: "Cardiologist" },
  { value: "neurologist", label: "Neurologist" },
  { value: "orthopedic", label: "Orthopedic Surgeon" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "gynecologist", label: "Gynecologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "ophthalmologist", label: "Ophthalmologist" },
  { value: "ent", label: "ENT Specialist" },
  { value: "general", label: "General Physician" },
]

// Mock doctor data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Md. Rafiqul Islam",
    specialization: "cardiologist",
    specializationLabel: "Cardiologist",
    qualification: "MBBS, MD (Cardiology), FCPS",
    experience: "18 years",
    hospital: "Square Hospital",
    chamberAddress: "House 42, Road 5, Dhanmondi, Dhaka",
    chamberLocation: { lat: 23.7461, lng: 90.3742 },
    chamberTime: "6:00 PM - 10:00 PM",
    chamberDays: "Sat, Mon, Wed",
    visitFee: 1500,
    rating: 4.8,
    totalPatients: 2500,
    isAvailable: true,
    currentSerial: 15,
    maxSerial: 25,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Fatima Begum",
    specialization: "gynecologist",
    specializationLabel: "Gynecologist & Obstetrician",
    qualification: "MBBS, FCPS (Gynae & Obs)",
    experience: "15 years",
    hospital: "Labaid Hospital",
    chamberAddress: "Green Road, Farmgate, Dhaka",
    chamberLocation: { lat: 23.7565, lng: 90.3889 },
    chamberTime: "5:00 PM - 9:00 PM",
    chamberDays: "Sun, Tue, Thu",
    visitFee: 1200,
    rating: 4.9,
    totalPatients: 3200,
    isAvailable: true,
    currentSerial: 8,
    maxSerial: 20,
    image: "/doctors/doctor-woman.png",
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Ahmed Hossain",
    specialization: "neurologist",
    specializationLabel: "Neurologist",
    qualification: "MBBS, MD (Neurology)",
    experience: "12 years",
    hospital: "United Hospital",
    chamberAddress: "Gulshan-2, Dhaka",
    chamberLocation: { lat: 23.7925, lng: 90.4078 },
    chamberTime: "7:00 PM - 11:00 PM",
    chamberDays: "Sat, Mon, Wed, Fri",
    visitFee: 2000,
    rating: 4.7,
    totalPatients: 1800,
    isAvailable: false,
    currentSerial: 20,
    maxSerial: 20,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. Kamal Uddin",
    specialization: "orthopedic",
    specializationLabel: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Ortho), FACS",
    experience: "20 years",
    hospital: "Apollo Hospital",
    chamberAddress: "Bashundhara R/A, Dhaka",
    chamberLocation: { lat: 23.8103, lng: 90.4125 },
    chamberTime: "4:00 PM - 8:00 PM",
    chamberDays: "Sun, Tue, Thu, Sat",
    visitFee: 1800,
    rating: 4.6,
    totalPatients: 4100,
    isAvailable: true,
    currentSerial: 12,
    maxSerial: 30,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 5,
    name: "Dr. Nasreen Sultana",
    specialization: "dermatologist",
    specializationLabel: "Dermatologist",
    qualification: "MBBS, DDV, MD (Dermatology)",
    experience: "10 years",
    hospital: "Popular Diagnostic Centre",
    chamberAddress: "Shantinagar, Dhaka",
    chamberLocation: { lat: 23.7392, lng: 90.4125 },
    chamberTime: "3:00 PM - 7:00 PM",
    chamberDays: "Sat, Mon, Wed",
    visitFee: 1000,
    rating: 4.5,
    totalPatients: 2100,
    isAvailable: true,
    currentSerial: 5,
    maxSerial: 15,
    image: "/doctors/doctor-woman.png",
    verified: false,
  },
  {
    id: 6,
    name: "Dr. Shahidul Alam",
    specialization: "pediatrician",
    specializationLabel: "Pediatrician",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: "14 years",
    hospital: "Dhaka Shishu Hospital",
    chamberAddress: "Mirpur-10, Dhaka",
    chamberLocation: { lat: 23.8069, lng: 90.3687 },
    chamberTime: "5:00 PM - 9:00 PM",
    chamberDays: "Sun, Tue, Thu, Sat",
    visitFee: 800,
    rating: 4.9,
    totalPatients: 5500,
    isAvailable: true,
    currentSerial: 18,
    maxSerial: 35,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 7,
    name: "Dr. Rezaul Karim",
    specialization: "psychiatrist",
    specializationLabel: "Psychiatrist",
    qualification: "MBBS, FCPS (Psychiatry)",
    experience: "16 years",
    hospital: "National Mental Health Institute",
    chamberAddress: "Mohammadpur, Dhaka",
    chamberLocation: { lat: 23.7662, lng: 90.3589 },
    chamberTime: "6:00 PM - 9:00 PM",
    chamberDays: "Mon, Wed, Fri",
    visitFee: 1500,
    rating: 4.8,
    totalPatients: 1200,
    isAvailable: false,
    currentSerial: 10,
    maxSerial: 10,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 8,
    name: "Dr. Tahmina Akter",
    specialization: "ophthalmologist",
    specializationLabel: "Ophthalmologist",
    qualification: "MBBS, DO, MS (Ophthalmology)",
    experience: "11 years",
    hospital: "Ispahani Islamia Eye Institute",
    chamberAddress: "Farmgate, Dhaka",
    chamberLocation: { lat: 23.7578, lng: 90.3920 },
    chamberTime: "4:00 PM - 8:00 PM",
    chamberDays: "Sat, Sun, Tue, Thu",
    visitFee: 1000,
    rating: 4.7,
    totalPatients: 2800,
    isAvailable: true,
    currentSerial: 7,
    maxSerial: 20,
    image: "/doctors/doctor-woman.png",
    verified: true,
  },
  {
    id: 9,
    name: "Dr. Imran Hossain",
    specialization: "ent",
    specializationLabel: "ENT Specialist",
    qualification: "MBBS, DLO, MS (ENT)",
    experience: "13 years",
    hospital: "Ibn Sina Hospital",
    chamberAddress: "Kalabagan, Dhaka",
    chamberLocation: { lat: 23.7509, lng: 90.3765 },
    chamberTime: "7:00 PM - 10:00 PM",
    chamberDays: "Sun, Mon, Wed, Fri",
    visitFee: 1200,
    rating: 4.6,
    totalPatients: 1900,
    isAvailable: true,
    currentSerial: 10,
    maxSerial: 18,
    image: "/doctors/doctor-man.png",
    verified: true,
  },
  {
    id: 10,
    name: "Dr. Salma Khatun",
    specialization: "general",
    specializationLabel: "General Physician",
    qualification: "MBBS, BCS (Health)",
    experience: "8 years",
    hospital: "Dhaka Medical College Hospital",
    chamberAddress: "New Market, Dhaka",
    chamberLocation: { lat: 23.7339, lng: 90.3845 },
    chamberTime: "5:00 PM - 9:00 PM",
    chamberDays: "Daily except Friday",
    visitFee: 500,
    rating: 4.4,
    totalPatients: 6200,
    isAvailable: true,
    currentSerial: 22,
    maxSerial: 40,
    image: "/doctors/doctor-woman.png",
    verified: false,
  },
]

interface BookingFormData {
  patientName: string
  age: string
  mobileNumber: string
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsData[0] | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isUnavailableAlert, setIsUnavailableAlert] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [serialNumber, setSerialNumber] = useState<number | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: "",
    age: "",
    mobileNumber: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<BookingFormData>>({})
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [mapDoctor, setMapDoctor] = useState<typeof doctorsData[0] | null>(null)

  const handleShowMap = (doctor: typeof doctorsData[0]) => {
    setMapDoctor(doctor)
    setIsMapOpen(true)
  }

  // Filter doctors based on search and category
  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specializationLabel.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doctor.specialization === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBookAppointment = (doctor: typeof doctorsData[0]) => {
    setSelectedDoctor(doctor)
    if (!doctor.isAvailable) {
      setIsUnavailableAlert(true)
    } else {
      setIsBookingOpen(true)
      setFormData({ patientName: "", age: "", mobileNumber: "" })
      setFormErrors({})
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<BookingFormData> = {}
    
    if (!formData.patientName.trim()) {
      errors.patientName = "Patient name is required"
    }
    
    if (!formData.age.trim()) {
      errors.age = "Age is required"
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 150) {
      errors.age = "Please enter a valid age"
    }
    
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required"
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Please enter a valid Bangladesh mobile number"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitBooking = () => {
    if (!validateForm() || !selectedDoctor) return

    // Generate serial number (next in queue)
    const newSerial = selectedDoctor.currentSerial + 1
    setSerialNumber(newSerial)
    setIsBookingOpen(false)
    setIsSuccessOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find Doctors</h1>
        <p className="text-muted-foreground">
          Browse and book appointments with verified doctors in Dhaka
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, hospital, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <Stethoscope className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
      </p>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex gap-4">
                {/* Doctor Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Doctor Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    {doctor.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-primary font-medium">{doctor.specializationLabel}</p>
                  <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="secondary" className="text-xs">
                      {doctor.experience} exp
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {doctor.rating} Rating
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              {/* Hospital */}
              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{doctor.hospital}</p>
                </div>
              </div>

              {/* Chamber Address */}
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-muted-foreground">{doctor.chamberAddress}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 shrink-0 gap-1 px-2 text-xs text-primary hover:text-primary"
                      onClick={() => handleShowMap(doctor)}
                    >
                      <Map className="h-3 w-3" />
                      Map
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chamber Time */}
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm text-foreground">{doctor.chamberTime}</p>
                  <p className="text-xs text-muted-foreground">{doctor.chamberDays}</p>
                </div>
              </div>

              {/* Visit Fee */}
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <p className="text-sm font-semibold text-secondary">
                  ৳{doctor.visitFee.toLocaleString()} <span className="font-normal text-muted-foreground">visit fee</span>
                </p>
              </div>

              {/* Availability Status */}
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${doctor.isAvailable ? "bg-secondary" : "bg-destructive"}`} />
                  <span className="text-xs text-muted-foreground">
                    {doctor.isAvailable ? "Accepting appointments" : "Not accepting appointments"}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground">
                  {doctor.currentSerial}/{doctor.maxSerial} slots
                </span>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 pt-4">
              <Button 
                className={`w-full gap-2 ${!doctor.isAvailable ? "bg-gray-400 text-white hover:bg-gray-400 cursor-not-allowed" : ""}`}
                onClick={() => doctor.isAvailable && handleBookAppointment(doctor)}
                variant={doctor.isAvailable ? "default" : "secondary"}
                disabled={!doctor.isAvailable}
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Stethoscope className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground">No doctors found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedDoctor && (
                <span>
                  Fill in your details to book an appointment with <strong>{selectedDoctor.name}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="mb-4 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedDoctor.name}</p>
                  <p className="text-sm text-primary">{selectedDoctor.specializationLabel}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedDoctor.chamberTime}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Banknote className="h-3.5 w-3.5" />
                  ৳{selectedDoctor.visitFee}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">
                <User className="mr-1.5 inline h-3.5 w-3.5" />
                Patient Name
              </Label>
              <Input
                id="patientName"
                placeholder="Enter patient full name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className={formErrors.patientName ? "border-destructive" : ""}
              />
              {formErrors.patientName && (
                <p className="text-xs text-destructive">{formErrors.patientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">
                <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={formErrors.age ? "border-destructive" : ""}
              />
              {formErrors.age && (
                <p className="text-xs text-destructive">{formErrors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">
                <Phone className="mr-1.5 inline h-3.5 w-3.5" />
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                placeholder="01XXXXXXXXX"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className={formErrors.mobileNumber ? "border-destructive" : ""}
              />
              {formErrors.mobileNumber && (
                <p className="text-xs text-destructive">{formErrors.mobileNumber}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unavailable Alert */}
      <AlertDialog open={isUnavailableAlert} onOpenChange={setIsUnavailableAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Appointments Not Available
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDoctor && (
                <>
                  <strong>{selectedDoctor.name}</strong> has temporarily disabled further appointments. 
                  The doctor has reached the maximum number of patients ({selectedDoctor.maxSerial}) for today.
                  <br /><br />
                  Please try again tomorrow or choose another doctor.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsUnavailableAlert(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
            <DialogTitle className="mb-2 text-xl">Booking Confirmed!</DialogTitle>
            <DialogDescription className="mb-4">
              Your appointment has been successfully booked.
            </DialogDescription>

            {selectedDoctor && serialNumber && (
              <div className="w-full space-y-4 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your Serial Number</p>
                  <p className="text-4xl font-bold text-primary">{serialNumber}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor</span>
                    <span className="font-medium text-foreground">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chamber</span>
                    <span className="font-medium text-foreground">{selectedDoctor.chamberTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-medium text-foreground">{selectedDoctor.chamberDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium text-secondary">৳{selectedDoctor.visitFee}</span>
                  </div>
                </div>
                <div className="rounded-md bg-accent/50 p-2 text-center text-xs text-accent-foreground">
                  Please arrive 15 minutes before your expected time
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setIsSuccessOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chamber Map Dialog */}
      {mapDoctor && (
        <ChamberMapDialog
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          doctor={mapDoctor}
        />
      )}
    </div>
  )
}
