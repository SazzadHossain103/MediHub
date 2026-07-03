"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"
import { Progress } from "@/src/components/ui/progress"
import { useAuthStore } from "@/src/store/useAuthStore"
import { toast } from "@/src/hooks/use-toast"
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react"

type AppointmentItem = {
  _id: string
  appointmentDate: string
  timeSlot: string
  serialNumber: number
  status: string
  patientNote?: string
  doctorNote?: string
  contactSnapshot: {
    name: string
    phone?: string
    email?: string
  }
  hospitalSnapshot: {
    name?: string
    address?: string
  }
}

interface DateAppointments {
  isOpen: boolean
  maxAppointments: number
  patients: { id: string; serialNo: number }[]
}

interface AppointmentData {
  [date: string]: DateAppointments
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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "confirmed":
      return "secondary"
    case "scheduled":
      return "outline"
    case "no_show":
      return "destructive"
    default:
      return "outline"
  }
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // Appointment settings state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [appointmentData, setAppointmentData] = useState<AppointmentData>(() => {
    const today = new Date().toISOString().split("T")[0]
    return {
      [today]: {
        isOpen: true,
        maxAppointments: 30,
        patients: [],
      },
    }
  })
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  const { user, token, doctorToken } = useAuthStore()
  const authToken = doctorToken || token

  useEffect(() => {
    const loadAppointments = async () => {
      if (!authToken) {
        setError("You must be logged in to view appointments.")
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/appointments", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load appointments")
        }
        setAppointments(data.appointments || [])
      } catch (err: any) {
        setError(err?.message || "Unable to load appointments")
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [authToken])

  // Load appointment settings from backend
  useEffect(() => {
    const loadAppointmentSettings = async () => {
      if (!user?.id || !authToken) {
        setIsLoadingSettings(false)
        return
      }

      setIsLoadingSettings(true)
      setSettingsError(null)

      try {
        const res = await fetch(`/api/doctor/${user.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || data.error || "Unable to fetch appointment settings")
        }

        const today = new Date().toISOString().split("T")[0]
        setAppointmentData((prev) => ({
          ...prev,
          [today]: {
            ...prev[today],
            isOpen: data.doctor.isAppointmentOpen ?? true,
            maxAppointments: data.doctor.maxAppointmentsPerDay ?? 30,
          },
        }))
      } catch (err: any) {
        console.error("Failed to load appointment settings:", err)
      } finally {
        setIsLoadingSettings(false)
      }
    }

    loadAppointmentSettings()
  }, [user?.id, authToken])

  // Get current date's appointment data
  const currentDateData = appointmentData[selectedDate] || {
    isOpen: false,
    maxAppointments: 30,
    patients: [],
  }

  const currentAppointments = currentDateData.patients.length
  const maxAppointments = currentDateData.maxAppointments

  // Update appointment data for selected date
  const updateDateAppointments = (updates: Partial<DateAppointments>) => {
    setAppointmentData((prev) => ({
      ...prev,
      [selectedDate]: {
        ...currentDateData,
        ...updates,
      },
    }))
  }

  const toggleAppointments = () => {
    const newIsOpen = !currentDateData.isOpen
    updateDateAppointments({ isOpen: newIsOpen })
  }

  const handleMaxAppointmentsChange = (value: string) => {
    const max = parseInt(value) || 0
    const updates: Partial<DateAppointments> = { maxAppointments: max }
    // Auto-close if current >= max
    if (currentAppointments >= max && max > 0) {
      updates.isOpen = false
    }
    updateDateAppointments(updates)
  }

  const handleSaveAppointmentSettings = async () => {
    if (!user?.id || !authToken) {
      setSettingsError("Authentication required to save appointment settings.")
      return
    }

    setSettingsError(null)
    setIsSavingSettings(true)

    try {
      const res = await fetch(`/api/doctor/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          isAppointmentOpen: currentDateData.isOpen,
          maxAppointmentsPerDay: currentDateData.maxAppointments,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to save appointment settings")
      }

      toast({
        title: "Appointment settings saved",
        description: "Your appointment availability and daily limit have been updated.",
      })
    } catch (err: any) {
      setSettingsError(err?.message || "Could not save appointment settings")
    } finally {
      setIsSavingSettings(false)
    }
  }

  const now = new Date()
  const todayAppointments = appointments
    .filter((apt) => {
      const appointmentDate = new Date(apt.appointmentDate)
      return (
        appointmentDate.getDate() === now.getDate() &&
        appointmentDate.getMonth() === now.getMonth() &&
        appointmentDate.getFullYear() === now.getFullYear()
      )
    })
    .sort((a, b) => a.serialNumber - b.serialNumber)

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const completedAppointments = appointments
    .filter((apt) => apt.status === "completed")
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const handleMarkComplete = async (id: string) => {
    if (!authToken) return

    setUpdatingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: "completed",
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update appointment")
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, status: "completed" } : apt
        )
      )
    } catch (err: any) {
      setError(err?.message || "Failed to update appointment")
    } finally {
      setUpdatingId(null)
    }
  }

  const AppointmentCard = ({ apt, showMarkComplete = false }: { apt: AppointmentItem; showMarkComplete?: boolean }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{apt.contactSnapshot.name}</h3>
              <Badge variant={getStatusBadgeVariant(apt.status)}>
                {apt.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatAppointmentDate(apt.appointmentDate)} at {apt.timeSlot}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{apt.contactSnapshot.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{apt.contactSnapshot.email || "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">Serial Number</div>
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-lg font-bold text-primary">
              {apt.serialNumber}
            </div>
          </div>
        </div>

        {(apt.patientNote || apt.doctorNote) && (
          <div className="mt-4 pt-4 border-t space-y-2">
            {apt.patientNote && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Patient Note</p>
                <p className="text-sm">{apt.patientNote}</p>
              </div>
            )}
            {apt.doctorNote && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Doctor Note</p>
                <p className="text-sm">{apt.doctorNote}</p>
              </div>
            )}
          </div>
        )}

        {showMarkComplete && apt.status !== "completed" && (
          <Button
            onClick={() => handleMarkComplete(apt._id)}
            disabled={updatingId === apt._id}
            className="mt-4 w-full"
            size="sm"
          >
            <Check className="mr-2 h-4 w-4" />
            {updatingId === apt._id ? "Updating..." : "Mark as Completed"}
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Appointments</h1>
          <p className="text-muted-foreground">View and manage your appointments</p>
        </div>
      </div>

      {/* Appointment Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Appointment Settings
          </CardTitle>
          <CardDescription>Manage appointments for the selected date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingSettings && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading appointment settings...
            </div>
          )}
          {!isLoadingSettings && (
            <>
              {/* Date Picker */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Label htmlFor="date" className="whitespace-nowrap">
                  Select Date:
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>

              {/* Appointment Controls */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    id="appointments-toggle"
                    checked={currentDateData.isOpen}
                    onCheckedChange={toggleAppointments}
                    disabled={currentAppointments >= maxAppointments && maxAppointments > 0}
                  />
                  <Label htmlFor="appointments-toggle" className="cursor-pointer">
                    {currentDateData.isOpen ? (
                      <Badge className="bg-green-600">Open for Appointments</Badge>
                    ) : (
                      <Badge variant="secondary">Closed for Appointments</Badge>
                    )}
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="max-appointments" className="whitespace-nowrap">
                    Max Appointments:
                  </Label>
                  <Input
                    id="max-appointments"
                    type="number"
                    min="0"
                    value={maxAppointments}
                    onChange={(e) => handleMaxAppointmentsChange(e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Appointment Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Appointments Filled</span>
                  <span className="font-semibold">
                    {currentAppointments} / {maxAppointments}
                  </span>
                </div>
                <Progress
                  value={maxAppointments > 0 ? (currentAppointments / maxAppointments) * 100 : 0}
                  className="h-2"
                />
                {currentAppointments >= maxAppointments && maxAppointments > 0 && (
                  <p className="text-sm text-destructive">
                    Maximum appointments reached. Appointments automatically closed.
                  </p>
                )}
              </div>

              {settingsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {settingsError}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveAppointmentSettings}
                  disabled={isSavingSettings || !authToken}
                >
                  {isSavingSettings ? "Saving..." : "Save Appointment Settings"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">
            Today
            <Badge variant="secondary" className="ml-2">
              {todayAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming
            <Badge variant="secondary" className="ml-2">
              {upcomingAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {completedAppointments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6 space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                Loading appointments…
              </CardContent>
            </Card>
          ) : todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No appointments scheduled for today.</p>
              </CardContent>
            </Card>
          ) : (
            todayAppointments.map((apt) => (
              <AppointmentCard key={apt._id} apt={apt} showMarkComplete={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                Loading appointments…
              </CardContent>
            </Card>
          ) : upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No upcoming appointments.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt._id} apt={apt} showMarkComplete={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                Loading appointments…
              </CardContent>
            </Card>
          ) : completedAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No completed appointments yet.</p>
              </CardContent>
            </Card>
          ) : (
            completedAppointments.map((apt) => (
              <AppointmentCard key={apt._id} apt={apt} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
