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
