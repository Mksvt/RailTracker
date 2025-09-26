'use client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { TrainSchedule } from '@/types/types';
import { getStatusColor } from '@/lib/helpers';

type ScheduleListProps = {
  schedules: TrainSchedule[];
  onEdit: (schedule: TrainSchedule) => void;
  onDelete: (id: string) => void;
};

export function ScheduleList({ schedules, onEdit, onDelete }: ScheduleListProps) {
  return (
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
                {schedule.departureStation.name} → {schedule.arrivalStation.name}
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
                {schedule.platform && <span>Платформа {schedule.platform}</span>}
                <span>₴{schedule.price}</span>
                <span>Місць: {schedule.availableSeats}</span>
                {schedule.delayMinutes > 0 && (
                  <span className="text-red-400">+{schedule.delayMinutes}хв</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(schedule)}>
                <Edit className="h-4 w-4" />
              </Button>
              <DeleteConfirmDialog
                title="Видалити розклад?"
                description="Ви впевнені, що хочете видалити цей розклад? Цю дію неможливо скасувати."
                itemInfo={`${schedule.train.number} - ${schedule.departureStation.name} → ${schedule.arrivalStation.name}`}
                onConfirm={() => onDelete(schedule.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
