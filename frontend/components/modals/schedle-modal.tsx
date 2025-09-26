'use client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Station, TrainSchedule } from '@/types/types';

type ScheduleDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  trains: Train[];
  stations: Station[];
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingSchedule: TrainSchedule | null;
  resetForm: () => void;
};

export function ScheduleDialog({
  isOpen,
  setIsOpen,
  trains,
  stations,
  formData,
  setFormData,
  onSubmit,
  editingSchedule,
  resetForm,
}: ScheduleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
        >
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
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Поїзд + Платформа */}
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

          {/* Станції */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureStationId">Станція відправлення</Label>
              <Select
                value={formData.departureStationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, departureStationId: value })
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

          {/* Час */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureTime">Час відправлення</Label>
              <Input
                id="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
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
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Статус, затримка, ціна */}
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

          {/* Місця */}
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Скасувати
            </Button>
            <Button type="submit">{editingSchedule ? 'Оновити' : 'Створити'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
