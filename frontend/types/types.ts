export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export interface Update {
  id: string
  type: "info" | "warning" | "success" | "delay"
  message: string
  timestamp: string
  trainNumber?: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: string
}

export interface ProtectedActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  requireAuth?: boolean
}

export interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface StationSelectorProps {
  onSearch: (from: string, to: string) => void;
}


export interface TransformedSchedule {
  id: string;
  train_number: string;
  train_name: string;
  train_type: string;
  departure_time: string;
  arrival_time: string;
  from_station_name: string;
  to_station_name: string;
  platform: string | null;
  status: string;
  delay_minutes: number;
  price: string;
  available_seats: number;
}

export interface TrainScheduleBoardProps {
  fromStation: string;
  toStation: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface TrainData {
  id: string;
  number: string;
  name: string;
  type: string;
}

export interface StationData {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface TrainSchedule {
  id: string;
  trainId: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  platform: string | null;
  status: string;
  delayMinutes: number;
  price: number;
  availableSeats: number;
  train: { number: string; name: string };
  departureStation: { name: string };
  arrivalStation: { name: string };
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: string;
}