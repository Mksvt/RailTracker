'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchSchedules,
  fetchTrains,
  fetchStations,
} from '../../lib/api';

interface TrainSchedule {
  id: string;
  train_id: string;
  departure_station_id: string;
  arrival_station_id: string;
  departure_time: string;
  arrival_time: string;
  platform: string | null;
  status: string;
  delay_minutes: number;
  price: number;
  available_seats: number;
  trains: { number: string; name: string };
  departure_station: { name: string };
  arrival_station: { name: string };
}

interface Train {
  id: string;
  number: string;
  name: string;
  type: string;
}

interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
}

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TrainSchedule | null>(
    null
  );
  const [formData, setFormData] = useState({
    train_id: '',
    departure_station_id: '',
    arrival_station_id: '',
    departure_time: '',
    arrival_time: '',
    platform: '',
    status: 'scheduled',
    delay_minutes: 0,
    price: 0,
    available_seats: 0,
  });

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const schedulesData = await fetchSchedules();
      setSchedules(schedulesData || []);

      const trainsData = await fetchTrains();
      setTrains(trainsData || []);

      const stationsData = await fetchStations();
      setStations(stationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити дані',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, formData);
        toast({ title: 'Успіх', description: 'Розклад оновлено' });
      } else {
        await createSchedule(formData);
        toast({ title: 'Успіх', description: 'Розклад створено' });
      }
      setIsDialogOpen(false);
      setEditingSchedule(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося зберегти розклад',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей розклад?')) return;
    try {
      await deleteSchedule(id);
      toast({ title: 'Успіх', description: 'Розклад видалено' });
      fetchData();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити розклад',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (schedule: TrainSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      train_id: schedule.train_id,
      departure_station_id: schedule.departure_station_id,
      arrival_station_id: schedule.arrival_station_id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      platform: schedule.platform || '',
      status: schedule.status,
      delay_minutes: schedule.delay_minutes,
      price: schedule.price,
      available_seats: schedule.available_seats,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      train_id: '',
      departure_station_id: '',
      arrival_station_id: '',
      departure_time: '',
      arrival_time: '',
      platform: '',
      status: 'scheduled',
      delay_minutes: 0,
      price: 0,
      available_seats: 0,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500/20 text-green-400';
      case 'delayed':
        return 'bg-red-500/20 text-red-400';
      case 'departed':
        return 'bg-blue-500/20 text-blue-400';
      case 'arrived':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Завантаження...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управління розкладом</CardTitle>
            <CardDescription>
              Створення, редагування та видалення розкладу поїздів
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Додати розклад
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Редагувати розклад' : 'Створити розклад'}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule
                    ? 'Оновіть інформацію про розклад'
                    : 'Додайте новий розклад поїзда'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="train_id">Поїзд</Label>
                    <Select
                      value={formData.train_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, train_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть поїзд" />
                      </SelectTrigger>
                      <SelectContent>
                        {trains.map((train) => (
                          <SelectItem key={train.id} value={train.id}>
                            {train.number} - {train.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Платформа</Label>
                    <Input
                      id="platform"
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      placeholder="1A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure_station_id">
                      Станція відправлення
                    </Label>
                    <Select
                      value={formData.departure_station_id}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          departure_station_id: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть станцію" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name} ({station.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival_station_id">Станція прибуття</Label>
                    <Select
                      value={formData.arrival_station_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, arrival_station_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть станцію" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name} ({station.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure_time">Час відправлення</Label>
                    <Input
                      id="departure_time"
                      type="time"
                      value={formData.departure_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departure_time: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival_time">Час прибуття</Label>
                    <Input
                      id="arrival_time"
                      type="time"
                      value={formData.arrival_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arrival_time: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">За розкладом</SelectItem>
                        <SelectItem value="delayed">Затримка</SelectItem>
                        <SelectItem value="departed">Відправився</SelectItem>
                        <SelectItem value="arrived">Прибув</SelectItem>
                        <SelectItem value="cancelled">Скасовано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delay_minutes">Затримка (хв)</Label>
                    <Input
                      id="delay_minutes"
                      type="number"
                      min="0"
                      value={formData.delay_minutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delay_minutes: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Ціна (₴)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available_seats">Доступні місця</Label>
                  <Input
                    id="available_seats"
                    type="number"
                    min="0"
                    value={formData.available_seats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_seats: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Скасувати
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? 'Оновити' : 'Створити'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border border-border rounded-lg p-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg">
                      {schedule.trains.number}
                    </span>
                    <span className="text-muted-foreground">
                      {schedule.trains.name}
                    </span>
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {schedule.departure_station.name} →{' '}
                    {schedule.arrival_station.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      {schedule.departure_time} - {schedule.arrival_time}
                    </span>
                    {schedule.platform && (
                      <span>Платформа {schedule.platform}</span>
                    )}
                    <span>₴{schedule.price}</span>
                    <span>Місць: {schedule.available_seats}</span>
                    {schedule.delay_minutes > 0 && (
                      <span className="text-red-400">
                        +{schedule.delay_minutes}хв
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(schedule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
