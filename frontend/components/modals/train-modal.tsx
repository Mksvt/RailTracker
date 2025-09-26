'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainData } from '@/types/types';

interface TrainDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { number: string; name: string; type: string }) => void;
  editingTrain: TrainData | null;
}

export function TrainDialog({ open, onClose, onSubmit, editingTrain }: TrainDialogProps) {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: 'regional',
  });

  useEffect(() => {
    if (editingTrain) {
      setFormData({
        number: editingTrain.number,
        name: editingTrain.name,
        type: editingTrain.type,
      });
    } else {
      setFormData({
        number: '',
        name: '',
        type: 'regional',
      });
    }
  }, [editingTrain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTrain ? 'Редагувати поїзд' : 'Створити поїзд'}</DialogTitle>
          <DialogDescription>
            {editingTrain
              ? 'Оновіть інформацію про поїзд'
              : 'Додайте новий поїзд до системи'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Номер поїзда</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              placeholder="001К"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Назва маршруту</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Київ - Львів"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Тип поїзда</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_speed">Швидкісний</SelectItem>
                <SelectItem value="intercity">Міжміський</SelectItem>
                <SelectItem value="regional">Регіональний</SelectItem>
                <SelectItem value="local">Приміський</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit">
              {editingTrain ? 'Оновити' : 'Створити'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
