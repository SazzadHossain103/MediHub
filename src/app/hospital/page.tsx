import { redirect } from "next/navigation"

// Redirect to the default hospital dashboard
export default function HospitalDashboardRedirect() {
  redirect("/hospital/login");
}
