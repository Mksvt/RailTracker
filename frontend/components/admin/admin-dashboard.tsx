"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Train, MapPin, Calendar, Users } from "lucide-react"
import { TrainManagement } from "./train-management"
import { StationManagement } from "./station-management"
import { ScheduleManagement } from "./schedule-management"
import { UserManagement } from "./user-management"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-accent" onClick={() => router.push("/")}/>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Панель адміністратора</h1>
          <p className="text-muted-foreground">Управління системою розкладу поїздів</p>
          <h5 className="text-xs font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" onClick={() => router.push("/")}>
            RailTracker
          </h5>
        </div>
      </div>

      <Tabs defaultValue="schedules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Розклад
          </TabsTrigger>
          <TabsTrigger value="trains" className="flex items-center gap-2">
            <Train className="h-4 w-4" />
            Поїзди
          </TabsTrigger>
          <TabsTrigger value="stations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Станції
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Користувачі
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedules">
          <ScheduleManagement />
        </TabsContent>

        <TabsContent value="trains">
          <TrainManagement />
        </TabsContent>

        <TabsContent value="stations">
          <StationManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
