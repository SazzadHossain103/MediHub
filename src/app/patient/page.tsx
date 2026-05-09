"use client ";

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

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    hospital: "Square Hospital",
    date: "May 5, 2026",
    time: "10:30 AM",
    status: "confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Rahim Khan",
    specialty: "General Physician",
    hospital: "United Hospital",
    date: "May 8, 2026",
    time: "2:00 PM",
    status: "pending",
  },
]

const recentReports = [
  {
    id: 1,
    name: "Complete Blood Count",
    date: "Apr 28, 2026",
    status: "ready",
  },
  {
    id: 2,
    name: "Lipid Profile",
    date: "Apr 25, 2026",
    status: "ready",
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    date: "Apr 30, 2026",
    status: "processing",
  },
]

const medications = [
  { name: "Metformin 500mg", dosage: "Twice daily", remaining: 15 },
  { name: "Lisinopril 10mg", dosage: "Once daily", remaining: 22 },
  { name: "Aspirin 75mg", dosage: "Once daily", remaining: 8 },
]

export default function DashboardPage() {
  // const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Welcome back, John
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: May 5, 2026</p>
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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 pending report</p>
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 refill needed soon</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-4">
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
        </Card>
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
              <Link href="/dashboard/appointments">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-start justify-between rounded-lg border border-border bg-muted/30 p-4"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{apt.doctor}</h4>
                    <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{apt.hospital}</span>
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
                  <p className="mt-2 text-sm font-medium">{apt.date}</p>
                  <p className="text-xs text-muted-foreground">{apt.time}</p>
                </div>
              </div>
            ))}
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
            {recentReports.map((report) => (
              <div
                key={report.id}
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
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                {report.status === "ready" ? (
                  <Button size="sm" variant="outline">
                    View Report
                  </Button>
                ) : (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    <Clock className="mr-1 h-3 w-3" />
                    Processing
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Track your prescriptions and refills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10">
                    <Pill className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                </div>
                <div className="text-right">
                  {med.remaining < 10 ? (
                    <Badge variant="destructive" className="mb-1">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mb-1 bg-secondary/10 text-secondary">
                      In Stock
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {med.remaining} pills left
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used services</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              asChild
            >
              <Link href="/patient/hospitals">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Find Hospital</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              asChild
            >
              <Link href="/patient/tests">
                <TestTube className="h-6 w-6 text-secondary" />
                <span>Book Test</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              asChild
            >
              <Link href="/patient/appointments">
                <Calendar className="h-6 w-6 text-chart-3" />
                <span>Appointments</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              asChild
            >
              <Link href="/patient/profile">
                <FileText className="h-6 w-6 text-chart-4" />
                <span>My Profile</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
