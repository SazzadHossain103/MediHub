"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Hash,
} from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"

// Mock patient data for today's list
const mockTodayPatients = [
  { id: "p1", serialNo: 1, name: "John Doe", phone: "+880 1712-345678" },
  { id: "p2", serialNo: 2, name: "Sarah Khan", phone: "+880 1812-567890" },
  { id: "p3", serialNo: 3, name: "Rahim Uddin", phone: "+880 1912-234567" },
]

// Mock dashboard stats
const dashboardStats = {
  totalPatientsTreated: 1247,
  todayAppointments: 3,
  maxAppointmentLimit: 30,
  chamberTime: "9:00 AM - 5:00 PM",
}

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Dr. {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Patients Treated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardStats.totalPatientsTreated.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {"Today's Appointments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardStats.todayAppointments}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Max Appointment Limit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardStats.maxAppointmentLimit}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Chamber Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{dashboardStats.chamberTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Patient List Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {"Today's Patient List"}
          </CardTitle>
          <CardDescription>
            Patients scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockTodayPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No patients scheduled for today.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Serial No.</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTodayPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">#{patient.serialNo}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
