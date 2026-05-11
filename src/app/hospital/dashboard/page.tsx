"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Progress } from "@/src/components/ui/progress"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { useAuthStore } from "@/src/store/useAuthStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Sheet, SheetContent } from "@/src/components/ui/sheet"
import { Badge } from "@/src/components/ui/badge"
import {
  LayoutDashboard,
  TestTube,
  Settings,
  Menu,
  AlertTriangle,
  Bed,
  Building2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  CheckCircle,
  FileText,
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Edit,
  Download,
  Calendar,
  Activity,
  Stethoscope,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface MedicalTest {
  id: string
  testType: string
  testName: string
  description: string
  timeAvailable: string
  cost: string
  preparationInstructions: string
}

interface ReportFile {
  name: string
  uploadedAt: string
}

interface PendingPatient {
  id: string
  patientName: string
  testName: string
  dateBooked: string
  uploadedFiles: ReportFile[]
}

interface CompletedPatient {
  id: string
  patientName: string
  testName: string
  dateCompleted: string
  reportFiles: ReportFile[]
}

interface EmergencyPatient {
  id: string
  patientName: string
  ticketNumber: string
  status: "in progress" | "completed"
  createdAt: string
}

interface HospitalBed {
  id: string
  bedNumber: string
  bedType: "Ward" | "Cabin" | "ICU"
  status: "Available" | "Occupied"
  assignedPatient: string | null
}

interface HospitalProfile {
  name: string
  address: string
  licenseNumber: string
  phone: string
  email: string
  establishedYear: string
  type: string
  accreditation: string
  emergencyServices: boolean
  ambulanceCount: number
  departments: string[]
  operatingHours: string
}

interface HospitalData {
  id: string
  profile: HospitalProfile
  emergencyPatients: EmergencyPatient[]
  beds: HospitalBed[]
  tests: MedicalTest[]
  pendingPatients: PendingPatient[]
  completedPatients: CompletedPatient[]
  ticketCounter: number
}

const testTypes = [
  "Blood Tests",
  "Imaging & Scans",
  "Cardiac Tests",
  "Pathology",
  "Hormone Tests",
  "Allergy Tests",
]

const bedTypes = ["Ward", "Cabin", "ICU"] as const

// Mock data for multiple hospitals
const hospitalsDatabase: Record<string, HospitalData> = {
  "hospital-1": {
    id: "hospital-1",
    profile: {
      name: "Dhaka Medical College Hospital",
      address: "Secretariat Road, Dhaka 1000",
      licenseNumber: "DMCH-2024-001",
      phone: "+880 2-55165001",
      email: "info@dmch.gov.bd",
      establishedYear: "1946",
      type: "Government Teaching Hospital",
      accreditation: "NABH Accredited",
      emergencyServices: true,
      ambulanceCount: 12,
      departments: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Surgery", "Internal Medicine", "Obstetrics & Gynecology"],
      operatingHours: "24/7 Emergency Services",
    },
    emergencyPatients: [
      {
        id: "e1",
        patientName: "Abdul Rahman",
        ticketNumber: "EM-001",
        status: "in progress",
        createdAt: "2024-01-15",
      },
      {
        id: "e2",
        patientName: "Salma Akter",
        ticketNumber: "EM-002",
        status: "in progress",
        createdAt: "2024-01-15",
      },
    ],
    beds: [
      { id: "b1", bedNumber: "W-101", bedType: "Ward", status: "Available", assignedPatient: null },
      { id: "b2", bedNumber: "W-102", bedType: "Ward", status: "Occupied", assignedPatient: "Mohammad Ali" },
      { id: "b3", bedNumber: "C-201", bedType: "Cabin", status: "Available", assignedPatient: null },
      { id: "b4", bedNumber: "C-202", bedType: "Cabin", status: "Occupied", assignedPatient: "Rahima Begum" },
      { id: "b5", bedNumber: "ICU-01", bedType: "ICU", status: "Available", assignedPatient: null },
      { id: "b6", bedNumber: "ICU-02", bedType: "ICU", status: "Occupied", assignedPatient: "Jamal Uddin" },
    ],
    tests: [
      {
        id: "1",
        testType: "Blood Tests",
        testName: "Complete Blood Count (CBC)",
        description: "Measures different components of blood including red cells, white cells, and platelets.",
        timeAvailable: "Sunday to Thursday 8AM–4PM",
        cost: "500",
        preparationInstructions: "Fasting for 8-12 hours recommended.",
      },
      {
        id: "2",
        testType: "Imaging & Scans",
        testName: "Chest X-Ray",
        description: "Imaging test to examine the lungs, heart, and chest wall.",
        timeAvailable: "Saturday to Thursday 9AM–5PM",
        cost: "600",
        preparationInstructions: "Remove jewelry and metal objects. Wear loose clothing.",
      },
      {
        id: "3",
        testType: "Cardiac Tests",
        testName: "ECG (Electrocardiogram)",
        description: "Records the electrical activity of the heart.",
        timeAvailable: "Sunday to Thursday 10AM–2PM",
        cost: "400",
        preparationInstructions: "No special preparation required.",
      },
    ],
    pendingPatients: [
      {
        id: "p1",
        patientName: "Rahim Ahmed",
        testName: "Complete Blood Count (CBC)",
        dateBooked: "2024-01-15",
        uploadedFiles: [],
      },
      {
        id: "p2",
        patientName: "Fatima Khan",
        testName: "ECG (Electrocardiogram)",
        dateBooked: "2024-01-14",
        uploadedFiles: [],
      },
    ],
    completedPatients: [
      {
        id: "c1",
        patientName: "Nasreen Begum",
        testName: "Chest X-Ray",
        dateCompleted: "2024-01-12",
        reportFiles: [{ name: "XRay_Report.pdf", uploadedAt: "2024-01-12" }],
      },
    ],
    ticketCounter: 3,
  },
  "hospital-2": {
    id: "hospital-2",
    profile: {
      name: "Square Hospital",
      address: "18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205",
      licenseNumber: "SQH-2024-002",
      phone: "+880 2-8159457",
      email: "info@squarehospital.com",
      establishedYear: "2006",
      type: "Private Multi-specialty Hospital",
      accreditation: "JCI Accredited",
      emergencyServices: true,
      ambulanceCount: 8,
      departments: ["Cardiology", "Oncology", "Nephrology", "Gastroenterology", "Orthopedics", "Neurosurgery"],
      operatingHours: "24/7 Emergency Services",
    },
    emergencyPatients: [
      {
        id: "e3",
        patientName: "Karim Hossain",
        ticketNumber: "EM-001",
        status: "in progress",
        createdAt: "2024-01-15",
      },
    ],
    beds: [
      { id: "b7", bedNumber: "SQ-W-101", bedType: "Ward", status: "Available", assignedPatient: null },
      { id: "b8", bedNumber: "SQ-W-102", bedType: "Ward", status: "Available", assignedPatient: null },
      { id: "b9", bedNumber: "SQ-C-201", bedType: "Cabin", status: "Occupied", assignedPatient: "Tahmina Sultana" },
      { id: "b10", bedNumber: "SQ-ICU-01", bedType: "ICU", status: "Available", assignedPatient: null },
    ],
    tests: [
      {
        id: "4",
        testType: "Hormone Tests",
        testName: "Thyroid Profile (T3, T4, TSH)",
        description: "Measures thyroid hormone levels to assess thyroid function.",
        timeAvailable: "Sunday to Wednesday 8AM–12PM",
        cost: "1500",
        preparationInstructions: "Morning sample preferred. Inform about any thyroid medications.",
      },
      {
        id: "5",
        testType: "Blood Tests",
        testName: "Lipid Profile",
        description: "Measures cholesterol levels including HDL, LDL, and triglycerides.",
        timeAvailable: "Sunday to Thursday 8AM–2PM",
        cost: "800",
        preparationInstructions: "Fasting for 10-12 hours required.",
      },
    ],
    pendingPatients: [
      {
        id: "p4",
        patientName: "Shafiq Islam",
        testName: "Thyroid Profile (T3, T4, TSH)",
        dateBooked: "2024-01-16",
        uploadedFiles: [],
      },
    ],
    completedPatients: [],
    ticketCounter: 2,
  },
  "hospital-3": {
    id: "hospital-3",
    profile: {
      name: "United Hospital",
      address: "Plot 15, Road 71, Gulshan, Dhaka 1212",
      licenseNumber: "UHL-2024-003",
      phone: "+880 2-8836000",
      email: "info@uhlbd.com",
      establishedYear: "2006",
      type: "Private Multi-specialty Hospital",
      accreditation: "JCI Accredited",
      emergencyServices: true,
      ambulanceCount: 10,
      departments: ["Neurology", "Cardiology", "Oncology", "Orthopedics", "Pediatrics", "Dermatology", "ENT"],
      operatingHours: "24/7 Emergency Services",
    },
    emergencyPatients: [],
    beds: [
      { id: "b11", bedNumber: "UH-W-101", bedType: "Ward", status: "Available", assignedPatient: null },
      { id: "b12", bedNumber: "UH-C-101", bedType: "Cabin", status: "Available", assignedPatient: null },
      { id: "b13", bedNumber: "UH-ICU-01", bedType: "ICU", status: "Occupied", assignedPatient: "Rafiq Ahmed" },
    ],
    tests: [
      {
        id: "6",
        testType: "Imaging & Scans",
        testName: "MRI Brain",
        description: "Detailed imaging of brain structures using magnetic resonance.",
        timeAvailable: "Saturday to Thursday 10AM–6PM",
        cost: "8000",
        preparationInstructions: "Remove all metal objects. Inform if you have any implants.",
      },
      {
        id: "7",
        testType: "Allergy Tests",
        testName: "Skin Prick Test",
        description: "Tests for allergic reactions to common allergens.",
        timeAvailable: "Sunday to Wednesday 9AM–1PM",
        cost: "2500",
        preparationInstructions: "Stop antihistamines 5 days before test.",
      },
    ],
    pendingPatients: [
      {
        id: "p5",
        patientName: "Nusrat Jahan",
        testName: "MRI Brain",
        dateBooked: "2024-01-17",
        uploadedFiles: [],
      },
      {
        id: "p6",
        patientName: "Habib Rahman",
        testName: "Skin Prick Test",
        dateBooked: "2024-01-17",
        uploadedFiles: [],
      },
    ],
    completedPatients: [
      {
        id: "c2",
        patientName: "Sultana Begum",
        testName: "MRI Brain",
        dateCompleted: "2024-01-10",
        reportFiles: [
          { name: "MRI_Report.pdf", uploadedAt: "2024-01-10" },
          { name: "MRI_Images.zip", uploadedAt: "2024-01-10" },
        ],
      },
    ],
    ticketCounter: 1,
  },
}

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Hospital Profile", icon: Building2 },
  { id: "tests", label: "Medical Tests", icon: TestTube },
  { id: "settings", label: "Settings", icon: Settings },
]

function SidebarContent({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {

  const router = useRouter()

  const { logout, hospitalToken } = useAuthStore()
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/hospital/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hospitalToken}`,
        },
        credentials: "include", // 🔥 VERY IMPORTANT
      });
      if (!res.ok) {
        console.error("Logout failed with status:", res.status);
        // return;
      }

      logout();            // 🔥 clear Zustand (client)

      router.push("/hospital/login") // 🔥 redirect to login page
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/medihub-header.png"
            alt="MediHub"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = activeTab === link.id
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Button
          // href="/hospital/login"
          variant="outline"
          onClick={handleLogout}
          className="flex items-center  gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default function HospitalDashboardPage({
  params,
}: {
  params: Promise<{ hospitalId: string }>
}) {
  const { hospitalId } = use(params)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Hospital data state - initialize from database or use fallback
  const [hospitalData, setHospitalData] = useState<HospitalData>(
    hospitalsDatabase[hospitalId] || hospitalsDatabase["hospital-1"]
  )

  // Dialog states
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false)
  const [emergencyPatientName, setEmergencyPatientName] = useState("")
  const [bedDialogOpen, setBedDialogOpen] = useState(false)
  const [bedForm, setBedForm] = useState({ bedNumber: "", bedType: "Ward" as "Ward" | "Cabin" | "ICU" })
  const [assignPatientDialogOpen, setAssignPatientDialogOpen] = useState(false)
  const [assigningBedId, setAssigningBedId] = useState<string | null>(null)
  const [assignPatientName, setAssignPatientName] = useState("")
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<MedicalTest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)
  const [testForm, setTestForm] = useState({
    testType: "",
    testName: "",
    description: "",
    timeAvailable: "",
    cost: "",
    preparationInstructions: "",
  })
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadingPatientId, setUploadingPatientId] = useState<string | null>(null)
  const { user } = useAuthStore()
  // Computed dashboard stats
  const emergencyQueueCount = hospitalData.emergencyPatients.filter(p => p.status === "in progress").length
  const availableBeds = hospitalData.beds.filter(b => b.status === "Available").length
  const totalBeds = hospitalData.beds.length

  // Emergency Queue handlers
  const handleAddEmergencyPatient = () => {
    if (!emergencyPatientName.trim()) return

    const newPatient: EmergencyPatient = {
      id: Date.now().toString(),
      patientName: emergencyPatientName.trim(),
      ticketNumber: `EM-${String(hospitalData.ticketCounter).padStart(3, "0")}`,
      status: "in progress",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setHospitalData({
      ...hospitalData,
      emergencyPatients: [...hospitalData.emergencyPatients, newPatient],
      ticketCounter: hospitalData.ticketCounter + 1,
    })
    setEmergencyPatientName("")
    setEmergencyDialogOpen(false)
  }

  const handleMarkEmergencyCompleted = (patientId: string) => {
    setHospitalData({
      ...hospitalData,
      emergencyPatients: hospitalData.emergencyPatients.filter(p => p.id !== patientId)
    })
  }

  // Bed Management handlers
  const handleAddBed = () => {
    if (!bedForm.bedNumber.trim()) return

    const newBed: HospitalBed = {
      id: Date.now().toString(),
      bedNumber: bedForm.bedNumber.trim(),
      bedType: bedForm.bedType,
      status: "Available",
      assignedPatient: null,
    }

    setHospitalData({
      ...hospitalData,
      beds: [...hospitalData.beds, newBed]
    })
    setBedForm({ bedNumber: "", bedType: "Ward" })
    setBedDialogOpen(false)
  }

  const openAssignPatientDialog = (bedId: string) => {
    setAssigningBedId(bedId)
    setAssignPatientName("")
    setAssignPatientDialogOpen(true)
  }

  const handleAssignPatient = () => {
    if (!assigningBedId || !assignPatientName.trim()) return

    setHospitalData({
      ...hospitalData,
      beds: hospitalData.beds.map(b =>
        b.id === assigningBedId
          ? { ...b, status: "Occupied" as const, assignedPatient: assignPatientName.trim() }
          : b
      )
    })
    setAssignPatientName("")
    setAssigningBedId(null)
    setAssignPatientDialogOpen(false)
  }

  const handleMarkBedAvailable = (bedId: string) => {
    setHospitalData({
      ...hospitalData,
      beds: hospitalData.beds.map(b =>
        b.id === bedId
          ? { ...b, status: "Available" as const, assignedPatient: null }
          : b
      )
    })
  }

  // Test CRUD handlers
  const openAddTestDialog = () => {
    setEditingTest(null)
    setTestForm({
      testType: "",
      testName: "",
      description: "",
      timeAvailable: "",
      cost: "",
      preparationInstructions: "",
    })
    setTestDialogOpen(true)
  }

  const openEditTestDialog = (test: MedicalTest) => {
    setEditingTest(test)
    setTestForm({
      testType: test.testType,
      testName: test.testName,
      description: test.description,
      timeAvailable: test.timeAvailable,
      cost: test.cost,
      preparationInstructions: test.preparationInstructions,
    })
    setTestDialogOpen(true)
  }

  const handleSaveTest = () => {
    if (editingTest) {
      setHospitalData({
        ...hospitalData,
        tests: hospitalData.tests.map((t) =>
          t.id === editingTest.id ? { ...t, ...testForm } : t
        )
      })
    } else {
      const newTest: MedicalTest = {
        id: Date.now().toString(),
        ...testForm,
      }
      setHospitalData({
        ...hospitalData,
        tests: [...hospitalData.tests, newTest]
      })
    }
    setTestDialogOpen(false)
  }

  const openDeleteDialog = (id: string) => {
    setTestToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteTest = () => {
    if (testToDelete) {
      setHospitalData({
        ...hospitalData,
        tests: hospitalData.tests.filter((t) => t.id !== testToDelete)
      })
      setTestToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  // Patient upload handlers
  const openUploadDialog = (patientId: string) => {
    setUploadingPatientId(patientId)
    setUploadDialogOpen(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadingPatientId || !e.target.files) return

    const files = Array.from(e.target.files)
    const newFiles: ReportFile[] = files.map((f) => ({
      name: f.name,
      uploadedAt: new Date().toISOString().split("T")[0],
    }))

    setHospitalData({
      ...hospitalData,
      pendingPatients: hospitalData.pendingPatients.map((p) =>
        p.id === uploadingPatientId
          ? { ...p, uploadedFiles: [...p.uploadedFiles, ...newFiles] }
          : p
      )
    })
    setUploadDialogOpen(false)
  }

  const handleMarkAsCompleted = (patientId: string) => {
    const patient = hospitalData.pendingPatients.find((p) => p.id === patientId)
    if (!patient || patient.uploadedFiles.length === 0) return

    const completedPatient: CompletedPatient = {
      id: patient.id,
      patientName: patient.patientName,
      testName: patient.testName,
      dateCompleted: new Date().toISOString().split("T")[0],
      reportFiles: patient.uploadedFiles,
    }

    setHospitalData({
      ...hospitalData,
      pendingPatients: hospitalData.pendingPatients.filter((p) => p.id !== patientId),
      completedPatients: [completedPatient, ...hospitalData.completedPatients]
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
        <SidebarContent activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent activeTab={activeTab} onTabChange={(tab) => {
            setActiveTab(tab)
            setMobileOpen(false)
          }} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">{user?.name}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            ID: {user?.id}
          </Badge>
        </header>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Emergency Queue</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{emergencyQueueCount}</div>
                    <p className="text-xs text-muted-foreground">Patients in queue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Bed Availability</CardTitle>
                    <Bed className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {availableBeds} / {totalBeds}
                    </div>
                    <p className="text-xs text-muted-foreground">Available beds</p>
                    <Progress value={(availableBeds / totalBeds) * 100} className="mt-2 h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                    <Bed className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalBeds}</div>
                    <p className="text-xs text-muted-foreground">
                      Ward: {hospitalData.beds.filter(b => b.bedType === "Ward").length} |
                      Cabin: {hospitalData.beds.filter(b => b.bedType === "Cabin").length} |
                      ICU: {hospitalData.beds.filter(b => b.bedType === "ICU").length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Queue Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Emergency Queue</CardTitle>
                    <CardDescription>Manage emergency patient queue</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setEmergencyDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Patient
                  </Button>
                </CardHeader>
                <CardContent>
                  {hospitalData.emergencyPatients.filter(p => p.status === "in progress").length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No patients in emergency queue</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket</TableHead>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Added</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hospitalData.emergencyPatients
                          .filter(p => p.status === "in progress")
                          .map((patient) => (
                            <TableRow key={patient.id}>
                              <TableCell>
                                <Badge variant="destructive">{patient.ticketNumber}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{patient.patientName}</TableCell>
                              <TableCell>{patient.createdAt}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkEmergencyCompleted(patient.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Complete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Bed Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Bed Management</CardTitle>
                    <CardDescription>Manage hospital beds and patient assignments</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setBedDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bed
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bed Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hospitalData.beds.map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{bed.bedType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={bed.status === "Available" ? "default" : "secondary"}>
                              {bed.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{bed.assignedPatient || "-"}</TableCell>
                          <TableCell className="text-right">
                            {bed.status === "Available" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAssignPatientDialog(bed.id)}
                              >
                                Assign Patient
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkBedAvailable(bed.id)}
                              >
                                Mark Available
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hospital Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                    <AvatarImage src="/placeholder-hospital.jpg" alt={hospitalData.profile.name} />
                    <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                      {user?.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{user?.name}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
                      <span>{hospitalData.profile.type}</span>
                      <span>·</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Shield className="mr-1 h-3 w-3" />
                        {hospitalData.profile.accreditation}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      License: <span className="font-mono font-semibold">{hospitalData.profile.licenseNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Security Badge */}
              <Card className="border-secondary/30 bg-secondary/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <Shield className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-semibold text-secondary">Verified Healthcare Facility</p>
                    <p className="text-sm text-muted-foreground">
                      This hospital is registered and verified by the Bangladesh Medical Association.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Content */}
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="departments">Departments</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Contact Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-5 w-5 text-primary" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{hospitalData.profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{hospitalData.profile.email}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <span>{hospitalData.profile.address}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{hospitalData.profile.operatingHours}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Activity className="h-5 w-5 text-secondary" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Beds</span>
                          <span className="font-semibold">{totalBeds}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Available Beds</span>
                          <span className="font-semibold text-green-600">{availableBeds}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Emergency Queue</span>
                          <span className="font-semibold text-red-600">{emergencyQueueCount}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Medical Tests</span>
                          <span className="font-semibold">{hospitalData.tests.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Ambulances</span>
                          <span className="font-semibold">{hospitalData.profile.ambulanceCount}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* About */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building2 className="h-5 w-5 text-chart-3" />
                          About Hospital
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Established</span>
                          <span className="font-semibold">{hospitalData.profile.establishedYear}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Type</span>
                          <span className="font-semibold text-xs">{hospitalData.profile.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Accreditation</span>
                          <Badge variant="secondary" className="text-xs">{hospitalData.profile.accreditation}</Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Emergency Services</span>
                          <Badge variant={hospitalData.profile.emergencyServices ? "default" : "secondary"}>
                            {hospitalData.profile.emergencyServices ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Departments Tab */}
                <TabsContent value="departments" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hospital Departments</CardTitle>
                      <CardDescription>Available medical departments and specialties</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {hospitalData.profile.departments.map((dept, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border border-border p-4"
                          >
                            <Stethoscope className="h-5 w-5 text-primary" />
                            <span className="font-medium">{dept}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Facilities Tab */}
                <TabsContent value="facilities" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bed Facilities</CardTitle>
                      <CardDescription>Current bed availability by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {bedTypes.map((type) => {
                          const typeBeds = hospitalData.beds.filter(b => b.bedType === type)
                          const typeAvailable = typeBeds.filter(b => b.status === "Available").length
                          return (
                            <div key={type} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{type} Beds</span>
                                <span className="text-sm text-muted-foreground">
                                  {typeAvailable} / {typeBeds.length} available
                                </span>
                              </div>
                              <Progress value={typeBeds.length > 0 ? (typeAvailable / typeBeds.length) * 100 : 0} className="h-2" />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="statistics" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{hospitalData.pendingPatients.length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting results</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{hospitalData.completedPatients.length}</div>
                        <p className="text-xs text-muted-foreground">Results delivered</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">Current occupancy rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Test Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{hospitalData.tests.length}</div>
                        <p className="text-xs text-muted-foreground">Available tests</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Medical Tests Tab */}
          {activeTab === "tests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Medical Tests</h2>
                <Button onClick={openAddTestDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Test
                </Button>
              </div>

              {/* Tests Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Tests</CardTitle>
                  <CardDescription>Manage medical tests offered by your hospital</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Time Available</TableHead>
                        <TableHead>Cost (BDT)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hospitalData.tests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.testName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{test.testType}</Badge>
                          </TableCell>
                          <TableCell>{test.timeAvailable}</TableCell>
                          <TableCell>{test.cost}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditTestDialog(test)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => openDeleteDialog(test.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Patient Lists */}
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">
                    Pending Patients ({hospitalData.pendingPatients.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({hospitalData.completedPatients.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Patients</CardTitle>
                      <CardDescription>Patients awaiting test results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hospitalData.pendingPatients.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No pending patients</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Test</TableHead>
                              <TableHead>Date Booked</TableHead>
                              <TableHead>Uploaded Files</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hospitalData.pendingPatients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell className="font-medium">{patient.patientName}</TableCell>
                                <TableCell>{patient.testName}</TableCell>
                                <TableCell>{patient.dateBooked}</TableCell>
                                <TableCell>
                                  {patient.uploadedFiles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {patient.uploadedFiles.map((file, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          <FileText className="mr-1 h-3 w-3" />
                                          {file.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">No files</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openUploadDialog(patient.id)}
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      Upload
                                    </Button>
                                    {patient.uploadedFiles.length > 0 && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleMarkAsCompleted(patient.id)}
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Patients</CardTitle>
                      <CardDescription>Patients with delivered test results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hospitalData.completedPatients.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No completed patients</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Test</TableHead>
                              <TableHead>Date Completed</TableHead>
                              <TableHead>Report Files</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hospitalData.completedPatients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell className="font-medium">{patient.patientName}</TableCell>
                                <TableCell>{patient.testName}</TableCell>
                                <TableCell>{patient.dateCompleted}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {patient.reportFiles.map((file, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        <FileText className="mr-1 h-3 w-3" />
                                        {file.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Settings</CardTitle>
                  <CardDescription>Manage your hospital configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Hospital Name</Label>
                      <Input value={user?.name} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label>License Number</Label>
                      <Input value={hospitalData.profile.licenseNumber} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={hospitalData.profile.phone} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email} readOnly className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Input value={hospitalData.profile.address} readOnly className="mt-1" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact support to update hospital information.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Emergency Patient Dialog */}
      <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Patient</DialogTitle>
            <DialogDescription>Issue a new emergency queue ticket</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emergency-patient-name">Patient Name</Label>
              <Input
                id="emergency-patient-name"
                value={emergencyPatientName}
                onChange={(e) => setEmergencyPatientName(e.target.value)}
                placeholder="Enter patient name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmergencyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmergencyPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bed Dialog */}
      <Dialog open={bedDialogOpen} onOpenChange={setBedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>Add a new bed to the hospital</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bed-number">Bed Number</Label>
              <Input
                id="bed-number"
                value={bedForm.bedNumber}
                onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })}
                placeholder="e.g., W-103"
              />
            </div>
            <div>
              <Label htmlFor="bed-type">Bed Type</Label>
              <Select
                value={bedForm.bedType}
                onValueChange={(v) => setBedForm({ ...bedForm, bedType: v as "Ward" | "Cabin" | "ICU" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBedDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBed}>Add Bed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Patient Dialog */}
      <Dialog open={assignPatientDialogOpen} onOpenChange={setAssignPatientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed</DialogTitle>
            <DialogDescription>Enter the patient name to assign to this bed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-patient-name">Patient Name</Label>
              <Input
                id="assign-patient-name"
                value={assignPatientName}
                onChange={(e) => setAssignPatientName(e.target.value)}
                placeholder="Enter patient name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPatient}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Form Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Test" : "Add New Test"}</DialogTitle>
            <DialogDescription>
              {editingTest ? "Update the test details" : "Fill in the details for the new test"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select
                value={testForm.testType}
                onValueChange={(v) => setTestForm({ ...testForm, testType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={testForm.testName}
                onChange={(e) => setTestForm({ ...testForm, testName: e.target.value })}
                placeholder="e.g., Complete Blood Count"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={testForm.description}
                onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                placeholder="Describe what this test measures..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeAvailable">Time Available</Label>
                <Input
                  id="timeAvailable"
                  value={testForm.timeAvailable}
                  onChange={(e) => setTestForm({ ...testForm, timeAvailable: e.target.value })}
                  placeholder="e.g., Sunday to Thursday 10AM–2PM"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost">Cost (BDT)</Label>
                <Input
                  id="cost"
                  value={testForm.cost}
                  onChange={(e) => setTestForm({ ...testForm, cost: e.target.value })}
                  placeholder="e.g., 500"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
              <Textarea
                id="preparationInstructions"
                value={testForm.preparationInstructions}
                onChange={(e) =>
                  setTestForm({ ...testForm, preparationInstructions: e.target.value })
                }
                placeholder="Instructions for patients before the test..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTest}>
              {editingTest ? "Update Test" : "Add Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Report Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
            <DialogDescription>Upload one or more report files for this patient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-file">Select Files</Label>
              <Input
                id="report-file"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
