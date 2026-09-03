-- ============================================================================
-- Rodar este bloco no SQL Editor do Supabase (o deploy da Lovable NÃO aplica
-- os arquivos de supabase/migrations automaticamente).
-- Pode rodar mais de uma vez sem problema.
-- ============================================================================

-- 1) Endereço, telefone e horário reais da unidade de Belo Horizonte
UPDATE public.cities
SET address = 'Av. Del Rey, 111 - Torre A, Sala 701 - Caiçaras, Belo Horizonte - MG, 30775-240',
    phone   = '(31) 98119-9021',
    hours   = 'Seg a Sex, 8h às 18h'
WHERE name = 'Belo Horizonte' AND state = 'MG';

-- 2) Novos segmentos: diária e mensal
ALTER TABLE public.cars DROP CONSTRAINT IF EXISTS cars_segment_check;
ALTER TABLE public.cars
  ADD CONSTRAINT cars_segment_check
  CHECK (segment IN ('aplicativo', 'assinatura', 'diaria', 'mensal'));

-- 3) Etiqueta "Breve" e veículos indisponíveis visíveis no feed
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS coming_soon boolean NOT NULL DEFAULT false;
DROP POLICY IF EXISTS "Anyone can view available cars" ON public.cars;
CREATE POLICY "Anyone can view cars" ON public.cars FOR SELECT USING (true);

-- 4) Categoria digitada errada no cadastro
UPDATE public.cars SET category = 'Hatch' WHERE category = 'Chocar';

-- Conferência
SELECT name, state, address, phone, hours FROM public.cities ORDER BY name;
SELECT name, category, segment, available, coming_soon FROM public.cars ORDER BY name;
