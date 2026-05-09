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
} from "lucide-react"

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    hospital: "Square Hospital",
    address: "18/F, West Panthapath",
    date: "May 5, 2026",
    time: "10:30 AM",
    type: "in-person",
    status: "confirmed",
    avatar: "/placeholder-doctor.jpg",
  },
  {
    id: 2,
    doctor: "Dr. Rahim Khan",
    specialty: "General Physician",
    hospital: "United Hospital",
    address: "Plot 15, Road 71, Gulshan-2",
    date: "May 8, 2026",
    time: "2:00 PM",
    type: "video",
    status: "pending",
    avatar: "/placeholder-doctor.jpg",
  },
  {
    id: 3,
    doctor: "Dr. Fatima Begum",
    specialty: "Endocrinologist",
    hospital: "Labaid Hospital",
    address: "House 1, Road 4, Dhanmondi",
    date: "May 12, 2026",
    time: "11:00 AM",
    type: "in-person",
    status: "confirmed",
    avatar: "/placeholder-doctor.jpg",
  },
]

const pastAppointments = [
  {
    id: 4,
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    hospital: "Square Hospital",
    date: "Apr 15, 2026",
    time: "10:00 AM",
    type: "in-person",
    status: "completed",
    notes: "Routine checkup. Blood pressure normal. Continue current medication.",
  },
  {
    id: 5,
    doctor: "Dr. Karim Uddin",
    specialty: "Gastroenterologist",
    hospital: "United Hospital",
    date: "Mar 28, 2026",
    time: "3:30 PM",
    type: "video",
    status: "completed",
    notes: "Follow-up for gastritis. Symptoms improved. Dietary changes recommended.",
  },
  {
    id: 6,
    doctor: "Dr. Nusrat Jahan",
    specialty: "Dermatologist",
    hospital: "Apollo Hospital",
    date: "Feb 10, 2026",
    time: "9:00 AM",
    type: "in-person",
    status: "cancelled",
    notes: "Patient cancelled due to scheduling conflict.",
  },
]

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
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
              {upcomingAppointments.map((apt) => (
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
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <Badge
                              variant={apt.type === "video" ? "secondary" : "outline"}
                              className={apt.type === "video" ? "bg-secondary/20 text-secondary" : ""}
                            >
                              {apt.type === "video" ? (
                                <Video className="mr-1 h-3 w-3" />
                              ) : (
                                <Stethoscope className="mr-1 h-3 w-3" />
                              )}
                              {apt.type === "video" ? "Video Call" : "In-Person"}
                            </Badge>
                            <Badge
                              variant={apt.status === "confirmed" ? "default" : "secondary"}
                              className={
                                apt.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }
                            >
                              {apt.status === "confirmed" ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertCircle className="mr-1 h-3 w-3" />
                              )}
                              {apt.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apt.date}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{apt.hospital}</p>
                        <p className="text-sm text-muted-foreground">{apt.address}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {apt.type === "video" && apt.status === "confirmed" && (
                        <Button className="bg-secondary hover:bg-secondary/90">
                          <Video className="mr-2 h-4 w-4" />
                          Join Video Call
                        </Button>
                      )}
                      <Button variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <Button variant="outline" className="text-destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {pastAppointments.map((apt) => (
                <Card key={apt.id} className={apt.status === "cancelled" ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                        <p className="mt-1 text-sm">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          {apt.hospital}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{apt.date}</p>
                        <p>{apt.time}</p>
                      </div>
                    </div>
                    {apt.notes && (
                      <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm">
                          <span className="font-medium">Notes: </span>
                          {apt.notes}
                        </p>
                      </div>
                    )}
                    {apt.status === "completed" && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Book Follow-up
                        </Button>
                      </div>
                    )}
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
