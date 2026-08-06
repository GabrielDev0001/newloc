GRANT SELECT ON public.cars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;

GRANT SELECT ON public.cities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cities TO authenticated;
GRANT ALL ON public.cities TO service_role;

GRANT INSERT ON public.fleet_proposals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fleet_proposals TO authenticated;
GRANT ALL ON public.fleet_proposals TO service_role;

GRANT INSERT ON public.subscription_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_leads TO authenticated;
GRANT ALL ON public.subscription_leads TO service_role;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;