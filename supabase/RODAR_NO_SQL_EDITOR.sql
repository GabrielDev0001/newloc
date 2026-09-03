-- ============================================================================
-- Rodar este bloco no SQL Editor do Supabase (o deploy da Lovable NÃO aplica
-- os arquivos de supabase/migrations automaticamente).
-- Pode rodar mais de uma vez sem problema.
-- ============================================================================

-- 1) Endereço e telefone reais da unidade de Belo Horizonte
UPDATE public.cities
SET address = 'Av. Del Rey, 111 - Torre A, Sala 701 - Caiçaras, Belo Horizonte - MG, 30775-240',
    phone   = '(31) 98119-9021'
WHERE name = 'Belo Horizonte' AND state = 'MG';

-- 2) Novos segmentos: diária e mensal
ALTER TABLE public.cars DROP CONSTRAINT IF EXISTS cars_segment_check;
ALTER TABLE public.cars
  ADD CONSTRAINT cars_segment_check
  CHECK (segment IN ('aplicativo', 'assinatura', 'diaria', 'mensal'));

-- Conferência
SELECT name, state, address, phone FROM public.cities ORDER BY name;
