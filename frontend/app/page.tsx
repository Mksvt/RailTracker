"use client"

import { TrainScheduleHeader } from "@/components/train-schedule-header"
import { TrainScheduleBoard } from "@/components/train-schedule-board"
import { StationSelector } from "@/components/station-selector"
import { LiveUpdates } from "@/components/live-updates"
import { useState } from "react"

export default function HomePage() {
  const [selectedStations, setSelectedStations] = useState<{ from: string; to: string } | null>(null)

  const handleStationsChange = (from: string, to: string) => {
    setSelectedStations({ from, to })
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <TrainScheduleHeader />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-3">
            <StationSelector onStationsChange={handleStationsChange} />
            <TrainScheduleBoard />
          </div>
          <div className="lg:col-span-1">
            <LiveUpdates />
          </div>
        </div>
      </div>
    </main>
  )
}
