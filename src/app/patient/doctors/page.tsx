"use client"

import { useState, useEffect } from "react"
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
import { useAuthStore } from "@/src/store/useAuthStore"
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
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import for Leaflet map (client-side only)
const ChamberMapDialog = dynamic(() => import("@/src/components/chamber-map-dialog"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-75 items-center justify-center bg-muted rounded-lg">
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

// Doctor UI type
type DoctorType = {
  id: string | number
  name: string
  specialization: string
  specializationLabel: string
  qualification?: string
  experience?: string
  hospital?: string
  chamberAddress?: string
  chamberLocation?: { lat: number; lng: number }
  chamberTime?: string
  chamberDays?: string
  visitFee?: number
  rating?: number
  totalPatients?: number
  isAvailable?: boolean
  currentSerial?: number
  maxSerial?: number
  image?: string
  verified?: boolean
}

// Local placeholder while loading from API
const doctorsData: DoctorType[] = []

interface BookingFormData {
  patientName: string
  age: string
  mobileNumber: string
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [doctors, setDoctors] = useState<any[]>(doctorsData)
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(true)
  const [doctorsError, setDoctorsError] = useState<string | null>(null)
  const [isUnavailableAlert, setIsUnavailableAlert] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [serialNumber, setSerialNumber] = useState<number | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: "",
    age: "",
    mobileNumber: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<BookingFormData>>({})
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [isBookingSaving, setIsBookingSaving] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [mapDoctor, setMapDoctor] = useState<DoctorType | null>(null)
  const { token, user } = useAuthStore()

  const handleShowMap = (doctor: DoctorType) => {
    setMapDoctor(doctor)
    setIsMapOpen(true)
  }

  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoadingDoctors(true)
      setDoctorsError(null)
      try {
        const params = new URLSearchParams()
        // include all doctors (not only approved) to ensure visibility in the patient list
        params.set("all", "1")
        if (selectedCategory && selectedCategory !== "all") params.set("specialization", selectedCategory)
        const res = await fetch(`/api/doctors?${params.toString()}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || "Failed to load doctors")

        // Map DB doctor shape to UI shape
        const mapped = (json.doctors || []).map((d: any, idx: number) => ({
          id: d._id || idx,
          name: d.fullName || d.name || "",
          specialization: d.specialization || "general",
          specializationLabel: (d.specialization || "General").charAt(0).toUpperCase() + (d.specialization || "General").slice(1),
          qualification: d.qualifications || "",
          experience: d.yearsOfExperience ? `${d.yearsOfExperience} years` : "",
          hospital: d.affiliatedHospital || d.hospital || "",
          chamberAddress: d.address || "",
          chamberLocation: d.location || { lat: 23.8103, lng: 90.4125 },
          chamberTime: d.chamberTime || "",
          chamberDays: d.chamberDays || "",
          visitFee: d.consultationFee || d.consultation_fee || 0,
          rating: d.rating || 4.5,
          totalPatients: d.appointments || 0,
          isAvailable: typeof d.isAppointmentOpen === 'boolean' ? d.isAppointmentOpen : true,
          currentSerial: d.appointments || 0,
          maxSerial: d.maxAppointmentsPerDay || d.maxAppointments || 20,
          image: d.avatar || "/doctors/doctor-man.png",
          verified: d.status === "approved",
        }))

        setDoctors(mapped)
      } catch (err: any) {
        setDoctorsError(err?.message || "Failed to load doctors")
      } finally {
        setIsLoadingDoctors(false)
      }
    }

    loadDoctors()
  }, [selectedCategory])

  // Filter doctors based on search and category
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specializationLabel.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doctor.specialization === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBookAppointment = (doctor: DoctorType) => {
    setSelectedDoctor(doctor)
    if (!doctor.isAvailable) {
      setIsUnavailableAlert(true)
    } else {
      setIsBookingOpen(true)
      setBookingError(null)
      setFormErrors({})
      setFormData({
        patientName: user?.name || "",
        age: "",
        mobileNumber: "",
      })
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

  const handleSubmitBooking = async () => {
    if (!validateForm() || !selectedDoctor) return
    if (!selectedDate) {
      setBookingError("Please select a date before booking")
      return
    }
    if (!token) {
      setBookingError("You must be logged in to book an appointment")
      return
    }

    setIsBookingSaving(true)
    setBookingError(null)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentDate: selectedDate.toISOString(),
          timeSlot: selectedDoctor.chamberTime || "TBD",
          visitType: "new",
          consultationMode: "in_person",
          reasonForVisit: `Appointment booking for ${selectedDoctor.specializationLabel}`,
          fee: selectedDoctor.visitFee || 0,
          patientName: formData.patientName,
          mobileNumber: formData.mobileNumber,
          patientNote: `Patient age: ${formData.age}`,
        }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message || "Failed to book appointment")
      }

      setSerialNumber(json.appointment.serialNumber)
      setIsBookingOpen(false)
      setIsSuccessOpen(true)
      setSelectedDoctor((prev) =>
        prev ? { ...prev, currentSerial: (prev.currentSerial ?? 0) + 1 } : prev
      )
    } catch (error: any) {
      setBookingError(error?.message || "Unable to book appointment")
    } finally {
      setIsBookingSaving(false)
    }
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
                "w-full sm:w-60 justify-start text-left font-normal",
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
          <SelectTrigger className="w-full sm:w-55">
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

      {isLoadingDoctors && (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading doctors…</div>
      )}
      {doctorsError && (
        <div className="py-4 rounded border border-destructive/20 bg-destructive/5 text-sm text-destructive">{doctorsError}</div>
      )}

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex gap-4">
                {/* Doctor Image */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
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
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{doctor.hospital}</p>
                </div>
              </div>

              {/* Chamber Address */}
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
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
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm text-foreground">{doctor.chamberTime}</p>
                  <p className="text-xs text-muted-foreground">{doctor.chamberDays}</p>
                </div>
              </div>

              {/* Visit Fee */}
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 shrink-0 text-muted-foreground" />
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
        <DialogContent className="sm:max-w-106.25">
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
                    src={selectedDoctor.image ?? "/doctors/doctor-man.png"}
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

          {bookingError && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {bookingError}
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
            <Button onClick={handleSubmitBooking} disabled={isBookingSaving}>
              {isBookingSaving ? "Booking..." : "Confirm Booking"}
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
        <DialogContent className="sm:max-w-100 text-center">
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
          doctor={mapDoctor as any}
        />
      )}
    </div>
  )
}
