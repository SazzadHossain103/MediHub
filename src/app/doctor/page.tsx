"use client"
import { redirect } from "next/navigation"
import { useAuthStore } from "@/src/store/useAuthStore";

// Redirect to the default hospital dashboard
export default function HospitalDashboardRedirect() {
  const { user } = useAuthStore();

  // If the user is not authenticated, redirect to the login page
  if (!user) {
  redirect("/doctor/login");
  }

  // If the user is authenticated, redirect to the doctor dashboard
  redirect("/doctor/dashboard");
}
