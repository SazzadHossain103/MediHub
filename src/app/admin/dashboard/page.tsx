"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
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
import {
  Shield,
  Users,
  Building2,
  LogOut,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import {
  getPatients,
  getHospitals,
  deletePatient,
  deleteHospital,
  updateHospitalStatus,
  type Patient,
  type Hospital,
} from "@/src/lib/mock-data"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "patient" | "hospital"; id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("medihub_admin_logged_in")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    loadData()
  }, [router])

  const loadData = () => {
    setPatients(getPatients())
    setHospitals(getHospitals())
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("medihub_admin_logged_in")
    router.push("/admin/login")
  }

  const openDeleteDialog = (type: "patient" | "hospital", id: string, name: string) => {
    setDeleteTarget({ type, id, name })
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === "patient") {
      deletePatient(deleteTarget.id)
      setPatients(getPatients())
    } else {
      deleteHospital(deleteTarget.id)
      setHospitals(getHospitals())
    }

    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  const handleApproveHospital = (hospitalId: string) => {
    updateHospitalStatus(hospitalId, "approved")
    setHospitals(getHospitals())
  }

  const pendingHospitals = hospitals.filter((h) => h.status === "pending")
  const approvedHospitals = hospitals.filter((h) => h.status === "approved")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/images/medihub-header.png"
                alt="MediHub"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Admin Dashboard</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Hospitals
              </CardTitle>
              <Building2 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hospitals.length}</div>
              <p className="text-xs text-muted-foreground">Registered hospitals</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved Hospitals
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedHospitals.length}</div>
              <p className="text-xs text-muted-foreground">Active on platform</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHospitals.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Patients and Hospitals */}
        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Hospitals
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>All Patients</CardTitle>
                <CardDescription>
                  Manage all registered patients on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients registered yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.registeredAt}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog("patient", patient.id, patient.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals">
            <div className="space-y-6">
              {/* Pending Hospitals */}
              {pendingHospitals.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <CardTitle>Pending Approval</CardTitle>
                    </div>
                    <CardDescription>
                      These hospitals are waiting for your approval to go live
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hospital Name</TableHead>
                          <TableHead>License No.</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingHospitals.map((hospital) => (
                          <TableRow key={hospital.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{hospital.name}</p>
                                <p className="text-sm text-muted-foreground">{hospital.address}</p>
                              </div>
                            </TableCell>
                            <TableCell>{hospital.licenseNumber}</TableCell>
                            <TableCell>{hospital.email}</TableCell>
                            <TableCell>{hospital.registeredAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveHospital(hospital.id)}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openDeleteDialog("hospital", hospital.id, hospital.name)}
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
              )}

              {/* All Hospitals */}
              <Card>
                <CardHeader>
                  <CardTitle>All Hospitals</CardTitle>
                  <CardDescription>
                    Manage all registered hospitals on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hospitals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hospitals registered yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hospital Name</TableHead>
                          <TableHead>License No.</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hospitals.map((hospital) => (
                          <TableRow key={hospital.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{hospital.name}</p>
                                <p className="text-sm text-muted-foreground">{hospital.address}</p>
                              </div>
                            </TableCell>
                            <TableCell>{hospital.licenseNumber}</TableCell>
                            <TableCell>{hospital.email}</TableCell>
                            <TableCell>
                              {hospital.status === "approved" ? (
                                <Badge className="bg-secondary text-secondary-foreground">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{hospital.registeredAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {hospital.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApproveHospital(hospital.id)}
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openDeleteDialog("hospital", hospital.id, hospital.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">{deleteTarget?.name}</span>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
