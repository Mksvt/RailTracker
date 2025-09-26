import {
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Train,
} from 'lucide-react';

export const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    case 'delay':
      return <Clock className="h-4 w-4 text-red-400" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    default:
      return <Info className="h-4 w-4 text-blue-400" />;
  }
};

export const getStatusIcon = (status: string) => {
  const icons: Record<string, JSX.Element> = {
    scheduled: <CheckCircle className="h-4 w-4" />,
    delayed: <AlertCircle className="h-4 w-4" />,
    departed: <Train className="h-4 w-4" />,
  };

  return icons[status] || <Clock className="h-4 w-4" />;
};
