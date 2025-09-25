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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  fetchStations,
  createStation,
  updateStation,
  deleteStation,
} from '@/lib/api';

interface StationData {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export function StationManagement() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<StationData | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    country: 'Ukraine',
  });

  const { toast } = useToast();

  const loadStations = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStations();

      setStations(data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити станції',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStation) {
        await updateStation(editingStation.id, formData);
        toast({ title: 'Успіх', description: 'Станцію оновлено' });
      } else {
        await createStation(formData);
        toast({ title: 'Успіх', description: 'Станцію створено' });
      }

      setIsDialogOpen(false);
      setEditingStation(null);
      resetForm();
      loadStations();
    } catch (error) {
      console.error('Error saving station:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося зберегти станцію',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю станцію?')) return;

    try {
      await deleteStation(id);
      toast({ title: 'Успіх', description: 'Станцію видалено' });
      loadStations();
    } catch (error) {
      console.error('Error deleting station:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити станцію',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (station: StationData) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      code: station.code,
      city: station.city,
      country: station.country,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      city: '',
      country: 'Ukraine',
    });
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
            <CardTitle>Управління станціями</CardTitle>
            <CardDescription>
              Створення, редагування та видалення залізничних станцій
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Додати станцію
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingStation ? 'Редагувати станцію' : 'Створити станцію'}
                </DialogTitle>
                <DialogDescription>
                  {editingStation
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
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Скасувати
                  </Button>
                  <Button type="submit">
                    {editingStation ? 'Оновити' : 'Створити'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className="border border-border rounded-lg p-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MapPin className="h-8 w-8 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {station.name}
                      </span>
                      <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded font-mono">
                        {station.code}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {station.city}, {station.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(station)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(station.id)}
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
