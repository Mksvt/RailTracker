"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, User, Shield, UserX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити користувачів",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update user role")
      toast({ title: "Успіх", description: "Роль користувача оновлено" })
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося оновити роль користувача",
        variant: "destructive",
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400"
      case "user":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Адміністратор"
      case "user":
        return "Користувач"
      default:
        return role
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Завантаження...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управління користувачами</CardTitle>
            <CardDescription>Перегляд та управління ролями користувачів</CardDescription>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-border rounded-lg p-4 bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/20 rounded-full">
                    {user.role === "admin" ? (
                      <Shield className="h-6 w-6 text-primary" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.full_name || "Без імені"}</span>
                      <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <p className="text-muted-foreground text-xs">
                      Зареєстрований: {new Date(user.created_at).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role === "user" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, "admin")}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Зробити адміном
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, "user")}
                      className="text-green-400 hover:text-green-300"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Зняти права адміна
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
