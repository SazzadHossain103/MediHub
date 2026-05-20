"use client"

import { useEffect, useState } from "react"
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

type DoctorProfile = {
  _id: string
  userId: string
  fullName: string
  avatar?: string | null
  dateOfBirth: string
  gender: string
  contactNumber: string
  email: string
  address: string
  specialization: string
  yearsOfExperience: number
  qualifications: string
  affiliatedHospital: string
  status: string
  maxAppointmentsPerDay: number
  consultationFee: number
  chamberTime: string
  isAppointmentOpen: boolean
}

export default function DoctorDashboardPage() {
  const { user, token, doctorToken } = useAuthStore()
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const authToken = doctorToken || token

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user?.id || !authToken) return

      try {
        const res = await fetch(`/api/doctor/${user.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        const data = await res.json()
        if (!res.ok) {
          setFetchError(data.message || data.error || "Unable to load doctor data")
          return
        }

        setDoctorProfile(data.doctor)
      } catch (error: any) {
        setFetchError(error?.message || "Something went wrong")
      }
    }

    fetchDoctorProfile()
  }, [user?.id, authToken])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* {fetchError ? (
        <Card className="border border-red-200">
          <CardHeader>
            <CardTitle className="text-base text-red-700">Unable to load doctor profile</CardTitle>
            <CardDescription>{fetchError}</CardDescription>
          </CardHeader>
        </Card>
      ) : doctorProfile ? (
        <Card>
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>Loaded from backend using your user ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{doctorProfile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-semibold">{doctorProfile.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">{doctorProfile.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                <p className="font-semibold">{doctorProfile.affiliatedHospital}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{doctorProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{doctorProfile.contactNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>Loading profile data...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Fetching your doctor profile from the backend.</p>
          </CardContent>
        </Card>
      )} */}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Patients Treated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardStats.totalPatientsTreated.toLocaleString()}</p>
          </CardContent>
        </Card> */}

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
            <p className="text-3xl font-bold">{doctorProfile?.maxAppointmentsPerDay}</p>
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
            <p className="text-xl font-semibold">{doctorProfile?.chamberTime}</p>
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
