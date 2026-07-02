"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  FileText,
  TestTube,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Activity,
  Pill,
  Stethoscope,
} from "lucide-react"

import { useAuthStore } from "./../../store/useAuthStore";

type AppointmentOverview = {
  _id: string
  appointmentDate: string
  timeSlot: string
  status: string
  doctorSnapshot: {
    name: string
    specialty?: string
  }
  hospitalSnapshot: {
    name?: string
  }
}

type ReportOverview = {
  _id: string
  name: string
  date: string
  status: "ready" | "processing"
  category?: string
  createdAt?: string
}

type MedicationOverview = {
  _id: string
  name: string
  dosage?: string | null
  prescribedBy?: string | null
  startDate?: string | null
  stockStatus?: string | null
}

const formatAppointmentDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const formatReportDate = (dateString?: string) => {
  if (!dateString) return "Recently added"

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [appointments, setAppointments] = useState<AppointmentOverview[]>([])
  const [reports, setReports] = useState<ReportOverview[]>([])
  const [medications, setMedications] = useState<MedicationOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)
  const [medicationsLoading, setMedicationsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportsError, setReportsError] = useState<string | null>(null)
  const [medicationsError, setMedicationsError] = useState<string | null>(null)

  useEffect(() => {
    const loadAppointments = async () => {
      if (!token) {
        setError("Please log in to see your appointments.")
        setAppointments([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.message || "Unable to load appointments")
        }

        setAppointments(data.appointments || [])
      } catch (err: any) {
        setError(err?.message || "Unable to load appointments")
        setAppointments([])
      } finally {
        setIsLoading(false)
      }
    }

    const loadReports = async () => {
      if (!token) {
        setReports([])
        setReportsLoading(false)
        setReportsError("Please log in to see your reports.")
        return
      }

      setReportsLoading(true)
      setReportsError(null)

      try {
        const res = await fetch("/api/patient/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.message || "Unable to load reports")
        }

        setReports((data.reports || []).slice(0, 3))
      } catch (err: any) {
        setReports([])
        setReportsError(err?.message || "Unable to load reports")
      } finally {
        setReportsLoading(false)
      }
    }

    const loadMedications = async () => {
      if (!token) {
        setMedications([])
        setMedicationsLoading(false)
        setMedicationsError("Please log in to see your medications.")
        return
      }

      setMedicationsLoading(true)
      setMedicationsError(null)

      try {
        const res = await fetch("/api/patient/medications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.message || "Unable to load medications")
        }

        setMedications(data.medications || [])
      } catch (err: any) {
        setMedications([])
        setMedicationsError(err?.message || "Unable to load medications")
      } finally {
        setMedicationsLoading(false)
      }
    }

    loadAppointments()
    loadReports()
    loadMedications()
  }, [token])

  const now = new Date()
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.appointmentDate) >= now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const upcomingCount = upcomingAppointments.length
  const nextAppointment = upcomingAppointments[0]
  const readyReportsCount = reports.filter((report) => report.status === "ready").length
  const processingReportsCount = reports.filter((report) => report.status === "processing").length

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your health dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/patient/hospitals">
              <MapPin className="mr-2 h-4 w-4" />
              Find Hospitals
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/patient/tests">
              <TestTube className="mr-2 h-4 w-4" />
              Book Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "—" : upcomingCount}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading next appointment..."
                : nextAppointment
                ? `Next: ${formatAppointmentDate(nextAppointment.appointmentDate)}`
                : "No upcoming appointments"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Test Reports Ready
            </CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsLoading ? "—" : readyReportsCount}</div>
            <p className="text-xs text-muted-foreground">
              {reportsLoading
                ? "Loading reports..."
                : `${processingReportsCount} pending report${processingReportsCount === 1 ? "" : "s"}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Medications
            </CardTitle>
            <Pill className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {medicationsLoading ? "—" : medications.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {medicationsLoading
                ? "Loading medications..."
                : medications.length === 0
                ? "No active medications"
                : `${medications.filter((med) => med.stockStatus === "Out of stock").length} out of stock`}
            </p>
          </CardContent>
        </Card>
        {/* <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Score
            </CardTitle>
            <Activity className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <p className="text-xs text-muted-foreground">Good health status</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled doctor visits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patient/appointments">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  Loading appointments…
                </CardContent>
              </Card>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  No upcoming appointments found.
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-start justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{apt.doctorSnapshot.name}</h4>
                      <p className="text-sm text-muted-foreground">{apt.doctorSnapshot.specialty || "Doctor"}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{apt.hospitalSnapshot.name || "Hospital"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={apt.status === "confirmed" ? "default" : "secondary"}
                      className={apt.status === "confirmed" ? "bg-secondary text-secondary-foreground" : ""}
                    >
                      {apt.status === "confirmed" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {apt.status}
                    </Badge>
                    <p className="mt-2 text-sm font-medium">{formatAppointmentDate(apt.appointmentDate)}</p>
                    <p className="text-xs text-muted-foreground">{apt.timeSlot}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Test Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Test Reports</CardTitle>
              <CardDescription>Your medical test results</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patient/reports">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportsLoading ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Loading recent reports…
              </div>
            ) : reportsError ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                {reportsError}
              </div>
            ) : reports.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No test reports found yet.
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        report.status === "ready"
                          ? "bg-secondary/10"
                          : "bg-amber-100"
                      }`}
                    >
                      <FileText
                        className={`h-5 w-5 ${
                          report.status === "ready"
                            ? "text-secondary"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatReportDate(report.date || report.createdAt)}
                      </p>
                    </div>
                  </div>
                  {report.status === "ready" ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/patient/reports">View Report</Link>
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      <Clock className="mr-1 h-3 w-3" />
                      Processing
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Track your prescriptions and refills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicationsLoading ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                Loading medications...
              </div>
            ) : medications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                No medications found. Add them from your profile.
              </div>
            ) : (
              <div className="space-y-3">
                {medications.slice(0, 3).map((medication) => (
                  <div
                    key={medication._id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10">
                        <Pill className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-muted-foreground">{medication.dosage || "No dosage specified"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={medication.stockStatus === "Out of stock" ? "destructive" : "secondary"}
                        className={medication.stockStatus === "Out of stock" ? "mb-1" : "mb-1 bg-secondary/10 text-secondary"}
                      >
                        {medication.stockStatus || "In stock"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {medication.startDate ? `Updated ${medication.startDate}` : "No update date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
