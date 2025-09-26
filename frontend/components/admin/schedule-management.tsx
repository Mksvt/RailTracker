import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createSchedule, updateSchedule, deleteSchedule, fetchSchedules, fetchTrains, fetchStations } from '../../lib/api';
import { Train, Station, TrainSchedule } from '@/types/types';
import { ScheduleDialog } from '../modals/schedle-modal';
import { ScheduleList } from '../../components/schedule-list';

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TrainSchedule | null>(null);

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
      toast({ title: 'Помилка', description: 'Не вдалося завантажити дані', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTimeForInput = (isoString: string) => isoString ? isoString.slice(0, 16) : '';

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
      const description = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : 'Не вдалося зберегти розклад';
      toast({ title: 'Помилка валідації', description, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      toast({ title: 'Успіх', description: 'Розклад видалено' });
      fetchData();
    } catch {
      toast({ title: 'Помилка', description: 'Не вдалося видалити розклад', variant: 'destructive' });
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

  const resetForm = () => setFormData({
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
        <CardTitle>Управління розкладом</CardTitle>
        <CardDescription>Створення, редагування та видалення розкладу поїздів</CardDescription>
        <ScheduleDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          trains={trains}
          stations={stations}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          editingSchedule={editingSchedule}
          resetForm={resetForm}
        />
      </CardHeader>
      <CardContent>
        <ScheduleList schedules={schedules} onEdit={handleEdit} onDelete={handleDelete} />
      </CardContent>
    </Card>
  );
}
