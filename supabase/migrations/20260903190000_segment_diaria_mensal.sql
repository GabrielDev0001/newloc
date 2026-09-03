-- Libera os segmentos "diaria" e "mensal" na tabela de carros.
-- O CHECK antigo (criado junto com a coluna) só aceitava 'aplicativo' e 'assinatura'.
ALTER TABLE public.cars DROP CONSTRAINT IF EXISTS cars_segment_check;
ALTER TABLE public.cars
  ADD CONSTRAINT cars_segment_check
  CHECK (segment IN ('aplicativo', 'assinatura', 'diaria', 'mensal'));
