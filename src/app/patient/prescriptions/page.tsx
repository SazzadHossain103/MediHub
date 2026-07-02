"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { FileText, Plus, Trash2 } from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"

type Prescription = {
  _id?: string
  id?: string
  issue: string
  doctor: string
  imageUrl: string
  createdAt: string
}

export default function PrescriptionsPage() {
  const { user, token } = useAuthStore()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [issue, setIssue] = useState("")
  const [doctor, setDoctor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingPrescriptionKey, setDeletingPrescriptionKey] = useState<string | null>(null)

  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!token) {
        setError("You must be logged in to load prescriptions.")
        setIsLoading(false)
        return
      }

      setError(null)
      setIsLoading(true)

      try {
        const res = await fetch("/api/patient/prescriptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load prescriptions")
        }

        setPrescriptions(data.prescriptions || [])
      } catch (err: any) {
        setError(err?.message || "Failed to load prescriptions")
      } finally {
        setIsLoading(false)
      }
    }

    loadPrescriptions()
  }, [token])

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImageUrl("")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        setImageUrl(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddPrescription = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("You must be logged in to add a prescription.")
      return
    }

    if (!issue.trim() || !doctor.trim() || !imageUrl) {
      setError("Please provide issue name, doctor name, and prescription image.")
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch("/api/patient/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ issue: issue.trim(), doctor: doctor.trim(), imageData: imageUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save prescription")
      }

      setPrescriptions([data.prescription, ...prescriptions])
      setIssue("")
      setDoctor("")
      setImageUrl("")
    } catch (err: any) {
      setError(err?.message || "Failed to save prescription")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage your prescriptions and upload new prescription images.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-5 w-5 text-secondary" />
          <span>{user?.name ? `${user.name}'s prescriptions` : "Your prescriptions"}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>View every prescription added to your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                  Loading prescriptions...
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                  No prescriptions yet. Add one using the form on the right.
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => {
                    const prescriptionKey = prescription._id || prescription.id || ""
                    return (
                      <div key={prescriptionKey} className="rounded-lg border border-border p-4 sm:flex sm:items-start sm:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{prescription.createdAt}</Badge>
                            <span>•</span>
                            <span>{prescription.doctor}</span>
                          </div>
                          <h2 className="text-lg font-semibold text-foreground">{prescription.issue}</h2>
                          <p className="text-sm text-muted-foreground">Doctor: {prescription.doctor}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-3 sm:mt-0">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(prescription.imageUrl)}
                            className="h-24 w-32 overflow-hidden rounded-lg border border-border bg-muted"
                          >
                            <img
                              src={prescription.imageUrl}
                              alt={`Prescription for ${prescription.issue}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!token) {
                                setError("You must be logged in to remove a prescription.")
                                return
                              }
                              const prescriptionKey = prescription.id || prescription._id
                              if (!prescriptionKey) {
                                setError("Invalid prescription reference")
                                return
                              }
                              setDeletingPrescriptionKey(prescriptionKey)
                              try {
                                const res = await fetch(`/api/patient/prescriptions?id=${encodeURIComponent(prescriptionKey)}`, {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                })
                                const data = await res.json()
                                if (!res.ok) {
                                  throw new Error(data?.message || "Failed to delete prescription")
                                }
                                setPrescriptions(prescriptions.filter((item) => {
                                  const key = item.id || item._id
                                  return key !== prescriptionKey
                                }))
                              } catch (err: any) {
                                setError(err?.message || "Failed to delete prescription")
                              } finally {
                                setDeletingPrescriptionKey(null)
                              }
                            }}
                            disabled={deletingPrescriptionKey === (prescription.id || prescription._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingPrescriptionKey === (prescription.id || prescription._id) ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Prescription</CardTitle>
            <CardDescription>Save the issue, doctor, and an image of the prescription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddPrescription} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issue">Problem / Issue Name</Label>
                <Input
                  id="issue"
                  value={issue}
                  onChange={(event) => setIssue(event.target.value)}
                  placeholder="e.g. Chronic migraine"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor Name</Label>
                <Input
                  id="doctor"
                  value={doctor}
                  onChange={(event) => setDoctor(event.target.value)}
                  placeholder="e.g. Dr. Sarah Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescription-image">Prescription Image</Label>
                <Input
                  id="prescription-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {imageUrl ? (
                <div className="rounded-lg border border-border p-2">
                  <div className="h-48 w-full overflow-hidden rounded-lg bg-muted">
                    <img src={imageUrl} alt="Prescription preview" className="h-full w-full object-contain" />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Upload a prescription image to preview it here.
                </div>
              )}
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              <Button type="submit" className="w-full" disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Add Prescription"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => { if (!open) setSelectedImage(null) }}>
        <DialogContent className="max-w-5xl p-0 sm:p-0">
          <DialogHeader>
            <DialogTitle>Prescription Image</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Click outside or press Esc to close.
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-[70vh] w-full overflow-hidden rounded-b-2xl bg-black">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Prescription full view"
                className="h-full w-full object-contain"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
