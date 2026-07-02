"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Calendar } from "@/src/components/ui/calendar"
import { useAuthStore } from "@/src/store/useAuthStore"
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  XCircle,
  Mail,
} from "lucide-react"

type AppointmentItem = {
  _id: string
  appointmentDate: string
  timeSlot: string
  serialNumber: number
  status: string
  doctorSnapshot: {
    name: string
    specialty: string
    avatar?: string
    email?: string
    phone?: string
  }
  hospitalSnapshot: {
    name?: string
    address?: string
  }
  contactSnapshot: {
    phone?: string
    email?: string
  }
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

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)
  const [cancellationLoading, setCancellationLoading] = useState<string | null>(null)
  const [cancellationError, setCancellationError] = useState<string | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    const loadAppointments = async () => {
      if (!token) {
        setError("You must be logged in to view appointments.")
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
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [token])

  const now = new Date()
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.appointmentDate) >= now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const pastApts = appointments
    .filter((apt) => new Date(apt.appointmentDate) < now)
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())

  const handleCancel = async (id: string) => {
    if (!token) {
      setCancellationError("You must be logged in to cancel an appointment")
      return
    }

    setCancellationLoading(id)
    setCancellationError(null)

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to cancel appointment")
      }

      // Remove the appointment from the list
      setAppointments((prev) => prev.filter((apt) => apt._id !== id))
      setAppointmentToCancel(null)
    } catch (err: any) {
      setCancellationError(err?.message || "Failed to cancel appointment")
    } finally {
      setCancellationLoading(null)
    }
  }

  const upcomingCount = upcomingAppointments.length
  const yearCount = appointments.filter(
    (apt) => new Date(apt.appointmentDate).getFullYear() === now.getFullYear()
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Appointments</h1>
          <p className="text-muted-foreground">Manage your doctor appointments and consultations</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {error && (
            <Card>
              <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
            </Card>
          )}

          {cancellationError && (
            <Card>
              <CardContent className="p-6 text-sm text-destructive">{cancellationError}</CardContent>
            </Card>
          )}

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming
                <Badge variant="secondary" className="ml-2">
                  {upcomingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

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
                    <p className="text-muted-foreground">No upcoming appointments.</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map((apt) => (
                  <Card key={apt._id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-14 w-14">
                            {apt.doctorSnapshot.avatar ? (
                              <AvatarImage src={apt.doctorSnapshot.avatar} alt={apt.doctorSnapshot.name} />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {apt.doctorSnapshot.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{apt.doctorSnapshot.name}</h3>
                            <p className="text-sm text-muted-foreground">{apt.doctorSnapshot.specialty}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                              Serial No: {apt.serialNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatAppointmentDate(apt.appointmentDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{apt.hospitalSnapshot.name || "Hospital"}</p>
                            <p className="text-sm text-muted-foreground">{apt.hospitalSnapshot.address || "Location not available"}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:gap-6">
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        {appointmentToCancel === apt._id ? (
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border">
                            <span className="text-sm font-medium text-muted-foreground mr-2">Are you sure?</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => handleCancel(apt._id)}
                              disabled={cancellationLoading === apt._id}
                            >
                              {cancellationLoading === apt._id ? "Cancelling..." : "Yes"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => setAppointmentToCancel(null)}
                              disabled={cancellationLoading === apt._id}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="text-destructive" 
                            onClick={() => setAppointmentToCancel(apt._id)}
                            disabled={cancellationLoading !== null}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                    Loading appointments…
                  </CardContent>
                </Card>
              ) : pastApts.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-muted-foreground">No past appointments.</p>
                  </CardContent>
                </Card>
              ) : (
                pastApts.map((apt) => (
                  <Card key={apt._id} className={apt.status === "cancelled" ? "opacity-60" : ""}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-14 w-14">
                            {apt.doctorSnapshot.avatar ? (
                              <AvatarImage src={apt.doctorSnapshot.avatar} alt={apt.doctorSnapshot.name} />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {apt.doctorSnapshot.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{apt.doctorSnapshot.name}</h3>
                              <Badge
                                variant={apt.status === "completed" ? "default" : "destructive"}
                                className={apt.status === "completed" ? "bg-secondary" : ""}
                              >
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{apt.doctorSnapshot.specialty}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                              Serial No: {apt.serialNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatAppointmentDate(apt.appointmentDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{apt.hospitalSnapshot.name || "Hospital"}</p>
                            <p className="text-sm text-muted-foreground">{apt.hospitalSnapshot.address || "Location not available"}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:gap-6">
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
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
              <CardDescription>View your appointment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{upcomingCount}</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-secondary">{yearCount}</p>
                    <p className="text-xs text-muted-foreground">This Year</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
