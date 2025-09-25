import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AdminDashboard />
      </div>
    </div>
  );
}
