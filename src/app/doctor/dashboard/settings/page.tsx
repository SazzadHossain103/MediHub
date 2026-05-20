"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
  Settings,
  User,
  Lock,
  Camera,
  Mail,
  Phone,
  Pencil,
} from "lucide-react"
import { toast } from "@/src/hooks/use-toast"
import { useAuthStore } from "@/src/store/useAuthStore"

type ProfileData = {
  name: string
  email: string
  phone: string
}

export default function SettingsPage() {
  const { user, token, doctorToken, setUser } = useAuthStore()
  const authToken = doctorToken || token
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "Dr. John Doe",
    email: user?.email || "demo.doctor@medihub.com",
    phone: "+880 1712-000000",
  })
  const [profileForm, setProfileForm] = useState<ProfileData>({ ...profileData })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
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
          throw new Error(data.message || data.error || "Unable to fetch doctor profile")
        }

        const backendProfile = {
          name: data.doctor.fullName || user.name || "",
          email: data.doctor.email || user.email || "",
          phone: data.doctor.contactNumber || "",
        }

        setProfileData(backendProfile)
        setProfileForm(backendProfile)
        setProfileImage(data.doctor.avatar || null)
      } catch (err: any) {
        setError(err.message || "Could not load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id, authToken, user?.name, user?.email])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProfile = () => {
    setProfileForm({ ...profileData })
    setTempProfileImage(profileImage)
    setIsEditingProfile(true)
  }

  const handleCancelProfileEdit = () => {
    setProfileForm({ ...profileData })
    setTempProfileImage(profileImage)
    setIsEditingProfile(false)
    setError(null)
  }

  const handleSaveProfile = async () => {
    if (!user?.id || !authToken) {
      setError("Unable to update profile: authentication required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const requestBody: Record<string, any> = {
        fullName: profileForm.name,
        email: profileForm.email,
        contactNumber: profileForm.phone,
      }

      if (tempProfileImage) {
        requestBody.avatarData = tempProfileImage
      }

      const res = await fetch(`/api/doctor/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to save profile")
      }

      setProfileData(profileForm)
      setIsEditingProfile(false)
      setProfileImage(data.doctor?.avatar || profileImage)
      setTempProfileImage(null)

      if (user) {
        setUser({
          ...user,
          name: profileForm.name,
          email: profileForm.email,
        })
      }

      toast({
        title: "Settings updated",
        description: "Your doctor profile has been updated successfully.",
      })
    } catch (err: any) {
      setError(err.message || "Update failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenPasswordForm = () => {
    setIsChangingPassword(true)
  }

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsChangingPassword(false)
  }

  const handleSavePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      return
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Please fill in all password fields")
      return
    }
    if (!authToken) {
      setError("Authentication required to change password")
      return
    }

    setError(null)
    setIsPasswordSaving(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to change password")
      }

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsChangingPassword(false)
    } catch (err: any) {
      setError(err.message || "Password update failed")
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const displayImage = isEditingProfile ? tempProfileImage : profileImage
  const displayName = isEditingProfile ? profileForm.name : profileData.name

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account settings
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
            {!isEditingProfile && (
              <Button variant="outline" size="sm" onClick={handleEditProfile}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                <AvatarImage src={displayImage || undefined} alt="Profile" />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 text-primary-foreground" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              )}
            </div>
            <div>
              <p className="font-medium">Profile Picture</p>
              <p className="text-sm text-muted-foreground">
                {isEditingProfile
                  ? "Click the camera icon to upload a new photo"
                  : "Your current profile photo"}
              </p>
            </div>
          </div>

          {isEditingProfile ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancelProfileEdit}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profileData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password for security</CardDescription>
            </div>
            {!isChangingPassword && (
              <Button variant="outline" size="sm" onClick={handleOpenPasswordForm}>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        {isChangingPassword && (
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter your current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter your new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSavePassword}>
                Save Password
              </Button>
              <Button variant="outline" onClick={handleCancelPasswordChange}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
