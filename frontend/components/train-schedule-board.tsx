'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Train, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchSchedules } from '../lib/api';
import { TransformedSchedule, TrainScheduleBoardProps } from '../types/types';
import {
  getStatusColor,
  getStatusText,
  getTrainTypeText,
  formatTime,
} from '../lib/helpers';
import {getStatusIcon} from '../lib/iconHelpers';

export function TrainScheduleBoard({
  fromStation,
  toStation,
}: TrainScheduleBoardProps) {
  const [schedules, setSchedules] = useState<TransformedSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('departure_time');

  useEffect(() => {
    const loadSchedules = async () => {
      if (!fromStation || !toStation) {
        setSchedules([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const rawData = await fetchSchedules(search, sort);

        const transformedData = rawData.map((item: any) => ({
          id: item.id,
          train_number: item.train.number,
          train_name: item.train.name,
          train_type: item.train.type,
          departure_time: formatTime(item.departureTime),
          arrival_time: formatTime(item.arrivalTime),
          from_station_name: item.departureStation.name,
          to_station_name: item.arrivalStation.name,
          platform: item.platform,
          status: item.status,
          delay_minutes: item.delayMinutes,
          price: item.price,
          available_seats: item.availableSeats,
        }));

        setSchedules(transformedData);
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Помилка завантаження розкладу. Спробуйте оновити сторінку.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [fromStation, toStation, search, sort]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Завантаження розкладу...
          </span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити сторінку
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Розклад поїздів</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Пошук по номеру/назві..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортувати за" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure_time">Час відправлення</SelectItem>
              <SelectItem value="arrival_time">Час прибуття</SelectItem>
              <SelectItem value="price">Ціна</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Train className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>За вашим запитом поїздів не знайдено.</p>
          <p className="text-sm">
            Спробуйте змінити станції або параметри пошуку.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="slide-in rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all duration-300 hover:bg-secondary/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-primary">
                      {schedule.departure_time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Відправлення
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <Train className="h-6 w-6 text-accent mb-1" />
                    <div className="text-xs text-muted-foreground">
                      {getTrainTypeText(schedule.train_type)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-accent">
                      {schedule.arrival_time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Прибуття
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {schedule.train_number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.train_name}
                    </div>
                    {schedule.platform && (
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Платформа {schedule.platform}
                      </div>
                    )}
                  </div>

                  <Badge
                    className={`${getStatusColor(
                      schedule.status
                    )} flex min-w-[120px] items-center justify-center gap-1`}
                  >
                    {getStatusIcon(schedule.status)}
                    {schedule.status === 'delayed' && schedule.delay_minutes > 0
                      ? `+${schedule.delay_minutes}хв`
                      : getStatusText(schedule.status)}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 border-t border-border/30 pt-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-semibold">
                    {schedule.from_station_name} → {schedule.to_station_name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span>{schedule.price} ₴</span>
                    <span>Місць: {schedule.available_seats}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
