import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getUser } from "@/lib/auth"
import { cookies } from "next/headers"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const request = {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
    },
  } as any

  const user = await getUser(request)

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AdminDashboard />
      </div>
    </div>
  )
}
