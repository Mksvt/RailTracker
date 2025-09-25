'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw, Search } from 'lucide-react';
import { fetchStations } from '../lib/api'; 

interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
}

interface StationSelectorProps {
  onSearch: (from: string, to: string) => void;
}

export function StationSelector({ onSearch }: StationSelectorProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStations();
        setStations(data || []);

        if (data && data.length >= 2) {
          const defaultFrom = data.find((s: Station) => s.name.includes('Київ')) || data[0];
          const defaultTo = data.find((s: Station) => s.name.includes('Львів')) || data[1];
          setFromStation(defaultFrom.id);
          setToStation(defaultTo.id);

          onSearch(defaultFrom.id, defaultTo.id);
        }
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Не вдалося завантажити список станцій.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearchClick = () => {
    if (fromStation && toStation) {
      onSearch(fromStation, toStation);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Завантаження станцій...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mb-6 bg-destructive/20 border-destructive/50 text-destructive-foreground">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="from-station" className="block text-sm font-medium text-muted-foreground mb-2">Звідки</label>
          <select
            id="from-station"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Оберіть станцію</option>
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
          disabled={!fromStation || !toStation}
          aria-label="Поміняти станції місцями"
          className="bg-transparent border-primary/20 hover:border-primary hover:bg-primary/10"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="to-station" className="block text-sm font-medium text-muted-foreground mb-2">Куди</label>
          <select
            id="to-station"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Оберіть станцію</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.city})
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleSearchClick}
          disabled={!fromStation || !toStation}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Search className="h-4 w-4 mr-2" />
          Знайти поїзди
        </Button>
      </div>
    </Card>
  );
}