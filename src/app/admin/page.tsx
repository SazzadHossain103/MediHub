import { redirect } from "next/navigation"

// Redirect to the default hospital dashboard
export default function AdminDashboardRedirect() {
  redirect("/admin/dashboard");
}