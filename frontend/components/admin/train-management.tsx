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
import { Plus, Edit, Trash2, RefreshCw, Train } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchTrains, createTrain, updateTrain, deleteTrain } from '@/lib/api';

interface TrainData {
  id: string;
  number: string;
  name: string;
  type: string;
}

export function TrainManagement() {
  const [trains, setTrains] = useState<TrainData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<TrainData | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: 'regional',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      resetForm();
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
    if (!confirm('Ви впевнені, що хочете видалити цей поїзд?')) return;
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
    setFormData({
      number: train.number,
      name: train.name,
      type: train.type,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      number: '',
      name: '',
      type: 'regional',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high_speed':
        return 'bg-red-500/20 text-red-400';
      case 'intercity':
        return 'bg-blue-500/20 text-blue-400';
      case 'regional':
        return 'bg-green-500/20 text-green-400';
      case 'local':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'high_speed':
        return 'Швидкісний';
      case 'intercity':
        return 'Міжміський';
      case 'regional':
        return 'Регіональний';
      case 'local':
        return 'Приміський';
      default:
        return type;
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
            <CardTitle>Управління поїздами</CardTitle>
            <CardDescription>
              Створення, редагування та видалення поїздів
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Додати поїзд
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTrain ? 'Редагувати поїзд' : 'Створити поїзд'}
                </DialogTitle>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Скасувати
                  </Button>
                  <Button type="submit">
                    {editingTrain ? 'Оновити' : 'Створити'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(train.id)}
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
