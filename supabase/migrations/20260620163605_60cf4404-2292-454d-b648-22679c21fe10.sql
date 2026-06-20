
-- 1) segment column on cars
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS segment text NOT NULL DEFAULT 'aplicativo'
  CHECK (segment IN ('aplicativo','assinatura'));

-- 2) Fleet proposals
CREATE TABLE public.fleet_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  cnpj text,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  vehicle_count integer NOT NULL DEFAULT 1,
  category text,
  term_months integer,
  city text,
  message text,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.fleet_proposals TO authenticated;
GRANT INSERT ON public.fleet_proposals TO anon, authenticated;
GRANT ALL ON public.fleet_proposals TO service_role;
ALTER TABLE public.fleet_proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit fleet proposal" ON public.fleet_proposals
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view fleet proposals" ON public.fleet_proposals
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update fleet proposals" ON public.fleet_proposals
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete fleet proposals" ON public.fleet_proposals
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER fleet_proposals_updated_at BEFORE UPDATE ON public.fleet_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Subscription leads
CREATE TABLE public.subscription_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  car_id uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  term_months integer,
  not_for_app_acknowledged boolean NOT NULL DEFAULT false,
  message text,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT must_acknowledge_not_for_app CHECK (not_for_app_acknowledged = true)
);
GRANT SELECT, UPDATE, DELETE ON public.subscription_leads TO authenticated;
GRANT INSERT ON public.subscription_leads TO anon, authenticated;
GRANT ALL ON public.subscription_leads TO service_role;
ALTER TABLE public.subscription_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit subscription lead" ON public.subscription_leads
  FOR INSERT TO anon, authenticated WITH CHECK (not_for_app_acknowledged = true);
CREATE POLICY "Admins view subscription leads" ON public.subscription_leads
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update subscription leads" ON public.subscription_leads
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete subscription leads" ON public.subscription_leads
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER subscription_leads_updated_at BEFORE UPDATE ON public.subscription_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
