-- Cities/stores
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'SP',
  address TEXT,
  phone TEXT,
  hours TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cities TO authenticated;
GRANT ALL ON public.cities TO service_role;

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view active cities" ON public.cities
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert cities" ON public.cities
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update cities" ON public.cities
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete cities" ON public.cities
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER cities_updated_at BEFORE UPDATE ON public.cities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link cars to cities (keep legacy text column)
ALTER TABLE public.cars ADD COLUMN city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;
CREATE INDEX cars_city_id_idx ON public.cars(city_id);
CREATE INDEX cars_category_idx ON public.cars(category);

-- Seed initial cities
INSERT INTO public.cities (name, state, address, phone, hours) VALUES
  ('São Paulo', 'SP', 'Av. Paulista, 1000 - Bela Vista', '(11) 4000-0000', 'Seg-Sex 8h-18h, Sáb 8h-12h'),
  ('Rio de Janeiro', 'RJ', 'Av. Atlântica, 500 - Copacabana', '(21) 4000-0000', 'Seg-Sex 8h-18h, Sáb 8h-12h'),
  ('Belo Horizonte', 'MG', 'Av. Afonso Pena, 1500 - Centro', '(31) 4000-0000', 'Seg-Sex 8h-18h, Sáb 8h-12h');

-- Backfill city_id on existing cars by name match
UPDATE public.cars c SET city_id = ci.id FROM public.cities ci WHERE c.city = ci.name AND c.city_id IS NULL;