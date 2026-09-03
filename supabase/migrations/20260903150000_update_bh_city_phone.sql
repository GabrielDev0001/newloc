-- Update Belo Horizonte store phone to the real support number
UPDATE public.cities
SET phone = '(31) 98119-9021'
WHERE name = 'Belo Horizonte' AND state = 'MG';
