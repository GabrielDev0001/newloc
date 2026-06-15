import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CarCard, type Car } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { CheckCircle2, Wrench, ShieldCheck, Sparkles, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Newloc — Aluguel semanal de carros para motoristas de app" },
      { name: "description", content: "Alugue um carro por semana com a Newloc: manutenção inclusa, quilometragem generosa e suporte 24h para motoristas de Uber, 99 e InDriver." },
      { property: "og:title", content: "Newloc — Aluguel semanal de carros" },
      { property: "og:description", content: "Carros para motoristas de app com planos semanais e suporte 24h." },
    ],
  }),
  component: Index,
});

type City = { id: string; name: string; state: string };

function Index() {
  const [cityId, setCityId] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const { data: cities } = useQuery({
    queryKey: ["public-cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("id,name,state").eq("active", true).order("name");
      if (error) throw error;
      return data as City[];
    },
  });

  const { data: cars, isLoading } = useQuery({
    queryKey: ["public-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true)
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
      if (cityId !== "all" && c.city_id !== cityId) return false;
      if (category !== "all" && c.category !== category) return false;
      return true;
    });
  }, [cars, cityId, category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        <section id="beneficios" className="border-b border-border/40 bg-secondary/40 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Por que Newloc</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
                Tudo o que você precisa para rodar tranquilo
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Wrench, title: "Manutenção inclusa", desc: "Revisões, troca de óleo e pneus por nossa conta." },
                { icon: ShieldCheck, title: "Seguro completo", desc: "Cobertura para você focar no que importa: rodar." },
                { icon: Sparkles, title: "Carros novos", desc: "Frota sempre atualizada, com ar, direção e multimídia." },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="carros" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand">Frota disponível</p>
                <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                  Encontre o carro ideal pra você
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Filtre por cidade e categoria. Reserve em minutos pelo WhatsApp.
                </p>
              </div>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <Select value={cityId} onValueChange={setCityId}>
                <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} — {c.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {(cityId !== "all" || category !== "all") && (
                  <Button variant="ghost" className="mt-4" onClick={() => { setCityId("all"); setCategory("all"); }}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="como-funciona" className="border-y border-border/40 bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">Como funciona</p>
              <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                Em 3 passos você está rodando
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { n: "01", t: "Escolha o carro", d: "Veja a frota disponível e selecione o grupo ideal." },
                { n: "02", t: "Fale com a gente", d: "Reserve via WhatsApp e tire suas dúvidas com um consultor." },
                { n: "03", t: "Retire e comece a rodar", d: "Documentação aprovada e pronto: o carro é seu." },
              ].map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
                  <span className="font-display text-5xl font-bold text-sky-300/70">{s.n}</span>
                  <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-white/70">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="secondary" size="lg">
                <Link to="/como-funciona">Saiba mais sobre o processo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">Perguntas frequentes</p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Dúvidas comuns</h2>

            <Accordion type="single" collapsible className="mt-10">
              {[
                { q: "Preciso ter conta aprovada no app?", a: "Sim. Você precisa ter cadastro ativo em pelo menos um aplicativo de transporte (Uber, 99, InDriver)." },
                { q: "Quais documentos são necessários?", a: "CNH definitiva categoria B com EAR, comprovante de residência e CPF regular." },
                { q: "A manutenção está incluída?", a: "Sim. Revisões, óleo, pneus e seguro estão inclusos no valor semanal." },
                { q: "Posso devolver antes do prazo?", a: "Sim. A devolução pode ser feita a qualquer momento, basta avisar com 24h de antecedência." },
                { q: "Como funciona a quilometragem?", a: "Cada grupo tem uma franquia semanal. Quilômetros excedentes podem ser contratados como pacotes adicionais." },
              ].map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-secondary/50">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold">{BRAND.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{BRAND.tagline}</p>
          </div>
          <div>
            <p className="font-semibold">Empresa</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-foreground">Sobre a Newloc</Link></li>
              <li><Link to="/como-funciona" className="hover:text-foreground">Como funciona</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contato</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" />(11) 99999-9999</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{BRAND.email}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Garantias</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />Sem taxa de adesão</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />Suporte 24h</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />Carros novos</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
