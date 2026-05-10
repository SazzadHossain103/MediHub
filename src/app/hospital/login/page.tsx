"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Building2 } from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"
import loginApiCall from "@/src/utils/loginApiCall"

// Demo hospitals list
const demoHospitals = [
  { id: "hospital-1", name: "Dhaka Medical College Hospital" },
  { id: "hospital-2", name: "Square Hospital" },
  { id: "hospital-3", name: "United Hospital" },
]

export default function HospitalLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setOtpEmail } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [selectedHospital, setSelectedHospital] = useState("hospital-1")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("");

      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email : formData.email ,
          password : formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);

      setOtpEmail(formData.email);

      router.push("/verify-login");
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Login Form Card */}
        <Card>
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
              <Image
                src="/images/medihub-header.png"
                alt="MediHub"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <CardTitle className="text-2xl">Hospital Login</CardTitle>
            <CardDescription>
              Sign in to access your hospital dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hospital@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/hospital/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
