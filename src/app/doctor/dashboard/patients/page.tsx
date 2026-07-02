"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { useAuthStore } from "@/src/store/useAuthStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"
import {
  Users,
  Eye,
  FileText,
  User,
  Phone,
  Mail,
  Heart,
  Activity,
  Pill,
  Syringe,
  AlertTriangle,
  Droplet,
  Thermometer,
  Scale,
  Ruler,
  Shield,
  MapPin,
  X,
  Upload,
  Calendar,
} from "lucide-react"

// Mock patient data
const mockPatients = [
  {
    id: "p1",
    name: "John Doe",
    phone: "+880 1712-345678",
    email: "john.doe@email.com",
    age: 35,
    gender: "Male",
    bloodType: "O+",
    height: "5'10\" (178 cm)",
    weight: "165 lbs (75 kg)",
    bmi: 23.7,
    address: "123 Green Road, Dhaka 1205",
    emergencyContact: { name: "Jane Doe", relation: "Spouse", phone: "+880 1798-765432" },
    vitalSigns: { bloodPressure: "120/80", heartRate: 72, temperature: 98.6, oxygenSaturation: 98 },
    allergies: [
      { name: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
      { name: "Shellfish", severity: "moderate", reaction: "Hives, swelling" },
    ],
    conditions: [
      { name: "Type 2 Diabetes", diagnosedDate: "Jan 2022", status: "managed" },
      { name: "Hypertension", diagnosedDate: "Mar 2021", status: "managed" },
    ],
    medications: [
      { name: "Metformin 500mg", dosage: "Twice daily with meals", prescribedBy: "Dr. Rahman", startDate: "Jan 2022" },
      { name: "Lisinopril 10mg", dosage: "Once daily in morning", prescribedBy: "Dr. Ahmed", startDate: "Mar 2021" },
    ],
    immunizations: [
      { name: "COVID-19 (Pfizer)", date: "Mar 15, 2024", nextDue: "Mar 2025" },
      { name: "Influenza", date: "Oct 10, 2025", nextDue: "Oct 2026" },
    ],
    medicalHistory: [
      { date: "Apr 15, 2026", type: "Consultation", provider: "Dr. Sarah Ahmed", hospital: "Square Hospital", notes: "Routine diabetes checkup. HbA1c levels stable at 6.8%." },
      { date: "Mar 28, 2026", type: "Lab Test", provider: "Labaid Diagnostics", hospital: "Labaid Hospital", notes: "Complete blood count, lipid profile. All values within normal range." },
      { date: "Feb 10, 2026", type: "Emergency Visit", provider: "Dr. Karim", hospital: "United Hospital", notes: "Acute gastritis. Treated and discharged same day." },
      { date: "Jan 5, 2026", type: "Consultation", provider: "Dr. Sarah Ahmed", hospital: "Square Hospital", notes: "Annual physical examination. Blood pressure well controlled." },
    ],
  },
  {
    id: "p2",
    name: "Sarah Khan",
    phone: "+880 1812-567890",
    email: "sarah.khan@email.com",
    age: 28,
    gender: "Female",
    bloodType: "A+",
    height: "5'4\" (162 cm)",
    weight: "130 lbs (59 kg)",
    bmi: 22.4,
    address: "456 Gulshan Avenue, Dhaka 1212",
    emergencyContact: { name: "Ahmed Khan", relation: "Brother", phone: "+880 1712-111222" },
    vitalSigns: { bloodPressure: "115/75", heartRate: 68, temperature: 98.4, oxygenSaturation: 99 },
    allergies: [{ name: "Dust mites", severity: "mild", reaction: "Sneezing, congestion" }],
    conditions: [{ name: "Seasonal Allergies", diagnosedDate: "2020", status: "active" }],
    medications: [{ name: "Cetirizine 10mg", dosage: "Once daily as needed", prescribedBy: "Dr. Hassan", startDate: "Apr 2024" }],
    immunizations: [
      { name: "COVID-19 (Moderna)", date: "Feb 20, 2024", nextDue: "Feb 2025" },
      { name: "Tetanus (Tdap)", date: "Jun 5, 2022", nextDue: "Jun 2032" },
    ],
    medicalHistory: [
      { date: "Apr 20, 2026", type: "Consultation", provider: "Dr. Fatima", hospital: "United Hospital", notes: "Seasonal allergy follow-up. Prescribed antihistamines." },
      { date: "Mar 15, 2026", type: "Lab Test", provider: "Labaid Diagnostics", hospital: "Labaid Hospital", notes: "Allergy panel test. Dust mite sensitivity confirmed." },
      { date: "Feb 1, 2026", type: "Consultation", provider: "Dr. Fatima", hospital: "United Hospital", notes: "Initial consultation for recurring sneezing and congestion." },
    ],
  },
  {
    id: "p3",
    name: "Rahim Uddin",
    phone: "+880 1912-234567",
    email: "rahim.uddin@email.com",
    age: 45,
    gender: "Male",
    bloodType: "B+",
    height: "5'8\" (173 cm)",
    weight: "180 lbs (82 kg)",
    bmi: 27.4,
    address: "789 Dhanmondi, Dhaka 1205",
    emergencyContact: { name: "Fatima Uddin", relation: "Wife", phone: "+880 1912-987654" },
    vitalSigns: { bloodPressure: "135/85", heartRate: 78, temperature: 98.8, oxygenSaturation: 97 },
    allergies: [],
    conditions: [
      { name: "High Cholesterol", diagnosedDate: "Nov 2023", status: "managed" },
      { name: "Pre-diabetes", diagnosedDate: "Jan 2024", status: "monitoring" },
    ],
    medications: [
      { name: "Atorvastatin 20mg", dosage: "Once daily at night", prescribedBy: "Dr. Rahman", startDate: "Nov 2023" },
    ],
    immunizations: [
      { name: "COVID-19 (AstraZeneca)", date: "Apr 10, 2024", nextDue: "Apr 2025" },
      { name: "Hepatitis B", date: "Complete", nextDue: "N/A" },
    ],
    medicalHistory: [
      { date: "Apr 10, 2026", type: "Lab Test", provider: "Popular Diagnostics", hospital: "Popular Hospital", notes: "Lipid profile test. LDL cholesterol improved from 180 to 140." },
      { date: "Mar 5, 2026", type: "Consultation", provider: "Dr. Rahman", hospital: "Square Hospital", notes: "Follow-up for cholesterol management. Medication adjusted." },
      { date: "Jan 20, 2026", type: "Lab Test", provider: "Popular Diagnostics", hospital: "Popular Hospital", notes: "Fasting blood glucose test. HbA1c at 6.2%, pre-diabetic range." },
      { date: "Nov 15, 2025", type: "Emergency Visit", provider: "Dr. Hassan", hospital: "United Hospital", notes: "Chest discomfort. ECG normal. Advised lifestyle changes." },
    ],
  },
]

export default function PatientsPage() {
  // Patient profile modal state
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null)
  const [patientModalOpen, setPatientModalOpen] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)

  const handleViewPatient = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId)
    if (patient) {
      setSelectedPatient(patient)
      setPatientModalOpen(true)
      setPrescriptionFile(null)
    }
  }

  const handleSavePrescription = () => {
    // Mock save - just close the modal
    setPatientModalOpen(false)
    setPrescriptionFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Patients
        </h1>
        <p className="text-muted-foreground mt-1">
          View patient profiles and medical information
        </p>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Patient Directory
          </CardTitle>
          <CardDescription>
            Select a patient to view full profile and medical history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Profile Modal */}
      <Dialog open={patientModalOpen} onOpenChange={setPatientModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scroll-auto  flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Profile & Medical History
            </DialogTitle>
            <DialogDescription>
              View patient information and add prescription
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {/* Patient Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 border-2 border-card shadow-md">
                    <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                      {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedPatient.age} yrs</span>
                      <span>·</span>
                      <span>{selectedPatient.gender}</span>
                      <span>·</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        <Droplet className="mr-1 h-3 w-3" />
                        {selectedPatient.bloodType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <Shield className="h-3 w-3" />
                    <span>HIPAA Compliant</span>
                  </div>
                </div>

                {/* Two-Column Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Personal Info */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{selectedPatient.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{selectedPatient.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{selectedPatient.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Users className="h-3 w-3 text-destructive shrink-0" />
                            <span className="truncate">
                              Emergency: {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Vital Signs */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-secondary" />
                          Vital Signs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              BP
                            </span>
                            <span className="font-medium">{selectedPatient.vitalSigns.bloodPressure}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-pink-500" />
                              HR
                            </span>
                            <span className="font-medium">{selectedPatient.vitalSigns.heartRate} bpm</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3 text-orange-500" />
                              Temp
                            </span>
                            <span className="font-medium">{selectedPatient.vitalSigns.temperature}°F</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Droplet className="h-3 w-3 text-blue-500" />
                              SpO2
                            </span>
                            <span className="font-medium">{selectedPatient.vitalSigns.oxygenSaturation}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Body Metrics */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Scale className="h-4 w-4 text-chart-3" />
                          Body Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 pt-0">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <Ruler className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className="font-medium">{selectedPatient.height}</span>
                            <span className="text-muted-foreground">Height</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <Scale className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className="font-medium">{selectedPatient.weight}</span>
                            <span className="text-muted-foreground">Weight</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-muted rounded">
                            <Activity className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className="font-medium">{selectedPatient.bmi}</span>
                            <span className="text-muted-foreground">BMI</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Allergies */}
                    {selectedPatient.allergies.length > 0 && (
                      <Card>
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Allergies & Alerts
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPatient.allergies.map((allergy, i) => (
                              <Badge
                                key={i}
                                variant={
                                  allergy.severity === "severe"
                                    ? "destructive"
                                    : allergy.severity === "moderate"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`text-xs ${allergy.severity === "moderate" ? "bg-amber-500" : ""}`}
                              >
                                {allergy.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Conditions */}
                    {selectedPatient.conditions.length > 0 && (
                      <Card>
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            Medical Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="space-y-1.5">
                            {selectedPatient.conditions.map((condition, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="font-medium">{condition.name}</span>
                                <Badge
                                  variant={condition.status === "managed" ? "default" : "secondary"}
                                  className={`text-xs ${condition.status === "managed" ? "bg-green-600" : ""}`}
                                >
                                  {condition.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Medications */}
                    {selectedPatient.medications.length > 0 && (
                      <Card>
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Pill className="h-4 w-4 text-primary" />
                            Current Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="space-y-2">
                            {selectedPatient.medications.map((med, i) => (
                              <div key={i} className="rounded border border-border p-2 text-xs">
                                <p className="font-semibold">{med.name}</p>
                                <p className="text-muted-foreground">{med.dosage}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Immunizations */}
                    {selectedPatient.immunizations.length > 0 && (
                      <Card>
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Syringe className="h-4 w-4 text-secondary" />
                            Immunizations
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0">
                          <div className="space-y-1.5">
                            {selectedPatient.immunizations.map((vax, i) => (
                              <div key={i} className="flex items-center justify-between text-xs">
                                <span className="font-medium">{vax.name}</span>
                                {vax.nextDue !== "N/A" ? (
                                  <span className="text-muted-foreground">Next: {vax.nextDue}</span>
                                ) : (
                                  <Badge className="bg-green-600 text-xs">Complete</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Full Width - Medical History (Single Column) */}
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-chart-3" />
                      Medical History
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Past visits, consultations, and procedures
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {selectedPatient.medicalHistory.map((record, i) => (
                        <div key={i} className="relative border-l-2 border-border pl-4">
                          <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary" />
                          <div className="flex items-start justify-between gap-4 rounded border border-border p-3 text-xs">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {record.type}
                                </Badge>
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {record.date}
                                </span>
                              </div>
                              <p className="font-semibold">{record.provider} · {record.hospital}</p>
                              <p className="text-muted-foreground mt-1">{record.notes}</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs h-7 shrink-0">
                              View Full Record
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Full Width - Prescription Upload */}
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Upload className="h-4 w-4 text-primary" />
                      Add Prescription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-3">
                      <Input
                        id="prescription-file"
                        type="file"
                        onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                        className="flex-1 text-xs h-8"
                      />
                      {prescriptionFile && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setPrescriptionFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {prescriptionFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {prescriptionFile.name}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPatientModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSavePrescription} disabled={!prescriptionFile}>
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
