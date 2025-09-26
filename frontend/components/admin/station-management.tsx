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
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Plus, Edit, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  fetchStations,
  createStation,
  updateStation,
  deleteStation,
} from '@/lib/api';
import { StationData } from '@/types/types';
import { StationDialog } from '../modals/station-modal';

export function StationManagement() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<StationData | null>(
    null
  );

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

  const handleSubmit = async (formData: Omit<StationData, 'id'>) => {
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
    setIsDialogOpen(true);
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
          <Button
            onClick={() => {
              setEditingStation(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Додати станцію
          </Button>
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
                  <DeleteConfirmDialog
                    title="Видалити станцію?"
                    description="Ви впевнені, що хочете видалити цю станцію? Цю дію неможливо скасувати.(Всі пов'язані розклади поїздів повинні бути видалені перед видаленням станції!!)"
                    itemInfo={`${station.name} (${station.code}) - ${station.city}`}
                    onConfirm={() => handleDelete(station.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <StationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        initialData={
          editingStation
            ? {
                name: editingStation.name,
                code: editingStation.code,
                city: editingStation.city,
                country: editingStation.country,
              }
            : undefined
        }
        editing={!!editingStation}
      />
    </Card>
  );
}