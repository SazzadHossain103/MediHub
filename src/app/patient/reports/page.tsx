"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  Share2,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Printer,
  Shield,
  Plus,
  Upload,
} from "lucide-react"

const demoReportImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/312437349_619671059942455_965027182600412432_n-08Az34O7fyakzXi3xpGA653o67slpm.jpg"

type Report = {
  id: number
  name: string
  date: string
  lab: string
  status: "ready" | "processing"
  category: string
  doctor: string
  results: Array<{
    parameter: string
    value: string
    unit: string
    range: string
    status: "normal" | "high" | "low"
  }>
  fileUrl: string | null
}

const testReports: Report[] = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    date: "Apr 28, 2026",
    lab: "Square Hospital Diagnostics",
    status: "ready",
    category: "Blood Test",
    doctor: "Dr. Sarah Ahmed",
    results: [
      { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5", status: "normal" },
      { parameter: "WBC Count", value: "7,500", unit: "/mcL", range: "4,500-11,000", status: "normal" },
      { parameter: "RBC Count", value: "5.1", unit: "million/mcL", range: "4.5-5.5", status: "normal" },
      { parameter: "Platelet Count", value: "250,000", unit: "/mcL", range: "150,000-400,000", status: "normal" },
      { parameter: "Hematocrit", value: "42", unit: "%", range: "38.8-50", status: "normal" },
    ],
    fileUrl: demoReportImage,
  },
  {
    id: 2,
    name: "Lipid Profile",
    date: "Apr 25, 2026",
    lab: "Labaid Diagnostics",
    status: "ready",
    category: "Blood Test",
    doctor: "Dr. Sarah Ahmed",
    results: [
      { parameter: "Total Cholesterol", value: "195", unit: "mg/dL", range: "<200", status: "normal" },
      { parameter: "LDL Cholesterol", value: "118", unit: "mg/dL", range: "<100", status: "high" },
      { parameter: "HDL Cholesterol", value: "52", unit: "mg/dL", range: ">40", status: "normal" },
      { parameter: "Triglycerides", value: "145", unit: "mg/dL", range: "<150", status: "normal" },
      { parameter: "VLDL Cholesterol", value: "29", unit: "mg/dL", range: "<30", status: "normal" },
    ],
    fileUrl: demoReportImage,
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    date: "Apr 30, 2026",
    lab: "Popular Diagnostics",
    status: "processing",
    category: "Hormone Test",
    doctor: "Dr. Fatima Begum",
    results: [],
    fileUrl: null as string | null,
  },
  {
    id: 4,
    name: "HbA1c",
    date: "Apr 20, 2026",
    lab: "Square Hospital Diagnostics",
    status: "ready",
    category: "Blood Test",
    doctor: "Dr. Sarah Ahmed",
    results: [
      { parameter: "HbA1c", value: "6.8", unit: "%", range: "<7.0", status: "normal" },
      { parameter: "Estimated Average Glucose", value: "148", unit: "mg/dL", range: "-", status: "normal" },
    ],
    fileUrl: demoReportImage,
  },
  {
    id: 5,
    name: "Liver Function Test",
    date: "Mar 15, 2026",
    lab: "United Hospital Lab",
    status: "ready",
    category: "Blood Test",
    doctor: "Dr. Karim Uddin",
    results: [
      { parameter: "ALT (SGPT)", value: "28", unit: "U/L", range: "7-56", status: "normal" },
      { parameter: "AST (SGOT)", value: "25", unit: "U/L", range: "10-40", status: "normal" },
      { parameter: "ALP", value: "68", unit: "U/L", range: "44-147", status: "normal" },
      { parameter: "Total Bilirubin", value: "0.8", unit: "mg/dL", range: "0.1-1.2", status: "normal" },
      { parameter: "Albumin", value: "4.2", unit: "g/dL", range: "3.5-5.0", status: "normal" },
    ],
    fileUrl: null as string | null,
  },
  {
    id: 6,
    name: "Chest X-Ray",
    date: "Feb 28, 2026",
    lab: "Apollo Hospital Imaging",
    status: "ready",
    category: "Imaging",
    doctor: "Dr. Rahim Khan",
    results: [
      { parameter: "Findings", value: "Normal chest radiograph", unit: "-", range: "-", status: "normal" },
    ],
    fileUrl: demoReportImage,
  },
]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [allReports, setAllReports] = useState(testReports)
  const [formData, setFormData] = useState({
    reportName: "",
    hospitalName: "",
    testType: "",
    file: null as File | null,
  })

  const filteredReports = allReports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || report.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const readyReports = allReports.filter((r) => r.status === "ready")
  const processingReports = allReports.filter((r) => r.status === "processing")

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewOpen(true)
  }

  const handleAddReport = () => {
    if (!formData.reportName || !formData.hospitalName || !formData.testType || !formData.file) {
      alert("Please fill in all fields")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string
      const newReport = {
        id: allReports.length + 1,
        name: formData.reportName,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        lab: formData.hospitalName,
        status: "ready" as const,
        category: formData.testType,
        doctor: "User Uploaded",
        results: [],
        fileUrl: fileUrl,
      }

      setAllReports([newReport, ...allReports])
      setFormData({ reportName: "", hospitalName: "", testType: "", file: null })
      setIsAddOpen(false)
    }
    reader.readAsDataURL(formData.file)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "high":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-amber-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Test Reports</h1>
          <p className="text-muted-foreground">
            View and download your medical test reports
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Badge variant="outline" className="gap-1 text-secondary w-fit">
            <Shield className="h-3 w-3" />
            Verified Reports
          </Badge>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readyReports.length}</p>
              <p className="text-sm text-muted-foreground">Reports Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processingReports.length}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{testReports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Blood Test">Blood Tests</SelectItem>
                <SelectItem value="Hormone Test">Hormone Tests</SelectItem>
                <SelectItem value="Imaging">Imaging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      report.status === "ready" ? "bg-secondary/10" : "bg-amber-100"
                    }`}
                  >
                    <FileText
                      className={`h-6 w-6 ${
                        report.status === "ready" ? "text-secondary" : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {report.lab}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{report.category}</Badge>
                      <Badge
                        variant={report.status === "ready" ? "default" : "secondary"}
                        className={
                          report.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {report.status === "ready" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {report.status === "ready" ? "Ready" : "Processing"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.status === "ready" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      {/* <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button> */}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              {selectedReport?.date} | {selectedReport?.lab}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4 h-[calc(90vh-180px)]">
            <div className="space-y-6 py-4">
              {/* File Viewer - Show image if fileUrl exists */}
              {selectedReport && selectedReport.fileUrl && selectedReport.fileUrl.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-muted bg-muted/30 p-4">
                    {selectedReport.fileUrl.startsWith("data:application/pdf") ? (
                      <iframe
                        src={selectedReport.fileUrl}
                        className="w-full h-[600px] rounded border"
                        title="PDF Report"
                      />
                    ) : (
                      <img
                        src={selectedReport.fileUrl}
                        alt="Report"
                        className="w-full h-auto rounded border object-contain"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Report Header */}
                  <Card className="bg-muted/30">
                    <CardContent className="grid gap-4 p-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Ordered By</p>
                        <p className="font-medium">{selectedReport?.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Laboratory</p>
                        <p className="font-medium">{selectedReport?.lab}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Report Date</p>
                        <p className="font-medium">{selectedReport?.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedReport?.category}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Table */}
                  <div>
                    <h3 className="mb-4 font-semibold">Test Results</h3>
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-3 text-sm font-medium">
                        <span>Parameter</span>
                        <span>Value</span>
                        <span>Unit</span>
                        <span>Reference Range</span>
                        <span>Status</span>
                      </div>
                      {selectedReport?.results.map((result, index) => (
                        <div
                          key={index}
                          className={`grid grid-cols-5 gap-4 p-3 text-sm ${
                            index !== selectedReport.results.length - 1 ? "border-b" : ""
                          } ${result.status !== "normal" ? "bg-red-50/50" : ""}`}
                        >
                          <span className="font-medium">{result.parameter}</span>
                          <span
                            className={`font-semibold ${
                              result.status === "high"
                                ? "text-red-600"
                                : result.status === "low"
                                ? "text-amber-600"
                                : ""
                            }`}
                          >
                            {result.value}
                          </span>
                          <span className="text-muted-foreground">{result.unit}</span>
                          <span className="text-muted-foreground">{result.range}</span>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(result.status)}
                            <span
                              className={`capitalize ${
                                result.status === "high"
                                  ? "text-red-600"
                                  : result.status === "low"
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {result.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <Card className="border-secondary/30 bg-secondary/5">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Shield className="h-6 w-6 text-secondary" />
                      <div>
                        <p className="font-semibold text-secondary">Digitally Verified Report</p>
                        <p className="text-sm text-muted-foreground">
                          This report has been verified by {selectedReport?.lab} and is authentic.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>

        </DialogContent>
      </Dialog>

      {/* Add Report Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Test Report</DialogTitle>
            <DialogDescription>
              Upload your medical test report by providing the required information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name *</Label>
              <Input
                id="report-name"
                placeholder="e.g., Blood Test Results"
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital-name">Hospital/Lab Name *</Label>
              <Input
                id="hospital-name"
                placeholder="e.g., Square Hospital Diagnostics"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-type">Test Type *</Label>
              <Select value={formData.testType} onValueChange={(value) => setFormData({ ...formData, testType: value })}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blood Test">Blood Test</SelectItem>
                  <SelectItem value="Hormone Test">Hormone Test</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Pathology">Pathology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File (PDF, JPG, PNG) *</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReport}>
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
