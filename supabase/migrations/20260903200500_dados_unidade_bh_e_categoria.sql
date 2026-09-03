-- Horário de funcionamento: só comercial, de segunda a sexta (sem sábado).
UPDATE public.cities
SET hours = 'Seg a Sex, 8h às 18h'
WHERE name = 'Belo Horizonte' AND state = 'MG';

-- Categoria digitada errada no cadastro.
UPDATE public.cars SET category = 'Hatch' WHERE category = 'Chocar';
