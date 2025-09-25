'use client';

import { useState } from 'react';
import { StationSelector } from '@/components/station-selector';
import { TrainScheduleBoard } from '@/components/train-schedule-board';
import { TrainScheduleHeader } from '@/components/train-schedule-header';
import { LiveUpdates } from '@/components/live-updates';

export default function HomePage() {
  const [fromStationId, setFromStationId] = useState<string>('');
  const [toStationId, setToStationId] = useState<string>('');

  const handleSearch = (from: string, to: string) => {
    setFromStationId(from);
    setToStationId(to);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <TrainScheduleHeader />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">

            <StationSelector onSearch={handleSearch} />

            <TrainScheduleBoard fromStation={fromStationId} toStation={toStationId} />
          </div>
          <div className="lg:col-span-1">
            <LiveUpdates />
          </div>
        </div>
      </div>
    </main>
  );
}