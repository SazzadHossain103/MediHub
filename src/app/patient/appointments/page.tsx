"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Calendar } from "@/src/components/ui/calendar"
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Stethoscope,
  Mail,
} from "lucide-react"

const initialUpcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    hospital: "Square Hospital",
    address: "18/F, West Panthapath",
    date: "May 5, 2026",
    serialNumber: 16,
    phone: "+8801545682137",
    email: "dr.sarah@gmail.com",
    avatar: "/placeholder-doctor.jpg",
  },
  {
    id: 2,
    doctor: "Dr. Rahim Khan",
    specialty: "General Physician",
    hospital: "United Hospital",
    address: "Plot 15, Road 71, Gulshan-2",
    date: "May 8, 2026",
    serialNumber: 24,
    phone: "+8801712345678",
    email: "dr.rahim@gmail.com",
    avatar: "/placeholder-doctor.jpg",
  },
  {
    id: 3,
    doctor: "Dr. Fatima Begum",
    specialty: "Endocrinologist",
    hospital: "Labaid Hospital",
    address: "House 1, Road 4, Dhanmondi",
    date: "May 12, 2026",
    serialNumber: 5,
    phone: "+8801819283746",
    email: "dr.fatima@gmail.com",
    avatar: "/placeholder-doctor.jpg",
  },
]

const initialPastAppointments = [
  {
    id: 4,
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    hospital: "Square Hospital",
    address: "18/F, West Panthapath",
    date: "Apr 15, 2026",
    serialNumber: 12,
    phone: "+8801545682137",
    email: "dr.sarah@gmail.com",
    avatar: "/placeholder-doctor.jpg",
    status: "completed",
  },
  {
    id: 5,
    doctor: "Dr. Karim Uddin",
    specialty: "Gastroenterologist",
    hospital: "United Hospital",
    address: "Plot 15, Road 71, Gulshan-2",
    date: "Mar 28, 2026",
    serialNumber: 8,
    phone: "+8801987654321",
    email: "dr.karim@gmail.com",
    avatar: "/placeholder-doctor.jpg",
    status: "completed",
  },
  {
    id: 6,
    doctor: "Dr. Nusrat Jahan",
    specialty: "Dermatologist",
    hospital: "Apollo Hospital",
    address: "Block E, Bashundhara R/A",
    date: "Feb 10, 2026",
    serialNumber: 2,
    phone: "+8801654321987",
    email: "dr.nusrat@gmail.com",
    avatar: "/placeholder-doctor.jpg",
    status: "cancelled",
  },
]

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [upcomingAppointments, setUpcomingAppointments] = useState(initialUpcomingAppointments)
  const [pastApts, setPastApts] = useState(initialPastAppointments)
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null)

  const handleCancel = (id: number) => {
    const aptToCancel = upcomingAppointments.find((apt) => apt.id === id)
    if (aptToCancel) {
      setUpcomingAppointments(upcomingAppointments.filter((apt) => apt.id !== id))
      setPastApts([
        {
          id: aptToCancel.id,
          doctor: aptToCancel.doctor,
          specialty: aptToCancel.specialty,
          hospital: aptToCancel.hospital,
          address: aptToCancel.address,
          date: aptToCancel.date,
          serialNumber: aptToCancel.serialNumber,
          phone: aptToCancel.phone,
          email: aptToCancel.email,
          avatar: aptToCancel.avatar,
          status: "cancelled",
        },
        ...pastApts,
      ])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your doctor appointments and consultations
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming
                <Badge variant="secondary" className="ml-2">
                  {upcomingAppointments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-muted-foreground">No upcoming appointments.</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingAppointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={apt.avatar} alt={apt.doctor} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {apt.doctor
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{apt.doctor}</h3>
                            <p className="text-sm text-muted-foreground">{apt.specialty}</p>
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
                            <span className="font-medium">{apt.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{apt.hospital}</p>
                            <p className="text-sm text-muted-foreground">{apt.address}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:gap-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{apt.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{apt.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {appointmentToCancel === apt.id ? (
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border">
                            <span className="text-sm font-medium text-muted-foreground mr-2">Are you sure?</span>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="h-8 px-3"
                              onClick={() => {
                                handleCancel(apt.id)
                                setAppointmentToCancel(null)
                              }}
                            >
                              Yes
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-3"
                              onClick={() => setAppointmentToCancel(null)}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" className="text-destructive" onClick={() => setAppointmentToCancel(apt.id)}>
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
              {pastApts.map((apt) => (
                <Card key={apt.id} className={apt.status === "cancelled" ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={apt.avatar} alt={apt.doctor} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {apt.doctor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{apt.doctor}</h3>
                            <Badge
                              variant={apt.status === "completed" ? "default" : "destructive"}
                              className={apt.status === "completed" ? "bg-secondary" : ""}
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        {apt.serialNumber && (
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                              Serial No: {apt.serialNumber}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apt.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{apt.hospital}</p>
                          <p className="text-sm text-muted-foreground">{apt.address}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{apt.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{apt.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Calendar */}
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
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-secondary">12</p>
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
