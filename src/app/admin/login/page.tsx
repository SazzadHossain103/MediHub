"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"
import { ADMIN_CREDENTIALS } from "@/src/lib/mock-data"
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const {setOtpEmail} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
    
  //   if (
  //     formData.email === ADMIN_CREDENTIALS.email &&
  //     formData.password === ADMIN_CREDENTIALS.password
  //   ) {
  //     // Store admin session
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("medihub_admin_logged_in", "true")
  //     }
  //     router.push("/admin/dashboard")
  //   } else {
  //     setError("Invalid email or password. Please try again.")
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // Save token
    localStorage.setItem("adminToken", data.token);

    // Save admin info
    localStorage.setItem("adminData", JSON.stringify(data.admin));

    setOtpEmail(formData.email);
    // Redirect
    router.push("/verify-login");

  } catch (error) {
    console.log(error);
    setError("Something went wrong");
  }finally {
        setIsLoading(false);
      }
};


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
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </div>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@medihub.com"
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

              <Button type="submit" className="w-full">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <Link href="/" className="text-primary hover:underline">
                  Back to Home
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      
      </div>
    </div>
  )
}
