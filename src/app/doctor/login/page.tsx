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
import { Stethoscope, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/src/store/useAuthStore"

export default function DoctorLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  // const router = useRouter();
  const { setOtpEmail, setUser } = useAuthStore();

  // Demo credentials
  const DEMO_EMAIL = "doctor@example.com"
  const DEMO_PASSWORD = "123456"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
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
          email: formData.email,
          password: formData.password,
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

  const handleDemoLogin = () => {
    setFormData({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    localStorage.setItem("medihub_doctor_logged_in", "true")
    router.push("/doctor/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Login Form Card */}
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
            <CardTitle className="text-2xl">Doctor Login</CardTitle>
            <CardDescription>
              Sign in to access your doctor dashboard
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
                  placeholder="doctor@example.com"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link href="/doctor/register" className="text-primary hover:underline cursor-pointer">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Demo Login Card */}
        {/* <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Demo Login</CardTitle>
            <CardDescription>
              Quick access to doctor dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{DEMO_EMAIL}</code>
              </p>
              <p>
                <span className="text-muted-foreground">Password:</span>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{DEMO_PASSWORD}</code>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
            >
              <Stethoscope className="mr-2 h-4 w-4" />
              Login as Demo Doctor
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
