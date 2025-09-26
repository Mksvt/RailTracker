'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { Plus, Edit, RefreshCw, Train } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchTrains, createTrain, updateTrain, deleteTrain } from '@/lib/api';
import { getTypeColor, getTypeText } from '../../lib/helpers';
import { TrainData } from '@/types/types';
import { TrainDialog } from '../modals/train-modal';

export function TrainManagement() {
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<TrainData | null>(null);

  const { toast } = useToast();

  const loadTrains = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTrains();
      setTrains(data || []);
    } catch (error) {
      console.error('Error fetching trains:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити поїзди',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrains();
  }, []);

  const handleSubmit = async (formData: {
    number: string;
    name: string;
    type: string;
  }) => {
    try {
      if (editingTrain) {
        await updateTrain(editingTrain.id, formData);
        toast({ title: 'Успіх', description: 'Поїзд оновлено' });
      } else {
        await createTrain(formData);
        toast({ title: 'Успіх', description: 'Поїзд створено' });
      }
      setIsDialogOpen(false);
      setEditingTrain(null);
      loadTrains();
    } catch (error) {
      console.error('Error saving train:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося зберегти поїзд',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTrain(id);
      toast({ title: 'Успіх', description: 'Поїзд видалено' });
      loadTrains();
    } catch (error) {
      console.error('Error deleting train:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити поїзд',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (train: TrainData) => {
    setEditingTrain(train);
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
            <CardTitle>Управління поїздами</CardTitle>
            <CardDescription>
              Створення, редагування та видалення поїздів
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingTrain(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Додати поїзд
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {trains.map((train) => (
            <div
              key={train.id}
              className="border border-border rounded-lg p-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Train className="h-8 w-8 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {train.number}
                      </span>
                      <Badge className={getTypeColor(train.type)}>
                        {getTypeText(train.type)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{train.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(train)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DeleteConfirmDialog
                    title="Видалити поїзд?"
                    description="Ви впевнені, що хочете видалити цей поїзд? Цю дію неможливо скасувати.(Всі пов'язані розклади поїздів повинні бути видалені перед видаленням поїзда!!!)"
                    itemInfo={`${train.number} - ${train.name}`}
                    onConfirm={() => handleDelete(train.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <TrainDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTrain(null);
        }}
        editingTrain={editingTrain}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
