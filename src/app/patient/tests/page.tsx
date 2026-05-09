"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
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
  },
]

const diagnosticCenters = [
  {
    id: 1,
    name: "Square Hospital Diagnostics",
    address: "18/F Bir Uttam Qazi Nuruzzaman Sarak",
    distance: "1.2 km",
    rating: 4.8,
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
  },
  {
    id: 2,
    name: "Labaid Diagnostics",
    address: "House 1, Road 4, Dhanmondi",
    distance: "0.8 km",
    rating: 4.6,
    availableSlots: ["08:00 AM", "11:00 AM", "01:00 PM", "03:30 PM"],
  },
  {
    id: 3,
    name: "Popular Diagnostics",
    address: "House 16, Road 2, Dhanmondi",
    distance: "1.5 km",
    rating: 4.5,
    availableSlots: ["09:30 AM", "12:00 PM", "02:30 PM", "05:00 PM"],
  },
]

interface SelectedTest {
  id: number
  name: string
  price: number
  category: string
  duration: string
  preparation: string
}

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTest, setSelectedTest] = useState<SelectedTest | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const filteredTests = popularTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || test.category.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleBookTest = (test: SelectedTest) => {
    setSelectedTest(test)
    setBookingStep(1)
    setSelectedCenter(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests by name or category..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="mb-2">
                  {test.category}
                </Badge>
                <span className="text-lg font-bold text-primary">৳{test.price}</span>
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
              Complete the booking in 3 simple steps
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between px-4 py-2">
            {[1, 2, 3].map((step) => (
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
                {step < 3 && (
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
            {/* Step 1: Select Center */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Select Diagnostic Center</h3>
                <RadioGroup value={selectedCenter || ""} onValueChange={setSelectedCenter}>
                  {diagnosticCenters.map((center) => (
                    <div
                      key={center.id}
                      className={cn(
                        "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                        selectedCenter === center.id.toString()
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedCenter(center.id.toString())}
                    >
                      <RadioGroupItem value={center.id.toString()} id={`center-${center.id}`} />
                      <div className="flex-1">
                        <Label htmlFor={`center-${center.id}`} className="font-semibold cursor-pointer">
                          {center.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{center.address}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {center.distance}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            ⭐ {center.rating}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Select Date & Time</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block">Select Date</Label>
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
                  <div>
                    <Label className="mb-2 block">Select Time Slot</Label>
                    <Select value={selectedTime || ""} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {diagnosticCenters
                          .find((c) => c.id.toString() === selectedCenter)
                          ?.availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Confirm Your Booking</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test</span>
                      <span className="font-semibold">{selectedTest?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Center</span>
                      <span>
                        {diagnosticCenters.find((c) => c.id.toString() === selectedCenter)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>{selectedDate ? format(selectedDate, "PPP") : "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{selectedTime}</span>
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
            {bookingStep < 3 ? (
              <Button
                onClick={() => setBookingStep(bookingStep + 1)}
                disabled={
                  (bookingStep === 1 && !selectedCenter) ||
                  (bookingStep === 2 && (!selectedDate || !selectedTime))
                }
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
