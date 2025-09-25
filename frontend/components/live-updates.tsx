"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle, Clock, RefreshCw } from "lucide-react"

interface Update {
  id: string
  type: "info" | "warning" | "success" | "delay"
  message: string
  timestamp: string
  trainNumber?: string
}

export function LiveUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUpdates = async () => {
    try {
      setIsLoading(true)
      const data: Update[] = [
      {
        id: "mock-1",
        type: "info",
        message: "Поїзд №123 прибув на станцію Львів.",
        timestamp: new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        trainNumber: "123",
      },
    ]
      setUpdates(data || [])
    } catch (error) {
      console.error("Error fetching updates:", error)
      // Fallback to system message
      setUpdates([
        {
          id: "error-1",
          type: "warning",
          message: "Помилка завантаження оновлень. Спробуйте пізніше.",
          timestamp: new Date().toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUpdates()

    // Refresh updates every 30 seconds
    const interval = setInterval(fetchUpdates, 30000)
    return () => clearInterval(interval)
  }, [])

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "delay":
        return <Clock className="h-4 w-4 text-red-400" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-yellow-500"
      case "delay":
        return "border-l-red-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-xl font-bold text-foreground">Живі оновлення</h3>
        {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-primary ml-auto" />}
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {updates.length === 0 && !isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Немає нових оновлень</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div
              key={update.id}
              className={`border-l-4 ${getUpdateColor(update.type)} bg-secondary/30 p-3 rounded-r-lg slide-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-2">
                {getUpdateIcon(update.type)}
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">{update.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-mono">{update.timestamp}</span>
                    {update.trainNumber && (
                      <Badge variant="outline" className="text-xs">
                        {update.trainNumber}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Останнє оновлення: {new Date().toLocaleTimeString("uk-UA")}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            <span>Авто-оновлення</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
