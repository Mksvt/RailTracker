import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  itemInfo?: string;
  onConfirm: () => void;
  disabled?: boolean;
  buttonVariant?: 'outline' | 'destructive';
  buttonSize?: 'sm' | 'default' | 'lg';
  trigger?: React.ReactNode;
}

export function DeleteConfirmDialog({
  title,
  description,
  itemInfo,
  onConfirm,
  disabled = false,
  buttonVariant = 'outline',
  buttonSize = 'sm',
  trigger,
}: DeleteConfirmDialogProps) {
  const defaultTrigger = (
    <Button variant={buttonVariant} size={buttonSize} disabled={disabled}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {itemInfo && (
              <>
                <br />
                <span className="font-medium mt-2 block">{itemInfo}</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
