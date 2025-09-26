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
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
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
  trainId: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  platform: string | null;
  status: string;
  delayMinutes: number;
  price: number;
  availableSeats: number;
  train: { number: string; name: string };
  departureStation: { name: string };
  arrivalStation: { name: string };
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
    trainId: '',
    departureStationId: '',
    arrivalStationId: '',
    departureTime: '',
    arrivalTime: '',
    platform: '',
    status: 'on-time',
    delayMinutes: 0,
    price: 0,
    availableSeats: 0,
  });

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [schedulesData, trainsData, stationsData] = await Promise.all([
        fetchSchedules(),
        fetchTrains(),
        fetchStations(),
      ]);
      setSchedules(schedulesData || []);
      setTrains(trainsData || []);
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

  const formatDateTimeForInput = (isoString: string) => {
    if (!isoString) return '';
    return isoString.slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        price: Number(formData.price),
        availableSeats: Number(formData.availableSeats),
        delayMinutes: Number(formData.delayMinutes),
      };

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, payload);
        toast({ title: 'Успіх', description: 'Розклад оновлено' });
      } else {
        await createSchedule(payload);
        toast({ title: 'Успіх', description: 'Розклад створено' });
      }
      setIsDialogOpen(false);
      setEditingSchedule(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      const errorMessages = error.response?.data?.message;
      const description = Array.isArray(errorMessages)
        ? errorMessages.join(', ')
        : 'Не вдалося зберегти розклад';
      toast({
        title: 'Помилка валідації',
        description,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
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
      trainId: schedule.trainId,
      departureStationId: schedule.departureStationId,
      arrivalStationId: schedule.arrivalStationId,
      departureTime: formatDateTimeForInput(schedule.departureTime),
      arrivalTime: formatDateTimeForInput(schedule.arrivalTime),
      platform: schedule.platform || '',
      status: schedule.status,
      delayMinutes: schedule.delayMinutes,
      price: schedule.price,
      availableSeats: schedule.availableSeats,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      trainId: '',
      departureStationId: '',
      arrivalStationId: '',
      departureTime: '',
      arrivalTime: '',
      platform: '',
      status: 'on-time',
      delayMinutes: 0,
      price: 0,
      availableSeats: 0,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'bg-green-500/20 text-green-400';
      case 'delayed':
        return 'bg-red-500/20 text-red-400';
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
              <Button
                onClick={() => {
                  resetForm();
                  setEditingSchedule(null);
                  setIsDialogOpen(true);
                }}
              >
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
                {/* ... other form fields ... */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainId">Поїзд</Label>
                    <Select
                      value={formData.trainId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, trainId: value })
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
                    <Label htmlFor="departureStationId">
                      Станція відправлення
                    </Label>
                    <Select
                      value={formData.departureStationId}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          departureStationId: value,
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
                    <Label htmlFor="arrivalStationId">Станція прибуття</Label>
                    <Select
                      value={formData.arrivalStationId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, arrivalStationId: value })
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
                    <Label htmlFor="departureTime">Час відправлення</Label>
                    <Input
                      id="departureTime"
                      type="datetime-local"
                      value={formData.departureTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departureTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Час прибуття</Label>
                    <Input
                      id="arrivalTime"
                      type="datetime-local"
                      value={formData.arrivalTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arrivalTime: e.target.value,
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
                        <SelectItem value="on-time">За розкладом</SelectItem>
                        <SelectItem value="delayed">Затримка</SelectItem>
                        <SelectItem value="cancelled">Скасовано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delayMinutes">Затримка (хв)</Label>
                    <Input
                      id="delayMinutes"
                      type="number"
                      min="0"
                      value={formData.delayMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delayMinutes: Number.parseInt(e.target.value) || 0,
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
                  <Label htmlFor="availableSeats">Доступні місця</Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    min="0"
                    value={formData.availableSeats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableSeats: Number.parseInt(e.target.value) || 0,
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
                      {schedule.train.number}
                    </span>
                    <span className="text-muted-foreground">
                      {schedule.train.name}
                    </span>
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {schedule.departureStation.name} →{' '}
                    {schedule.arrivalStation.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      {new Date(schedule.departureTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(schedule.arrivalTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {schedule.platform && (
                      <span>Платформа {schedule.platform}</span>
                    )}
                    <span>₴{schedule.price}</span>
                    <span>Місць: {schedule.availableSeats}</span>
                    {schedule.delayMinutes > 0 && (
                      <span className="text-red-400">
                        +{schedule.delayMinutes}хв
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
                  <DeleteConfirmDialog
                    title="Видалити розклад?"
                    description="Ви впевнені, що хочете видалити цей розклад? Цю дію неможливо скасувати."
                    itemInfo={`${schedule.train.number} - ${schedule.departureStation.name} → ${schedule.arrivalStation.name}`}
                    onConfirm={() => handleDelete(schedule.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
