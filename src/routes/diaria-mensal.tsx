import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard, type Car } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, buildWhatsappLink } from "@/lib/constants";
import { CalendarDays, CalendarRange, Gauge, MessageCircle, Wrench } from "lucide-react";

export const Route = createFileRoute("/diaria-mensal")({
  head: () => ({
    meta: [
      { title: `Aluguel diária e mensal — ${BRAND.name}` },
      { name: "description", content: "Alugue por diária, com opção de KM livre, ou no plano mensal. Manutenção e gestão de multas inclusas." },
      { property: "og:title", content: `Aluguel diária e mensal — ${BRAND.name}` },
      { property: "og:description", content: "Diária com KM livre ou plano mensal sem burocracia." },
    ],
  }),
  component: DiariaMensalPage,
});

function DiariaMensalPage() {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["public-cars", "diaria-mensal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true)
        .in("segment", ["diaria", "mensal"])
        .order("price_weekly", { ascending: true });
      if (error) throw error;
      return data as Car[];
    },
  });

  const diarias = useMemo(() => (cars ?? []).filter((c) => c.segment === "diaria"), [cars]);
  const mensais = useMemo(() => (cars ?? []).filter((c) => c.segment === "mensal"), [cars]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-hero text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Curto e médio prazo
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
              Alugue por diária ou no plano mensal
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              Precisa do carro por alguns dias ou por um mês inteiro? Escolha o formato que faz sentido
              para você — com manutenção e gestão de multas inclusas.
            </p>
          </div>
        </section>

        <section className="border-b border-border py-14">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, t: "Diária flexível", d: "Retire hoje e devolva quando quiser, sem contrato longo." },
              { icon: Gauge, t: "Opção de KM livre", d: "Nas diárias com KM livre você roda sem se preocupar com franquia." },
              { icon: Wrench, t: "Manutenção inclusa", d: "Revisões, óleo e pneus por nossa conta em todos os planos." },
            ].map((b) => (
              <div key={b.t} className="flex items-start gap-4 rounded-2xl border border-border p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{b.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="diaria">
              <TabsList>
                <TabsTrigger value="diaria"><CalendarDays className="mr-2 h-4 w-4" />Diária</TabsTrigger>
                <TabsTrigger value="mensal"><CalendarRange className="mr-2 h-4 w-4" />Mensal</TabsTrigger>
              </TabsList>

              <TabsContent value="diaria" className="mt-8">
                <CarGrid
                  cars={diarias}
                  isLoading={isLoading}
                  emptyText="Em breve, novos modelos disponíveis para diária."
                  whatsappMessage="Olá! Quero alugar um carro por diária."
                />
              </TabsContent>

              <TabsContent value="mensal" className="mt-8">
                <CarGrid
                  cars={mensais}
                  isLoading={isLoading}
                  emptyText="Em breve, novos modelos disponíveis para o plano mensal."
                  whatsappMessage="Olá! Quero alugar um carro no plano mensal."
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CarGrid({
  cars, isLoading, emptyText, whatsappMessage,
}: { cars: Car[]; isLoading: boolean; emptyText: string; whatsappMessage: string }) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-96 animate-pulse rounded-xl bg-muted" />)}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-12 text-center">
        <p className="text-muted-foreground">{emptyText}</p>
        <div className="mt-6">
          <Button asChild>
            <a href={buildWhatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />Falar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((c) => <CarCard key={c.id} car={c} />)}
    </div>
  );
}
