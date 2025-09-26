'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StationData } from '@/types/types';

type StationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<StationData, 'id'>) => Promise<void>;
  initialData?: Omit<StationData, 'id'>;
  editing?: boolean;
};

export function StationDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  editing = false,
}: StationDialogProps) {
  const [formData, setFormData] = useState<Omit<StationData, 'id'>>({
    name: '',
    code: '',
    city: '',
    country: 'Ukraine',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        code: '',
        city: '',
        country: 'Ukraine',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Редагувати станцію' : 'Створити станцію'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Оновіть інформацію про станцію'
              : 'Додайте нову залізничну станцію'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва станції</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Київ-Пасажирський"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Код станції</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="KYV"
              required
              maxLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Місто</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Київ"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Країна</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="Ukraine"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button type="submit">
              {editing ? 'Оновити' : 'Створити'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
