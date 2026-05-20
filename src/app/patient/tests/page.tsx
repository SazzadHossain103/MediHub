"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog"
import { cn } from "@/src/lib/utils"
import { format } from "date-fns"
import {
  Search,
  TestTube,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Shield,
  Zap,
  Heart,
  Droplet,
  Activity,
  Microscope,
  Scan,
  Pill,
  ArrowRight,
} from "lucide-react"

const testCategories = [
  { id: "blood", name: "Blood Tests", icon: Droplet, count: 24 },
  { id: "imaging", name: "Imaging & Scans", icon: Scan, count: 12 },
  { id: "cardiac", name: "Cardiac Tests", icon: Heart, count: 8 },
  { id: "pathology", name: "Pathology", icon: Microscope, count: 15 },
  { id: "hormone", name: "Hormone Tests", icon: Activity, count: 10 },
  { id: "allergy", name: "Allergy Tests", icon: AlertCircle, count: 6 },
]

const popularTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Blood Tests",
    price: 500,
    duration: "4-6 hours",
    description: "Measures different components of blood including red cells, white cells, and platelets.",
    preparation: "No special preparation required. Fasting not necessary.",
    sampleType: "Blood",
    hospital: "Square Hospital Diagnostics",
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Blood Tests",
    price: 800,
    duration: "6-8 hours",
    description: "Measures cholesterol levels including HDL, LDL, and triglycerides.",
    preparation: "Fasting for 9-12 hours required before the test.",
    sampleType: "Blood",
    hospital: "Labaid Diagnostics",
  },
  {
    id: 3,
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Blood Tests",
    price: 700,
    duration: "Same day",
    description: "Measures average blood sugar levels over the past 2-3 months.",
    preparation: "No fasting required.",
    sampleType: "Blood",
    hospital: "Popular Diagnostics",
  },
  {
    id: 4,
    name: "Thyroid Function Test (TFT)",
    category: "Hormone Tests",
    price: 1200,
    duration: "Same day",
    description: "Measures TSH, T3, and T4 to assess thyroid function.",
    preparation: "No special preparation required.",
    sampleType: "Blood",
    hospital: "Square Hospital Diagnostics",
  },
  {
    id: 5,
    name: "Chest X-Ray",
    category: "Imaging & Scans",
    price: 600,
    duration: "30 minutes",
    description: "X-ray imaging of the chest to examine lungs, heart, and chest wall.",
    preparation: "Remove metal objects. No other preparation needed.",
    sampleType: "Imaging",
    hospital: "Labaid Diagnostics",
  },
  {
    id: 6,
    name: "ECG (Electrocardiogram)",
    category: "Cardiac Tests",
    price: 400,
    duration: "15 minutes",
    description: "Records the electrical activity of the heart.",
    preparation: "Avoid caffeine and exercise before the test.",
    sampleType: "Non-invasive",
    hospital: "Popular Diagnostics",
  },
  {
    id: 7,
    name: "Liver Function Test (LFT)",
    category: "Blood Tests",
    price: 900,
    duration: "6-8 hours",
    description: "Measures enzymes and proteins to assess liver health.",
    preparation: "Fasting for 8-10 hours may be required.",
    sampleType: "Blood",
    hospital: "Square Hospital Diagnostics",
  },
  {
    id: 8,
    name: "Kidney Function Test (KFT)",
    category: "Blood Tests",
    price: 850,
    duration: "6-8 hours",
    description: "Measures creatinine, BUN, and other markers of kidney function.",
    preparation: "Stay hydrated. Fasting may be required.",
    sampleType: "Blood",
    hospital: "Labaid Diagnostics",
  },
]

interface SelectedTest {
  id: number
  name: string
  price: number
  category: string
  duration: string
  preparation: string
  hospital: string
}

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hospitalFilter, setHospitalFilter] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<SelectedTest | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const filteredTests = popularTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesHospital = !hospitalFilter || test.hospital.toLowerCase().includes(hospitalFilter.toLowerCase())
    const matchesCategory = !selectedCategory || test.category.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesHospital && matchesCategory
  })

  const uniqueHospitals = Array.from(new Set(popularTests.map((t) => t.hospital)))

  const handleBookTest = (test: SelectedTest) => {
    setSelectedTest(test)
    setBookingStep(1)
    setSelectedDate(undefined)
    setIsBookingOpen(true)
  }

  const handleConfirmBooking = () => {
    // In a real app, this would submit to an API
    setIsBookingOpen(false)
    setSelectedTest(null)
    // Show success message
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Medical Tests</h1>
          <p className="text-muted-foreground">
            Book diagnostic tests online and receive reports in your profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-secondary">
            <Zap className="h-3 w-3" />
            Quick Booking
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            NABL Certified Labs
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-full bg-primary/10 p-2">
            <TestTube className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">One Visit, Results in Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              Book your test online, visit the lab once for sample collection, and receive your
              digital report directly in your MediHub profile. No more waiting in queues!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Categories */}
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests by name..."
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by hospital name..."
              className="pl-10 py-6 text-base"
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Tests
          </Button>
          {testCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="mr-1 h-4 w-4" />
                {cat.name}
                <Badge variant="secondary" className="ml-2 bg-muted text-xs">
                  {cat.count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTests.map((test) => (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {test.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{test.hospital}</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary whitespace-nowrap">৳{test.price}</span>
              </div>
              <CardTitle className="text-lg">{test.name}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {test.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Droplet className="h-4 w-4" />
                  {test.sampleType}
                </span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Preparation</p>
                <p className="text-sm">{test.preparation}</p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button
                className="w-full"
                onClick={() =>
                  handleBookTest({
                    id: test.id,
                    name: test.name,
                    price: test.price,
                    category: test.category,
                    duration: test.duration,
                    preparation: test.preparation,
                    hospital: test.hospital,
                  })
                }
              >
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book {selectedTest?.name}</DialogTitle>
            <DialogDescription>
              Select your preferred date
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between px-4 py-2">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    bookingStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {bookingStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 2 && (
                  <div
                    className={cn(
                      "mx-2 h-1 w-16 rounded md:w-24",
                      bookingStep > step ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="py-4">
            {/* Step 1: Select Date */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Select Date</h3>
                <div>
                  <Label className="mb-2 block">Choose your preferred date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) =>
                          date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Confirm Your Booking</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test</span>
                      <span className="font-semibold">{selectedTest?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hospital</span>
                      <span>{selectedTest?.hospital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>{selectedDate ? format(selectedDate, "PPP") : "-"}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-xl font-bold text-primary">৳{selectedTest?.price}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="rounded-lg bg-accent/50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-accent-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Preparation Required</p>
                      <p className="text-muted-foreground">{selectedTest?.preparation}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/10 p-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-secondary" />
                    <div className="text-sm">
                      <p className="font-medium text-secondary">Digital Report Delivery</p>
                      <p className="text-muted-foreground">
                        Your test report will be available in your MediHub profile within{" "}
                        {selectedTest?.duration} of sample collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {bookingStep > 1 && (
              <Button variant="outline" onClick={() => setBookingStep(bookingStep - 1)}>
                Back
              </Button>
            )}
            {bookingStep < 2 ? (
              <Button
                onClick={() => setBookingStep(bookingStep + 1)}
                disabled={!selectedDate}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleConfirmBooking}>
                <CreditCard className="mr-2 h-4 w-4" />
                Confirm & Pay
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
