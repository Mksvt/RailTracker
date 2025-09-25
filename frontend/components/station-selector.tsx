"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, MapPin, RefreshCw } from "lucide-react"
import { getStations } from "../lib/api"

interface Station {
  id: string
  name: string
  code: string
  city: string
}

interface StationSelectorProps {
  onStationsChange?: (from: string, to: string) => void
}

export function StationSelector({ onStationsChange }: StationSelectorProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchStations = async () => {
    try {
      setIsLoading(true)
      const response = await getStations()

      if (!response.ok) {
        throw new Error("Failed to fetch stations")
      }

      const data = await response.json()
      setStations(data || [])

      // Set default stations if available
      if (data && data.length >= 2) {
        const defaultFrom = data.find((s: Station) => s.name.includes("Київ")) || data[0]
        const defaultTo = data.find((s: Station) => s.name.includes("Львів")) || data[1]
        setFromStation(defaultFrom.id)
        setToStation(defaultTo.id)
      }
    } catch (error) {
      console.error("Error fetching stations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStations()
  }, [])

  useEffect(() => {
    if (fromStation && toStation && onStationsChange) {
      onStationsChange(fromStation, toStation)
    }
  }, [fromStation, toStation, onStationsChange])

  const swapStations = () => {
    const temp = fromStation
    setFromStation(toStation)
    setToStation(temp)
  }

  const handleSearch = () => {
    if (onStationsChange && fromStation && toStation) {
      onStationsChange(fromStation, toStation)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Завантаження станцій...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Звідки</label>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Оберіть станцію</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.city})
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={swapStations}
          className="mt-6 border-primary/20 hover:border-primary hover:bg-primary/10 bg-transparent"
          disabled={!fromStation || !toStation}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Куди</label>
          <select
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Оберіть станцію</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.city})
              </option>
            ))}
          </select>
        </div>

        <Button
          className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSearch}
          disabled={!fromStation || !toStation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Знайти поїзди
        </Button>
      </div>
    </Card>
  )
}
