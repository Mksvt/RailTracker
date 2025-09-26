'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { RefreshCw, User, Shield, UserX, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchProfiles, updateProfile, deleteProfile } from '@/lib/api';
import { UserProfile } from '../../types/types';
import { getRoleColor, getRoleText } from '@/lib/helpers';

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProfiles();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити користувачів',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateProfile(userId, { role: newRole });
      toast({ title: 'Успіх', description: 'Роль користувача оновлено' });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити роль користувача',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteProfile(userId);
      toast({ title: 'Успіх', description: 'Користувача видалено' });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити користувача',
        variant: 'destructive',
      });
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
            <CardTitle>Управління користувачами</CardTitle>
            <CardDescription>
              Перегляд та управління ролями користувачів
            </CardDescription>
          </div>
          <Button onClick={loadUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-border rounded-lg p-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/20 rounded-full">
                    {user.role === 'admin' ? (
                      <Shield className="h-6 w-6 text-primary" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {user.full_name || 'Без імені'}
                      </span>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Зареєстрований:{' '}
                      {new Date(user.created_at).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role === 'user' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'admin')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Зробити адміном
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'user')}
                      className="text-green-400 hover:text-green-300"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Зняти права адміна
                    </Button>
                  )}
                  <DeleteConfirmDialog
                    title="Видалити користувача?"
                    description="Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо скасувати."
                    itemInfo={`${user.full_name || 'Без імені'} (${
                      user.email
                    })`}
                    onConfirm={() => handleDelete(user.id)}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
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
