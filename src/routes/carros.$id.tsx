import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buildWhatsappLink, BRAND } from "@/lib/constants";
import { ArrowLeft, Car as CarIcon, Gauge, MapPin, ShieldCheck, Wrench, Sparkles, Phone, MessageCircle, Loader2 } from "lucide-react";

type CarDetail = {
  id: string; name: string; group_code: string; category: string;
  description: string | null; image_url: string | null;
  price_weekly: number; price_original: number | null;
  km_included: number; city: string; available: boolean;
  cities: { name: string; state: string; address: string | null; phone: string | null; hours: string | null } | null;
};

export const Route = createFileRoute("/carros/$id")({
  component: CarDetailPage,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center"><p>{error.message}</p></div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Carro não encontrado.</p>
      <Button asChild><Link to="/">Voltar</Link></Button>
    </div>
  ),
});

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

function CarDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["car-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*, cities(name,state,address,phone,hours)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as CarDetail;
    },
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  if (error || !data) return null;

  const car = data;
  const hasDiscount = car.price_original && Number(car.price_original) > Number(car.price_weekly);
  const link = buildWhatsappLink(`Olá! Quero alugar o ${car.name} (Grupo ${car.group_code}) por R$ ${car.price_weekly}/semana.`);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Voltar à frota</Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-accent">
              {car.image_url ? (
                <img src={car.image_url} alt={car.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground"><CarIcon className="h-24 w-24" /></div>
              )}
              <Badge className="absolute left-4 top-4 bg-brand-gradient text-brand-foreground border-0">Grupo {car.group_code}</Badge>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{car.category}</p>
              <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{car.name}</h1>
              {car.description && <p className="mt-4 text-lg text-muted-foreground">{car.description}</p>}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Gauge, label: `${car.km_included} km/sem`, sub: "Franquia semanal" },
                { icon: Wrench, label: "Inclusa", sub: "Manutenção" },
                { icon: ShieldCheck, label: "Completo", sub: "Seguro" },
              ].map((f) => (
                <Card key={f.sub} className="p-4">
                  <f.icon className="h-5 w-5 text-brand" />
                  <p className="mt-2 font-semibold">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.sub}</p>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold">O que está incluso</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {["Manutenção preventiva", "Troca de óleo e filtros", "Pneus e revisões", "Seguro auto completo", "Assistência 24h", "Documentação em dia"].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4 text-brand" />{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              {hasDiscount && (
                <p className="text-sm text-muted-foreground line-through">de {brl(Number(car.price_original))}</p>
              )}
              <p className="text-sm text-muted-foreground">a partir de</p>
              <p className="font-display text-4xl font-bold text-brand">
                {brl(Number(car.price_weekly))}
                <span className="text-base font-normal text-muted-foreground"> / semana</span>
              </p>

              <Button asChild size="lg" className="mt-6 w-full bg-brand-gradient text-brand-foreground">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />Reservar pelo WhatsApp
                </a>
              </Button>

              <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand" />
                  <span>
                    <strong>{car.cities?.name ?? car.city}</strong>
                    {car.cities?.state && <> — {car.cities.state}</>}
                    {car.cities?.address && <div className="text-muted-foreground">{car.cities.address}</div>}
                  </span>
                </p>
                {car.cities?.phone && (
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" />{car.cities.phone}</p>
                )}
                {car.cities?.hours && (
                  <p className="text-muted-foreground">{car.cities.hours}</p>
                )}
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Dúvidas? Fale com a {BRAND.name} pelo WhatsApp.
              </p>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
