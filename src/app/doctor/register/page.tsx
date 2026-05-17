"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Textarea } from "@/src/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Upload, User, Briefcase, FileCheck, KeyRound } from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"
import { toast } from '@/src/hooks/use-toast'
import { set } from "mongoose"

export default function DoctorRegistrationPage() {
  const router = useRouter()
  const { setOtpEmail, setRole } = useAuthStore();

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    // Professional Information
    medicalRegNumber: "",
    specialization: "",
    yearsOfExperience: "",
    qualifications: "",
    affiliatedHospital: "",
    // Account Information
    password: "",
    role: "doctor",
  })

  const [files, setFiles] = useState({
    governmentId: null as File | null,
    medicalLicense: null as File | null,
    degreeCertificates: null as File | null,
    recentPhotograph: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (name: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "/api/doctor/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || 'Doctor registration failed'
        toast({
          title: 'Doctor registration failed',
          description: errorMessage,
          variant: 'destructive',
        })
        throw new Error(errorMessage)
      }

      toast({
        title: 'Doctor registered',
        description: data.message || 'Please verify your email to continue.',
      })

      console.log(data);
      setOtpEmail(formData.email);
      setRole("doctor");

      router.push("/verify-email");
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: 'Doctor registration failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4 cursor-pointer">
              <Image
                src="/images/medihub-header.png"
                alt="MediHub"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <CardTitle className="text-2xl">Doctor Registration</CardTitle>
            <CardDescription>
              Register as a healthcare professional on MediHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Dr. John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      placeholder="+880 1XXXXXXXXX"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="doctor@/srcexample.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Professional Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="medicalRegNumber">Medical Registration Number</Label>
                    <Input
                      id="medicalRegNumber"
                      name="medicalRegNumber"
                      placeholder="BMDC-XXXXX"
                      value={formData.medicalRegNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization/Department</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleSelectChange("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Medicine</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="gynecology">Gynecology</SelectItem>
                        <SelectItem value="surgery">General Surgery</SelectItem>
                        <SelectItem value="ent">ENT</SelectItem>
                        <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliatedHospital">Affiliated Hospital/Clinic (Optional)</Label>
                    <Input
                      id="affiliatedHospital"
                      name="affiliatedHospital"
                      placeholder="Hospital name"
                      value={formData.affiliatedHospital}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Textarea
                      id="qualifications"
                      name="qualifications"
                      placeholder="MBBS, MD, FCPS, etc."
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      rows={2}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Verification Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Verification Documents</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Government ID</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="governmentId"
                      onChange={(e) => handleFileChange("governmentId", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById("governmentId")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.governmentId ? files.governmentId.name : "Upload Government ID"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Medical License</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="medicalLicense"
                      onChange={(e) => handleFileChange("medicalLicense", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById("medicalLicense")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.medicalLicense ? files.medicalLicense.name : "Upload Medical License"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Degree Certificates</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="degreeCertificates"
                      onChange={(e) => handleFileChange("degreeCertificates", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById("degreeCertificates")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.degreeCertificates ? files.degreeCertificates.name : "Upload Degree Certificates"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Recent Photograph</Label>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      id="recentPhotograph"
                      onChange={(e) => handleFileChange("recentPhotograph", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => document.getElementById("recentPhotograph")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {files.recentPhotograph ? files.recentPhotograph.name : "Upload Photograph"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Account Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accountEmail">Email</Label>
                    <Input
                      id="accountEmail"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Uses email from personal information</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full cursor-pointer" size="lg">
                Register as Doctor
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link href="/doctor/login" className="text-primary hover:underline cursor-pointer">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
