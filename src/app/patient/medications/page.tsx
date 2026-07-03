"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Badge } from "@/src/components/ui/badge"
import { useAuthStore } from "@/src/store/useAuthStore"
import { toast } from "@/src/hooks/use-toast"
import { Edit2, Plus, Trash2, Pill } from "lucide-react"

type Medication = {
  _id: string
  name: string
  dosage?: string | null
  prescribedBy?: string | null
  startDate?: string | null
  stockStatus?: string | null
}

type MedicationFormData = {
  name: string
  dosage: string
  prescribedBy: string
  stockStatus: string
}

export default function MedicationsPage() {
  const { token } = useAuthStore()
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [formData, setFormData] = useState<MedicationFormData>({
    name: "",
    dosage: "",
    prescribedBy: "",
    stockStatus: "In stock",
  })

  useEffect(() => {
    if (!token) {
      setMedications([])
      setIsLoading(false)
      return
    }

    const loadMedications = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/patient/medications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Unable to load medications")
        }

        setMedications(data.medications || [])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setMedications([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMedications()
  }, [token])

  const resetForm = () => {
    setFormData({ name: "", dosage: "", prescribedBy: "", stockStatus: "In stock" })
    setSelectedMedication(null)
  }

  const handleAddMedication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Medication name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch("/api/patient/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          dosage: formData.dosage.trim() || null,
          prescribedBy: formData.prescribedBy.trim() || null,
          startDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          stockStatus: formData.stockStatus,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to add medication")
      }

      setMedications((current) => [data.medication, ...current])
      resetForm()
      toast({
        title: "Medication added",
        description: "Your current medication was saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (medication: Medication) => {
    setSelectedMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage || "",
      prescribedBy: medication.prescribedBy || "",
      stockStatus: medication.stockStatus || "In stock",
    })
    setIsEditOpen(true)
  }

  const handleUpdateMedication = async () => {
    if (!token || !selectedMedication) return
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Medication name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch(`/api/patient/medications?id=${encodeURIComponent(selectedMedication._id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          dosage: formData.dosage.trim() || null,
          prescribedBy: formData.prescribedBy.trim() || null,
          startDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          stockStatus: formData.stockStatus,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to update medication")
      }

      setMedications((current) =>
        current.map((item) => (item._id === selectedMedication._id ? data.medication : item))
      )
      setIsEditOpen(false)
      resetForm()
      toast({
        title: "Medication updated",
        description: "Your medication details were updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMedication = async (id: string) => {
    if (!token) return
    if (!window.confirm("Delete this medication?")) return

    setIsDeleting(id)

    try {
      const res = await fetch(`/api/patient/medications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete medication")
      }

      setMedications((current) => current.filter((item) => item._id !== id))
      toast({
        title: "Medication deleted",
        description: "The medication was removed from your profile.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Medications</h1>
          <p className="text-muted-foreground">
            Add, update, and remove your current medications from your health profile.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Pill className="h-5 w-5 text-secondary" />
          <span>Keep your prescription list up to date.</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Manage medications you are taking right now.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                Loading medications...
              </div>
            ) : medications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                No medications found. Add one using the form on the right.
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div
                    key={medication._id}
                    className="rounded-lg border border-border p-4 sm:flex sm:items-center sm:justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                          <Pill className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">{medication.name}</h2>
                          <p className="text-sm text-muted-foreground">{medication.dosage || "Dosage not specified"}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {medication.prescribedBy ? <span>Prescribed by {medication.prescribedBy}</span> : null}
                        {medication.startDate ? <span>• Updated: {medication.startDate}</span> : null}
                        {medication.stockStatus ? <span>• {medication.stockStatus}</span> : null}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(medication)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMedication(medication._id)}
                        disabled={isDeleting === medication._id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting === medication._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>{selectedMedication ? "Edit Medication" : "Add Medication"}</CardTitle>
              <CardDescription>
                {selectedMedication ? "Update medication details." : "Add a new medication to your profile."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input
                  id="medication-name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="e.g. Metformin 500mg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication-dosage">Dosage Instructions</Label>
                <Select
                  value={formData.dosage}
                  onValueChange={(value) => setFormData({ ...formData, dosage: value })}
                >
                  <SelectTrigger id="medication-dosage" className="w-full">
                    <SelectValue placeholder="Select dosage instruction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                    <SelectItem value="Before meals">Before meals</SelectItem>
                    <SelectItem value="After meals">After meals</SelectItem>
                    <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication-prescribed-by">Prescribed By</Label>
                <Input
                  id="medication-prescribed-by"
                  value={formData.prescribedBy}
                  onChange={(event) => setFormData({ ...formData, prescribedBy: event.target.value })}
                  placeholder="e.g. Dr. Sara Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medication-stock-status">Stock Status</Label>
                <Select
                  value={formData.stockStatus}
                  onValueChange={(value) => setFormData({ ...formData, stockStatus: value })}
                >
                  <SelectTrigger id="medication-stock-status" className="w-full">
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In stock">In stock</SelectItem>
                    <SelectItem value="Out of stock">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Medication"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={(open) => !open && setIsEditOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-medication-name">Medication Name</Label>
              <Input
                id="edit-medication-name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="e.g. Metformin 500mg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-medication-dosage">Dosage Instructions</Label>
              <Select
                value={formData.dosage}
                onValueChange={(value) => setFormData({ ...formData, dosage: value })}
              >
                <SelectTrigger id="edit-medication-dosage" className="w-full">
                  <SelectValue placeholder="Select dosage instruction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                  <SelectItem value="Before meals">Before meals</SelectItem>
                  <SelectItem value="After meals">After meals</SelectItem>
                  <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-medication-prescribed-by">Prescribed By</Label>
              <Input
                id="edit-medication-prescribed-by"
                value={formData.prescribedBy}
                onChange={(event) => setFormData({ ...formData, prescribedBy: event.target.value })}
                placeholder="e.g. Dr. Sara Ahmed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-medication-stock-status">Stock Status</Label>
              <Select
                value={formData.stockStatus}
                onValueChange={(value) => setFormData({ ...formData, stockStatus: value })}
              >
                <SelectTrigger id="edit-medication-stock-status" className="w-full">
                  <SelectValue placeholder="Select stock status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In stock">In stock</SelectItem>
                  <SelectItem value="Out of stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMedication} disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Medication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
