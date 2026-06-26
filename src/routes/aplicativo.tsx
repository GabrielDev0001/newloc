import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard, type Car } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BRAND, buildWhatsappLink } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/aplicativo")({
  head: () => ({
    meta: [
      { title: `Carro para aplicativo — ${BRAND.name}` },
      { name: "description", content: "Aluguel semanal de carros para motoristas de Uber, 99 e InDriver. Manutenção, seguro e suporte 24h inclusos." },
      { property: "og:title", content: `Carro para aplicativo — ${BRAND.name}` },
      { property: "og:description", content: "Frota nova, planos semanais e atendimento dedicado para motoristas de app." },
    ],
  }),
  component: AplicativoPage,
});

type City = { id: string; name: string; state: string };

function AplicativoPage() {
  const [category, setCategory] = useState<string>("all");

  const { data: cars, isLoading } = useQuery({
    queryKey: ["public-cars", "aplicativo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true)
        .eq("segment", "aplicativo")
        .order("price_weekly", { ascending: true });
      if (error) throw error;
      return data as Car[];
    },
  });

  const categories = useMemo(() => {
    const set = new Set((cars ?? []).map((c) => c.category));
    return Array.from(set).sort();
  }, [cars]);

  const filtered = useMemo(() => {
    return (cars ?? []).filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      return true;
    });
  }, [cars, category]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-hero text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Para motoristas de aplicativo
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
              Rode hoje com o carro certo no seu app
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              Planos semanais, manutenção e seguro inclusos. Compatível com Uber, 99 e InDriver.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="mb-8 lg:max-w-xs">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => <CarCard key={c.id} car={c} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-12 text-center">
                <p className="text-muted-foreground">Nenhum carro encontrado com esses filtros.</p>
                {category !== "all" && (
                  <Button variant="ghost" className="mt-4" onClick={() => setCategory("all")}>

                    Limpar filtros
                  </Button>
                )}
                <div className="mt-6">
                  <Button asChild>
                    <a href={buildWhatsappLink("Olá! Quero alugar um carro para aplicativo.")} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />Falar no WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
