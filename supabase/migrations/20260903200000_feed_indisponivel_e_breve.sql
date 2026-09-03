-- Veículos indisponíveis passam a aparecer no feed com etiqueta, em vez de sumir.
-- Nova flag "coming_soon" para a etiqueta "Breve".
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS coming_soon boolean NOT NULL DEFAULT false;

-- A policy antiga escondia do público qualquer carro com available = false.
DROP POLICY IF EXISTS "Anyone can view available cars" ON public.cars;
CREATE POLICY "Anyone can view cars" ON public.cars FOR SELECT USING (true);
