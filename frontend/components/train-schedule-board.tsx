'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  MapPin,
  Train,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchSchedules, fetchTrains, fetchStations } from '../lib/api';

interface TrainSchedule {
  id: string;
  train_number: string;
  train_name: string;
  train_type: string;
  departure_time: string;
  arrival_time: string;
  from_station_name: string;
  to_station_name: string;
  platform: string | null;
  status: string;
  delay_minutes: number;
  price: number;
  available_seats: number;
}

export function TrainScheduleBoard() {
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('departure_time');
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const fetchSchedulesData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchSchedules(search, sort);

      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Помилка завантаження розкладу');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulesData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules(search, sort);
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    loadSchedules();
  }, [search, sort]);

  useEffect(() => {
    const loadTrainsAndStations = async () => {
      try {
        const trains = await fetchTrains();
        const stations = await fetchStations();
        setTrains(trains);
        setStations(stations);
      } catch (error) {
        console.error('Error fetching trains or stations:', error);
      }
    };

    loadTrainsAndStations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'delayed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'departed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'arrived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle className="h-4 w-4" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4" />;
      case 'departed':
        return <Train className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'За розкладом';
      case 'delayed':
        return 'Затримка';
      case 'departed':
        return 'Відправився';
      case 'arrived':
        return 'Прибув';
      case 'cancelled':
        return 'Скасовано';
      default:
        return status;
    }
  };

  const getTrainTypeText = (type: string) => {
    switch (type) {
      case 'high_speed':
        return 'Швидкісний';
      case 'intercity':
        return 'Міжміський';
      case 'regional':
        return 'Регіональний';
      case 'local':
        return 'Приміський';
      default:
        return type;
    }
  };

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
          <Button onClick={fetchSchedulesData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Спробувати знову
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Розклад поїздів</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Пошук станції..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={sort} onValueChange={(value) => setSort(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Сортувати за" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure_time">Час відправлення</SelectItem>
              <SelectItem value="arrival_time">Час прибуття</SelectItem>
              <SelectItem value="price">Ціна</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchSchedulesData} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Train className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Розклад поїздів не знайдено</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className="slide-in border border-border/50 rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary font-mono">
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
                    <div className="text-2xl font-bold text-accent font-mono">
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
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                        <MapPin className="h-3 w-3" />
                        Платформа {schedule.platform}
                      </div>
                    )}
                  </div>

                  <Badge
                    className={`${getStatusColor(
                      schedule.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(schedule.status)}
                    {schedule.status === 'delayed' && schedule.delay_minutes > 0
                      ? `+${schedule.delay_minutes}хв`
                      : getStatusText(schedule.status)}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {schedule.from_station_name} → {schedule.to_station_name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span>₴{schedule.price}</span>
                    <span>Місць: {schedule.available_seats}</span>
                    {schedule.status === 'delayed' &&
                      schedule.delay_minutes > 0 && (
                        <span className="text-red-400">
                          Затримка {schedule.delay_minutes} хв
                        </span>
                      )}
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
