"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Building2,
  Clock,
  MapPin,
  DollarSign,
  Edit,
} from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"
import { toast } from "@/src/hooks/use-toast"

// Dynamically import map component to avoid SSR issues
const LocationPickerMap = dynamic(() => import("@/src/components/location-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md aspect-[4/3] rounded-xl border border-border bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading map...</span>
        </div>
      </div>
    </div>
  ),
})

// Types
interface ChamberInfo {
  chamberTime: string
  consultationFee: string
  address: string
  location: { lat: number; lng: number }
}

export default function ChamberInfoPage() {
  const { user, token, doctorToken } = useAuthStore()
  const authToken = doctorToken || token

  const [chamberInfo, setChamberInfo] = useState<ChamberInfo>({
    chamberTime: "9:00 AM - 5:00 PM",
    consultationFee: "1000",
    address: "House 45, Road 10, Gulshan-1, Dhaka 1212",
    location: { lat: 23.7937, lng: 90.4147 },
  })
  const [editChamberOpen, setEditChamberOpen] = useState(false)
  const [editChamberForm, setEditChamberForm] = useState<ChamberInfo>(chamberInfo)
  const [editLocation, setEditLocation] = useState(chamberInfo.location)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chamber edit handlers
  useEffect(() => {
    const fetchChamberInfo = async () => {
      if (!user?.id || !authToken) {
        setIsLoading(false)
        return
      }

      setError(null)
      setIsLoading(true)

      try {
        const res = await fetch(`/api/doctor/${user.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || data.error || "Unable to load chamber info")
        }

        const doctor = data.doctor
        setChamberInfo({
          chamberTime: doctor.chamberTime || "9:00 AM - 5:00 PM",
          consultationFee: String(doctor.consultationFee ?? "1000"),
          address: doctor.address || "",
          location: doctor.location || { lat: 23.7937, lng: 90.4147 },
        })
        setEditChamberForm({
          chamberTime: doctor.chamberTime || "9:00 AM - 5:00 PM",
          consultationFee: String(doctor.consultationFee ?? "1000"),
          address: doctor.address || "",
          location: doctor.location || { lat: 23.7937, lng: 90.4147 },
        })
        setEditLocation(doctor.location || { lat: 23.7937, lng: 90.4147 })
      } catch (err: any) {
        setError(err.message || "Could not load chamber info")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChamberInfo()
  }, [user?.id, authToken])

  const handleEditChamber = () => {
    setEditChamberForm(chamberInfo)
    setEditLocation(chamberInfo.location)
    setEditChamberOpen(true)
  }

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setEditLocation({ lat, lng })
  }, [])

  const handleSaveChamber = async () => {
    if (!user?.id || !authToken) {
      setError("Authentication required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/doctor/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          chamberTime: editChamberForm.chamberTime,
          consultationFee: editChamberForm.consultationFee,
          address: editChamberForm.address,
          location: editLocation,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to update chamber info")
      }

      setChamberInfo({
        chamberTime: data.doctor.chamberTime || editChamberForm.chamberTime,
        consultationFee: String(data.doctor.consultationFee ?? editChamberForm.consultationFee),
        address: data.doctor.address || editChamberForm.address,
        location: data.doctor.location || editLocation,
      })
      toast({
        title: "Chamber info updated",
        description: "Your chamber information has been successfully updated.",
      })
      setEditChamberOpen(false)
    } catch (err: any) {
      setError(err.message || "Update failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Chamber Information
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your clinic/chamber details
        </p>
      </div>

      {/* Chamber Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Chamber Details
            </CardTitle>
            <CardDescription>Your clinic/chamber information</CardDescription>
          </div>
          <Button onClick={handleEditChamber}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Info
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Chamber Time</p>
                <p className="text-muted-foreground">{chamberInfo.chamberTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {/* <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" /> */}
              <div>
                <p className="text-sm font-medium">Consultation Fee</p>
                <p className="text-muted-foreground">{chamberInfo.consultationFee} BDT</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-muted-foreground">{chamberInfo.address}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Location on Map
            </Label>
            <LocationPickerMap
              initialLat={chamberInfo.location.lat}
              initialLng={chamberInfo.location.lng}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Chamber Dialog */}
      <Dialog open={editChamberOpen} onOpenChange={setEditChamberOpen}>
        <DialogContent className="max-w-lg overflow-auto ">
          <DialogHeader>
            <DialogTitle>Edit Chamber Information</DialogTitle>
            <DialogDescription>Update your clinic/chamber details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chamberTime">Chamber Time</Label>
              <Input
                id="chamberTime"
                value={editChamberForm.chamberTime}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, chamberTime: e.target.value })
                }
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee (BDT)</Label>
              <Input
                id="consultationFee"
                type="text"
                value={editChamberForm.consultationFee}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, consultationFee: e.target.value })
                }
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editChamberForm.address}
                onChange={(e) =>
                  setEditChamberForm({ ...editChamberForm, address: e.target.value })
                }
                placeholder="Enter chamber address"
              />
            </div>
            <div className="space-y-2">
              <Label>Location on Map</Label>
              <LocationPickerMap
                onLocationChange={handleLocationChange}
                initialLat={editLocation.lat}
                initialLng={editLocation.lng}
                interactive={true}
              />
              <p className="text-xs text-muted-foreground">
                Move the map to position the pin at your chamber location
              </p>
            </div>
          </div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChamberOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveChamber} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
