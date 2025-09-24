import { Train, Clock, MapPin } from "lucide-react"
import { AuthHeader } from "./auth-header"

export function TrainScheduleHeader() {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Train className="h-10 w-10 text-primary pulse-glow" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RailTracker
            </h1>
            <p className="text-muted-foreground text-sm font-mono">Система розкладу поїздів</p>
          </div>
        </div>
        <AuthHeader />
      </div>

      <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Оновлення в реальному часі</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Всі станції</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Система онлайн</span>
        </div>
      </div>
    </header>
  )
}
