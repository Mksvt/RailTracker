-- This script ensures all tables are created and data is seeded properly
-- Run this if you're experiencing "Failed to fetch" errors

-- First, let's make sure all tables exist
-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stations table
CREATE TABLE IF NOT EXISTS public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Ukraine',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trains table
CREATE TABLE IF NOT EXISTS public.trains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'regional' CHECK (type IN ('high_speed', 'intercity', 'regional', 'local')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create train_schedules table
CREATE TABLE IF NOT EXISTS public.train_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id UUID NOT NULL REFERENCES public.trains(id) ON DELETE CASCADE,
  departure_station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  arrival_station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  platform TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delayed', 'cancelled', 'departed', 'arrived')),
  delay_minutes INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  available_seats INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.train_schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view stations" ON public.stations;
DROP POLICY IF EXISTS "Only admins can insert stations" ON public.stations;
DROP POLICY IF EXISTS "Only admins can update stations" ON public.stations;
DROP POLICY IF EXISTS "Only admins can delete stations" ON public.stations;
DROP POLICY IF EXISTS "Anyone can view trains" ON public.trains;
DROP POLICY IF EXISTS "Only admins can insert trains" ON public.trains;
DROP POLICY IF EXISTS "Only admins can update trains" ON public.trains;
DROP POLICY IF EXISTS "Only admins can delete trains" ON public.trains;
DROP POLICY IF EXISTS "Anyone can view train schedules" ON public.train_schedules;
DROP POLICY IF EXISTS "Only admins can insert train schedules" ON public.train_schedules;
DROP POLICY IF EXISTS "Only admins can update train schedules" ON public.train_schedules;
DROP POLICY IF EXISTS "Only admins can delete train schedules" ON public.train_schedules;

-- Recreate policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Stations policies (public read, admin write)
CREATE POLICY "Anyone can view stations" ON public.stations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert stations" ON public.stations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update stations" ON public.stations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete stations" ON public.stations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trains policies (public read, admin write)
CREATE POLICY "Anyone can view trains" ON public.trains
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert trains" ON public.trains
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update trains" ON public.trains
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete trains" ON public.trains
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Train schedules policies (public read, admin write)
CREATE POLICY "Anyone can view train schedules" ON public.train_schedules
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert train schedules" ON public.train_schedules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update train schedules" ON public.train_schedules
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete train schedules" ON public.train_schedules
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample data
-- Insert sample stations
INSERT INTO public.stations (name, code, city, country) VALUES
  ('Київ-Пасажирський', 'KYV', 'Київ', 'Ukraine'),
  ('Львів', 'LVV', 'Львів', 'Ukraine'),
  ('Одеса-Головна', 'ODS', 'Одеса', 'Ukraine'),
  ('Харків-Пасажирський', 'KHR', 'Харків', 'Ukraine'),
  ('Дніпро-Головний', 'DNP', 'Дніпро', 'Ukraine'),
  ('Запоріжжя-1', 'ZAP', 'Запоріжжя', 'Ukraine'),
  ('Полтава-Київська', 'PLT', 'Полтава', 'Ukraine'),
  ('Вінниця', 'VIN', 'Вінниця', 'Ukraine')
ON CONFLICT (code) DO NOTHING;

-- Insert sample trains
INSERT INTO public.trains (number, name, type) VALUES
  ('001К', 'Київ - Львів', 'intercity'),
  ('002К', 'Львів - Київ', 'intercity'),
  ('101И', 'Київ - Одеса', 'intercity'),
  ('102И', 'Одеса - Київ', 'intercity'),
  ('201Р', 'Київ - Харків', 'regional'),
  ('202Р', 'Харків - Київ', 'regional'),
  ('301М', 'Київ - Дніпро', 'high_speed'),
  ('302М', 'Дніпро - Київ', 'high_speed')
ON CONFLICT (number) DO NOTHING;

-- Insert sample train schedules
WITH station_ids AS (
  SELECT name, id FROM public.stations
),
train_ids AS (
  SELECT number, id FROM public.trains
)
INSERT INTO public.train_schedules (
  train_id, 
  departure_station_id, 
  arrival_station_id, 
  departure_time, 
  arrival_time, 
  platform, 
  status, 
  price, 
  available_seats
) VALUES
  -- Київ - Львів
  ((SELECT id FROM train_ids WHERE number = '001К'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   (SELECT id FROM station_ids WHERE name = 'Львів'), 
   '08:30', '14:45', '3', 'scheduled', 450.00, 120),
  
  -- Львів - Київ
  ((SELECT id FROM train_ids WHERE number = '002К'), 
   (SELECT id FROM station_ids WHERE name = 'Львів'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   '16:20', '22:35', '2', 'scheduled', 450.00, 95),
  
  -- Київ - Одеса
  ((SELECT id FROM train_ids WHERE number = '101И'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   (SELECT id FROM station_ids WHERE name = 'Одеса-Головна'), 
   '22:15', '07:30', '5', 'scheduled', 380.00, 150),
  
  -- Одеса - Київ
  ((SELECT id FROM train_ids WHERE number = '102И'), 
   (SELECT id FROM station_ids WHERE name = 'Одеса-Головна'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   '21:45', '06:55', '1', 'scheduled', 380.00, 142),
  
  -- Київ - Харків
  ((SELECT id FROM train_ids WHERE number = '201Р'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   (SELECT id FROM station_ids WHERE name = 'Харків-Пасажирський'), 
   '06:45', '12:20', '4', 'delayed', 320.00, 80),
  
  -- Харків - Київ
  ((SELECT id FROM train_ids WHERE number = '202Р'), 
   (SELECT id FROM station_ids WHERE name = 'Харків-Пасажирський'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   '18:30', '00:05', '6', 'scheduled', 320.00, 67),
  
  -- Київ - Дніпро
  ((SELECT id FROM train_ids WHERE number = '301М'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   (SELECT id FROM station_ids WHERE name = 'Дніпро-Головний'), 
   '09:15', '13:45', '7', 'scheduled', 520.00, 200),
  
  -- Дніпро - Київ
  ((SELECT id FROM train_ids WHERE number = '302М'), 
   (SELECT id FROM station_ids WHERE name = 'Дніпро-Головний'), 
   (SELECT id FROM station_ids WHERE name = 'Київ-Пасажирський'), 
   '15:20', '19:50', '3', 'scheduled', 520.00, 185)
ON CONFLICT DO NOTHING;

-- Update delay for delayed train
UPDATE public.train_schedules 
SET delay_minutes = 25 
WHERE train_id = (SELECT id FROM public.trains WHERE number = '201Р');
