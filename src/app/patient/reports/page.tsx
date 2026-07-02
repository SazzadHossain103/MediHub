"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
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
import { useAuthStore } from "@/src/store/useAuthStore"
import { toast } from "@/src/hooks/use-toast"
import {
  Search,
  FileText,
  Eye,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Plus,
  Upload,
  Trash2,
  Edit2,
} from "lucide-react"

type Report = {
  _id: string
  name: string
  date: string
  lab: string | null
  status: "ready" | "processing"
  category: string
  doctor: string | null
  results: Array<{
    parameter: string
    value: string
    unit: string
    range: string
    status: "normal" | "high" | "low"
  }>
  fileUrl: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export default function ReportsPage() {
  const { token } = useAuthStore()
  const authToken = token

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [allReports, setAllReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    reportName: "",
    hospitalName: "",
    doctorName: "",
    testType: "",
    file: null as File | null,
    notes: "",
  })

  // Load reports on mount
  useEffect(() => {
    if (authToken) {
      loadReports()
    }
  }, [authToken])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/patient/reports", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to load reports")
      }

      setAllReports(data.reports || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReport = async () => {
    if (!formData.reportName || !formData.testType || !formData.file) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const fileData = e.target?.result as string
          const fileName = formData.file!.name

          const response = await fetch("/api/patient/reports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              name: formData.reportName,
              category: formData.testType,
              date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
              lab: formData.hospitalName || null,
              doctor: formData.doctorName || null,
              status: "ready",
              fileData,
              fileName,
              results: [],
              notes: formData.notes || null,
            }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.message || "Failed to upload report")
          }

          setAllReports([data.report, ...allReports])
          setFormData({ reportName: "", hospitalName: "", doctorName: "", testType: "", file: null, notes: "" })
          setIsAddOpen(false)
          toast({
            title: "Success",
            description: "Report uploaded successfully",
          })
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
        } finally {
          setIsSaving(false)
        }
      }
      reader.readAsDataURL(formData.file)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  const handleUpdateReport = async () => {
    if (!selectedReport) return

    try {
      setIsSaving(true)
      let fileData: string | undefined
      let fileName: string | undefined

      if (formData.file) {
        const reader = new FileReader()
        fileData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(formData.file!)
        })
        fileName = formData.file.name
      }

      const response = await fetch(`/api/patient/reports?id=${selectedReport._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.reportName || selectedReport.name,
          category: formData.testType || selectedReport.category,
          date: selectedReport.date,
          lab: formData.hospitalName || selectedReport.lab,
          doctor: formData.doctorName || selectedReport.doctor,
          results: selectedReport.results,
          notes: formData.notes || selectedReport.notes,
          fileData,
          fileName,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to update report")
      }

      setAllReports(allReports.map((r) => (r._id === selectedReport._id ? data.report : r)))
      setIsEditOpen(false)
      setFormData({ reportName: "", hospitalName: "", doctorName: "", testType: "", file: null, notes: "" })
      toast({
        title: "Success",
        description: "Report updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/patient/reports?id=${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete report")
      }

      setAllReports(allReports.filter((r) => r._id !== reportId))
      toast({
        title: "Success",
        description: "Report deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setFormData({
      reportName: report.name,
      hospitalName: report.lab || "",
      doctorName: report.doctor || "",
      testType: report.category,
      file: null,
      notes: report.notes || "",
    })
    setIsEditOpen(true)
  }

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
          <p className="text-muted-foreground">View and manage your medical test reports</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Badge variant="outline" className="gap-1 text-secondary w-fit">
            <Shield className="h-3 w-3" />
            Secure Storage
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
              <p className="text-2xl font-bold">{allReports.length}</p>
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
                <SelectItem value="Pathology">Pathology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
              Loading reports...
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No reports found</p>
              <Button onClick={() => setIsAddOpen(true)} className="mt-4" variant="outline">
                Add your first report
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report._id}>
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
                        {report.lab && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {report.lab}
                          </span>
                        )}
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
                        <Button variant="outline" size="sm" onClick={() => handleEditReport(report)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReport(report._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              {selectedReport?.date} {selectedReport?.lab && `| ${selectedReport.lab}`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4 h-[calc(90vh-180px)]">
            <div className="space-y-6 py-4">
              {/* File Viewer */}
              {selectedReport && selectedReport.fileUrl ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-muted bg-muted/30 p-4">
                    {selectedReport.fileUrl.includes("pdf") ? (
                      <iframe
                        src={selectedReport.fileUrl}
                        className="w-full h-[600px] rounded border"
                        title="PDF Report"
                      />
                    ) : (
                      <img
                        src={selectedReport.fileUrl}
                        alt="Report"
                        className="w-full h-auto rounded border object-contain max-h-[600px]"
                      />
                    )}
                  </div>
                </div>
              ) : null}

              {/* Report Header */}
              <Card className="bg-muted/30">
                <CardContent className="grid gap-4 p-4 md:grid-cols-2">
                  {selectedReport?.doctor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ordered By</p>
                      <p className="font-medium">{selectedReport.doctor}</p>
                    </div>
                  )}
                  {selectedReport?.lab && (
                    <div>
                      <p className="text-sm text-muted-foreground">Laboratory</p>
                      <p className="font-medium">{selectedReport.lab}</p>
                    </div>
                  )}
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
              {selectedReport && selectedReport.results && selectedReport.results.length > 0 && (
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
                    {selectedReport.results.map((result, index) => (
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
              )}

              {/* Notes */}
              {selectedReport?.notes && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedReport.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Verification Badge */}
              <Card className="border-secondary/30 bg-secondary/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <Shield className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-semibold text-secondary">Secure Storage</p>
                    <p className="text-sm text-muted-foreground">This report is securely stored on Cloudinary.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Report Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Test Report</DialogTitle>
            <DialogDescription>Upload your medical test report with the required information</DialogDescription>
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
              <Label htmlFor="hospital-name">Hospital/Lab Name</Label>
              <Input
                id="hospital-name"
                placeholder="e.g., Square Hospital Diagnostics"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor-name">Doctor Name</Label>
              <Input
                id="doctor-name"
                placeholder="e.g., Dr. Sarah Ahmed"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
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
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
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
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReport} disabled={isSaving}>
              {isSaving ? "Uploading..." : "Upload Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>Update your report information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-report-name">Report Name *</Label>
              <Input
                id="edit-report-name"
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-hospital-name">Hospital/Lab Name</Label>
              <Input
                id="edit-hospital-name"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-doctor-name">Doctor Name</Label>
              <Input
                id="edit-doctor-name"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-test-type">Test Type *</Label>
              <Select value={formData.testType} onValueChange={(value) => setFormData({ ...formData, testType: value })}>
                <SelectTrigger id="edit-test-type">
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
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-file-upload">Update File (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="edit-file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {formData.file ? formData.file.name : "Click to upload new file"}
                    </p>
                  </div>
                  <input
                    id="edit-file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReport} disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
