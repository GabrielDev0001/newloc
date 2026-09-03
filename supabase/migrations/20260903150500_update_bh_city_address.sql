-- Update Belo Horizonte store address to the real location
UPDATE public.cities
SET address = 'Av. Del Rey, 111 - Torre A, Sala 701 - Caiçaras, Belo Horizonte - MG, 30775-240'
WHERE name = 'Belo Horizonte' AND state = 'MG';
