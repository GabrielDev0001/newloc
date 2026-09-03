import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarGrid } from "@/components/CarGrid";
import { UsoParticularAlert } from "@/components/UsoParticularAlert";
import { type Car } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/constants";
import { CalendarRange, Receipt, Wrench } from "lucide-react";

export const Route = createFileRoute("/mensal")({
  head: () => ({
    meta: [
      { title: `Aluguel mensal — ${BRAND.name}` },
      { name: "description", content: "Plano mensal de locação, com manutenção e gestão de multas inclusas. Sem burocracia de contrato longo." },
      { property: "og:title", content: `Aluguel mensal — ${BRAND.name}` },
      { property: "og:description", content: "Carro por mês, com manutenção e gestão de multas inclusas." },
    ],
  }),
  component: MensalPage,
});

function MensalPage() {
  const { data: cars, isLoading } = useQuery({
    queryKey: ["public-cars", "mensal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("segment", "mensal")
        .order("available", { ascending: false })
        .order("price_weekly", { ascending: true });
      if (error) throw error;
      return data as Car[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-hero text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Médio prazo
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
              Carro por mês, sem burocracia
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              O plano mensal para quem precisa do carro por mais tempo, com manutenção e
              gestão de multas inclusas na mensalidade.
            </p>
          </div>
        </section>

        <section className="border-b border-border py-14">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: CalendarRange, t: "Mensalidade fixa", d: "Você sabe exatamente quanto vai pagar por mês." },
                { icon: Wrench, t: "Manutenção inclusa", d: "Revisões, óleo e pneus por nossa conta." },
                { icon: Receipt, t: "Gestão de multas", d: "IPVA, licenciamento e gestão de multas inclusos." },
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
            <UsoParticularAlert className="mt-8" />
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Modelos disponíveis</h2>
            <div className="mt-8">
              <CarGrid
                cars={cars ?? []}
                isLoading={isLoading}
                emptyText="Em breve, novos modelos disponíveis para o plano mensal."
                whatsappMessage="Olá! Quero alugar um carro no plano mensal."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
