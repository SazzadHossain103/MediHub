"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import {
  User,
  FileText,
  AlertTriangle,
  Calendar,
  Download,
  Edit,
  Shield,
  Droplet,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Trash2,
  Eye,
  X,
  Pencil,
  Check,
  UploadCloud,
  Camera,
} from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"

const initialPatientData = {
  name: "John Doe",
  avatar: "/placeholder-avatar.jpg",
  dob: "1989-05-15",
  gender: "Male",
  bloodType: "O+",
  phone: "+880 1712-345678",
  email: "john.doe@email.com",
  address: "123 Green Road, Dhaka 1205",
  emergencyContact: {
    name: "Jane Doe",
    relation: "Spouse",
    phone: "+880 1798-765432",
  },
  insuranceId: "INS-2024-78901",
  medihubId: "MH-2024-001234",
}

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const initialAllergies = [
  { name: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
  { name: "Shellfish", severity: "moderate", reaction: "Hives, swelling" },
  { name: "Dust mites", severity: "mild", reaction: "Sneezing, congestion" },
]

const initialMedicalHistory = [
  {
    date: "Apr 15, 2026",
    type: "Consultation",
    provider: "Dr. Sarah Ahmed",
    hospital: "Square Hospital",
    notes: "Routine diabetes checkup. HbA1c levels stable at 6.8%.",
    file: "/demo-medical-record.png",
  },
  {
    date: "Mar 28, 2026",
    type: "Lab Test",
    provider: "Labaid Diagnostics",
    hospital: "Labaid Hospital",
    notes: "Complete blood count, lipid profile. All values within normal range.",
    file: "/demo-medical-record.png",
  },
  {
    date: "Feb 10, 2026",
    type: "Emergency Visit",
    provider: "Dr. Karim",
    hospital: "United Hospital",
    notes: "Acute gastritis. Treated and discharged same day.",
    file: "/demo-medical-record.png",
  },
  {
    date: "Jan 5, 2026",
    type: "Consultation",
    provider: "Dr. Sarah Ahmed",
    hospital: "Square Hospital",
    notes: "Annual physical examination. Blood pressure well controlled.",
    file: "/demo-medical-record.png",
  },
]



const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Dietary":
      return "bg-green-50 text-green-700 border-green-200"
    case "Lifestyle":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Prescription":
      return "bg-purple-50 text-purple-700 border-purple-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [historyList, setHistoryList] = useState(initialMedicalHistory)
  const [viewingRecord, setViewingRecord] = useState<typeof historyList[0] | null>(null)
  const { user, token, setUser } = useAuthStore()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoadingPatient, setIsLoadingPatient] = useState<boolean>(true)
  // Add History State
  const [isAddingHistory, setIsAddingHistory] = useState(false)
  const [newHistory, setNewHistory] = useState({
    type: "",
    provider: "",
    hospital: "",
    notes: "",
    file: "",
  })

  const handleAddHistory = (e: React.FormEvent) => {
    e.preventDefault()
    const record = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: newHistory.type,
      provider: newHistory.provider,
      hospital: newHistory.hospital,
      notes: newHistory.notes,
      file: newHistory.file || "/demo-medical-record.png", // Demo fallback
    }
    setHistoryList([record, ...historyList])
    setIsAddingHistory(false)
    setNewHistory({ type: "", provider: "", hospital: "", notes: "", file: "" })
  }

  // Personal Info state
  const [patient, setPatient] = useState(initialPatientData)
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [editPatient, setEditPatient] = useState(initialPatientData)
  
  // Edit Profile Main State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editProfileData, setEditProfileData] = useState(initialPatientData)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        if (typeof result === "string") {
          setEditProfileData({ ...editProfileData, avatar: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const mapPatientData = (p: any) => ({
    name: p.fullName || p.name || user?.name || "",
    avatar: p.avatar || "/placeholder-avatar.jpg",
    dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split("T")[0] : (p.dob || "1980-01-01"),
    gender: p.gender || "Male",
    bloodType: p.bloodType || "O+",
    phone: p.contactNumber || p.phone || "",
    email: p.email || user?.email || "",
    address: p.address || "",
    emergencyContact: p.emergencyContact || { name: "", relation: "", phone: "" },
    insuranceId: p.insuranceId || "",
    medihubId: p.medihubId || "",
    allergies: Array.isArray(p.allergies) ? p.allergies : initialAllergies,
  })

  const savePatientProfile = async (payload: Record<string, any>) => {
    setApiError(null)
    if (!user?.id || !token) {
      setApiError("Authentication required to update profile")
      return null
    }

    try {
      const res = await fetch(`/api/patient/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setApiError(data?.message || data?.error || "Failed to update patient profile")
        return null
      }

      return data
    } catch (error: any) {
      setApiError(error?.message || "Failed to update patient profile")
      return null
    }
  }

  const handleSaveMainProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: editProfileData.name,
      fullName: editProfileData.name,
      dateOfBirth: editProfileData.dob,
      gender: editProfileData.gender,
      contactNumber: editProfileData.phone,
      email: editProfileData.email,
      address: editProfileData.address,
      bloodType: editProfileData.bloodType,
      emergencyContact: editProfileData.emergencyContact,
      avatar: editProfileData.avatar,
    }

    const data = await savePatientProfile(payload)
    if (!data) return

    const updatedPatient = data.patient ? mapPatientData(data.patient) : editProfileData
    setPatient(updatedPatient)
    setEditPatient(updatedPatient)
    setEditProfileData(updatedPatient)
    setIsEditProfileOpen(false)

    if (user && editProfileData.name !== user.name) {
      setUser({ ...user, name: editProfileData.name })
    }
    if (user && editProfileData.email !== user.email) {
      setUser({ ...user, email: editProfileData.email })
    }
  }

  const handleSavePersonal = async () => {
    const payload = {
      contactNumber: editPatient.phone,
      email: editPatient.email,
      address: editPatient.address,
      emergencyContact: editPatient.emergencyContact,
    }

    const data = await savePatientProfile(payload)
    if (!data) return

    const updatedPatient = data.patient ? mapPatientData(data.patient) : editPatient
    setPatient(updatedPatient)
    setEditPatient(updatedPatient)
    setEditingPersonal(false)

    if (user && editPatient.email !== user.email) {
      setUser({ ...user, email: editPatient.email })
    }
  }

  useEffect(() => {
    const loadPatient = async () => {
      if (!user?.id || !token) {
        setIsLoadingPatient(false)
        return
      }

      try {
        const res = await fetch(`/api/patient/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) {
          setApiError(data?.message || data?.error || "Failed to load patient data")
          setIsLoadingPatient(false)
          return
        }

        const mapped = mapPatientData(data.patient || {})
        const allergies = Array.isArray(data.patient?.allergies) ? data.patient.allergies : initialAllergies

        setPatient(mapped)
        setEditPatient(mapped)
        setEditProfileData(mapped)
        setAllergyList(allergies)
        setEditAllergyList(allergies)
      } catch (err: any) {
        setApiError(err?.message || "Failed to load patient data")
      } finally {
        setIsLoadingPatient(false)
      }
    }

    loadPatient()
  }, [user?.id, token])

  const handleCancelPersonal = () => {
    setEditPatient(patient)
    setEditingPersonal(false)
  }

  // Allergies state
  const [allergyList, setAllergyList] = useState(initialAllergies)
  const [editingAllergies, setEditingAllergies] = useState(false)
  const [editAllergyList, setEditAllergyList] = useState(initialAllergies)

  const handleSaveAllergies = async () => {
    const payload = {
      allergies: editAllergyList.filter((a) => a.name.trim()),
    }

    const data = await savePatientProfile(payload)
    if (!data) return

    const savedAllergies = Array.isArray(data.patient?.allergies)
      ? data.patient.allergies
      : payload.allergies

    setAllergyList(savedAllergies)
    setEditAllergyList(savedAllergies)
    setEditingAllergies(false)
  }
  const handleCancelAllergies = () => {
    setEditAllergyList(allergyList)
    setEditingAllergies(false)
  }
  const handleAddAllergy = () => {
    setEditAllergyList([...editAllergyList, { name: "", severity: "mild", reaction: "" }])
  }
  const handleRemoveAllergy = (index: number) => {
    setEditAllergyList(editAllergyList.filter((_, i) => i !== index))
  }
  const updateAllergy = (index: number, field: string, value: string) => {
    setEditAllergyList(editAllergyList.map((a, i) => i === index ? { ...a, [field]: value } : a))
  }
  const [notes, setNotes] = useState<
    { id: number; title: string; content: string; category: string; date: string }[]
  >([
    {
      id: 1,
      title: "Morning Cardio Plan",
      content: "30 minutes brisk walking followed by 10 minutes stretching. Keep heart rate between 100-120 bpm.",
      category: "Lifestyle",
      date: "May 14, 2026",
    },
    {
      id: 2,
      title: "Dietary Adjustments",
      content: "Reduce sodium intake to under 2300mg/day. Increase fiber-rich vegetables. Avoid processed foods.",
      category: "Dietary",
      date: "May 10, 2026",
    },
  ])

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editNoteData, setEditNoteData] = useState({ title: "", content: "", category: "" })

  const handleEditNote = (note: typeof notes[0]) => {
    setEditingNoteId(note.id)
    setEditNoteData({ title: note.title, content: note.content, category: note.category })
  }

  const handleSaveNote = (id: number) => {
    setNotes(notes.map((note) => 
      note.id === id 
        ? { 
            ...note, 
            title: editNoteData.title, 
            content: editNoteData.content, 
            category: editNoteData.category,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          } 
        : note
    ))
    setEditingNoteId(null)
  }

  const handleCancelEditNote = () => {
    setEditingNoteId(null)
  }

  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteCategory, setNewNoteCategory] = useState("General")

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return
    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
      title: newNoteTitle,
      content: newNoteContent,
      category: newNoteCategory,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
    setNotes([newNote, ...notes])
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteCategory("General")
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
            <AvatarImage src={patient.avatar} alt={patient.name} className="object-cover" />
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{user?.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
              <span>{calculateAge(patient.dob)} years old</span>
              <span>·</span>
              <span>{patient.gender}</span>
              <span>·</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                <Droplet className="mr-1 h-3 w-3" />
                {patient.bloodType}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              MediHub ID: <span className="font-mono font-semibold">{patient.medihubId}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setEditProfileData(patient); setIsEditProfileOpen(true); }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {apiError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {apiError}
        </div>
      ) : null}

      {/* Security Badge */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="flex items-center gap-3 p-4">
          <Shield className="h-6 w-6 text-secondary" />
          <div>
            <p className="font-semibold text-secondary">Your Medical Records Are Secure</p>
            <p className="text-sm text-muted-foreground">
              All data is encrypted with 256-bit SSL and compliant with HIPAA standards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                {editingPersonal ? (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleCancelPersonal}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={handleSavePersonal}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setEditPatient(patient); setEditingPersonal(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {editingPersonal ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <Input value={editPatient.phone} onChange={(e) => setEditPatient({ ...editPatient, phone: e.target.value })} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <Input value={editPatient.email} onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      <Input value={editPatient.address} onChange={(e) => setEditPatient({ ...editPatient, address: e.target.value })} className="h-9" />
                    </div>
                    <Separator />
                    <p className="text-xs font-medium text-muted-foreground">Emergency Contact</p>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <Input value={editPatient.emergencyContact.name} onChange={(e) => setEditPatient({ ...editPatient, emergencyContact: { ...editPatient.emergencyContact, name: e.target.value } })} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Relation</Label>
                      <Input value={editPatient.emergencyContact.relation} onChange={(e) => setEditPatient({ ...editPatient, emergencyContact: { ...editPatient.emergencyContact, relation: e.target.value } })} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <Input value={editPatient.emergencyContact.phone} onChange={(e) => setEditPatient({ ...editPatient, emergencyContact: { ...editPatient.emergencyContact, phone: e.target.value } })} className="h-9" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{patient.address}</span>
                    </div>
                    <Separator />
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Emergency Contact</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-destructive" />
                        <span className="font-medium">{patient.emergencyContact.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {patient.emergencyContact.relation}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">{patient.emergencyContact.phone}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Allergies & Alerts
                </CardTitle>
                {editingAllergies ? (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleCancelAllergies}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={handleSaveAllergies}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setEditAllergyList(allergyList); setEditingAllergies(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingAllergies ? (
                  <div className="space-y-3">
                    {editAllergyList.map((allergy, index) => (
                      <div key={index} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Input placeholder="Allergy name" value={allergy.name} onChange={(e) => updateAllergy(index, "name", e.target.value)} className="h-8 text-sm" />
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveAllergy(index)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Select value={allergy.severity} onValueChange={(val) => updateAllergy(index, "severity", val)}>
                          <SelectTrigger className="h-8 w-full text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea placeholder="Reaction details" value={allergy.reaction} onChange={(e) => updateAllergy(index, "reaction", e.target.value)} className="min-h-[60px] text-sm resize-none" />
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" onClick={handleAddAllergy}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Allergy
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allergyList.map((allergy, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border p-4 ${
                          allergy.severity === "severe"
                            ? "border-red-200 bg-red-50"
                            : allergy.severity === "moderate"
                            ? "border-amber-200 bg-amber-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{allergy.name}</span>
                          <Badge
                            variant={
                              allergy.severity === "severe"
                                ? "destructive"
                                : allergy.severity === "moderate"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              allergy.severity === "moderate"
                                ? "bg-amber-500"
                                : allergy.severity === "mild"
                                ? "bg-gray-500"
                                : ""
                            }
                          >
                            {allergy.severity}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{allergy.reaction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-chart-3" />
                  Medical History
                </CardTitle>
                <CardDescription className="mt-1.5">Your past visits, consultations, and procedures</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddingHistory(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {historyList.map((record, index) => (
                    <div key={index} className="relative border-l-2 border-border pl-6 pb-6">
                      <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {record.type}
                            </Badge>
                            <h4 className="font-semibold">{record.provider}</h4>
                            <p className="text-sm text-muted-foreground">{record.hospital}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {record.date}
                          </div>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3">
                          <p className="text-sm">{record.notes}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => setViewingRecord(record)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* View Record Dialog */}
          <Dialog open={!!viewingRecord} onOpenChange={(open) => !open && setViewingRecord(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {viewingRecord?.type} — {viewingRecord?.provider}
                </DialogTitle>
                <DialogDescription>
                  {viewingRecord?.hospital} · {viewingRecord?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-auto rounded-lg border border-border bg-muted/30 p-2">
                {viewingRecord?.file && (
                  <Image
                    src={viewingRecord.file}
                    alt={`Medical record from ${viewingRecord.date}`}
                    width={800}
                    height={1100}
                    className="w-full h-auto rounded-md object-contain"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Add History Dialog */}
          <Dialog open={isAddingHistory} onOpenChange={setIsAddingHistory}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
                <DialogDescription>
                  Enter the details of your recent medical visit or procedure.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddHistory} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type of Visit</Label>
                    <Select value={newHistory.type} onValueChange={(val) => setNewHistory({ ...newHistory, type: val })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Lab Test">Lab Test</SelectItem>
                        <SelectItem value="Emergency Visit">Emergency Visit</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Provider / Doctor</Label>
                    <Input placeholder="e.g. Dr. Sarah Ahmed" value={newHistory.provider} onChange={(e) => setNewHistory({ ...newHistory, provider: e.target.value })} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Hospital / Clinic</Label>
                  <Input placeholder="e.g. Square Hospital" value={newHistory.hospital} onChange={(e) => setNewHistory({ ...newHistory, hospital: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label>Notes / Summary</Label>
                  <Textarea 
                    placeholder="Brief details about the visit..." 
                    className="resize-none" 
                    value={newHistory.notes} 
                    onChange={(e) => setNewHistory({ ...newHistory, notes: e.target.value })} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach Document (PDF/Image)</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setNewHistory({ ...newHistory, file: "/demo-medical-record.png" })}
                  >
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    {newHistory.file ? (
                      <p className="text-sm font-medium text-primary">demo-medical-record.png attached!</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={() => setIsAddingHistory(false)}>Cancel</Button>
                  <Button type="submit">Save Record</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create New Note Form */}
            <div className="lg:col-span-1">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Edit className="h-5 w-5 text-primary" />
                    Create New Note
                  </CardTitle>
                  <CardDescription>Add a personal health note or general reminder.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        placeholder="e.g. Morning Cardio Plan"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["General", "Dietary", "Lifestyle", "Prescription"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewNoteCategory(cat)}
                            className={`flex items-center justify-center rounded-lg border py-2 text-xs font-medium transition-all duration-200 ${
                              newNoteCategory === cat
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Write note details here..."
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        required
                        className="min-h-[120px] bg-background resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full transition-transform active:scale-95">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List of Notes */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-secondary" />
                    Personal & Medical Notes
                  </CardTitle>
                  <CardDescription>Keep track of your recommendations, daily logs, and advice.</CardDescription>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mb-4 stroke-[1.5]" />
                      <h3 className="font-semibold text-foreground">No notes recorded</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
                        Add your first note on the left to start tracking your updates.
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[520px] pr-4">
                      <div className="space-y-4">
                        {[...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((note) => (
                          <div
                            key={note.id}
                            className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md"
                          >
                            {editingNoteId === note.id ? (
                              <div className="space-y-4 w-full">
                                <div className="space-y-2">
                                  <Input
                                    value={editNoteData.title}
                                    onChange={(e) => setEditNoteData({ ...editNoteData, title: e.target.value })}
                                    className="font-semibold text-base"
                                    placeholder="Note Title"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                  {["General", "Dietary", "Lifestyle", "Prescription"].map((cat) => (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() => setEditNoteData({ ...editNoteData, category: cat })}
                                      className={`flex items-center justify-center rounded-lg border py-1.5 text-xs font-medium transition-all duration-200 ${
                                        editNoteData.category === cat
                                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                          : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                                <Textarea
                                  value={editNoteData.content}
                                  onChange={(e) => setEditNoteData({ ...editNoteData, content: e.target.value })}
                                  className="min-h-[100px] resize-none text-sm"
                                  placeholder="Note Content"
                                />
                                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                                  <Button variant="ghost" size="sm" onClick={handleCancelEditNote}>
                                    Cancel
                                  </Button>
                                  <Button size="sm" onClick={() => handleSaveNote(note.id)}>
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <div className="flex items-start justify-between gap-4">
                                    <h4 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                                      {note.title}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeClass(
                                        note.category
                                      )}`}
                                    >
                                      {note.category}
                                    </Badge>
                                  </div>
                                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {note.content}
                                  </p>
                                </div>
                                
                                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
                                  <div className="flex flex-wrap items-center gap-4">
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {note.date}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditNote(note)}
                                      className="h-8 w-8 text-muted-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="h-8 w-8 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your primary profile information and profile picture.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMainProfile} className="space-y-6 py-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary shadow-sm cursor-pointer overflow-hidden">
                  <AvatarImage src={editProfileData.avatar} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-primary/10">JD</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleAvatarUpload}
                  title="Upload profile picture"
                />
              </div>
              <p className="text-xs text-muted-foreground">Click to upload a new profile picture</p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editProfileData.name} 
                  onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input 
                    id="edit-dob" 
                    type="date" 
                    value={editProfileData.dob} 
                    onChange={(e) => setEditProfileData({ ...editProfileData, dob: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={editProfileData.gender} onValueChange={(val) => setEditProfileData({ ...editProfileData, gender: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Select value={editProfileData.bloodType} onValueChange={(val) => setEditProfileData({ ...editProfileData, bloodType: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
