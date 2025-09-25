import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchMeServer } from "@/lib/apiServer";

export default async function AdminPage() {
  const user = await fetchMeServer();

  if (!user) redirect("/auth/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AdminDashboard />
      </div>
    </div>
  );
}
