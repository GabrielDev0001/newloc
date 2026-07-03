import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { LocationMap } from "@/components/LocationMap";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Briefcase, CalendarCheck, ShieldCheck, Wrench, Headphones } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND.name} — Locação de veículos para aplicativo, empresas e assinatura` },
      { name: "description", content: "Aluguel de carros para motoristas de aplicativo, frota para empresas e planos de assinatura. Atendimento consultivo, manutenção inclusa e suporte 24h." },
      { property: "og:title", content: `${BRAND.name} — Locação de veículos` },
      { property: "og:description", content: "Aplicativo, Frota e Assinatura. Escolha a solução ideal para você." },
    ],
  }),
  component: Index,
});

const solutions = [
  {
    to: "/aplicativo" as const,
    icon: Car,
    title: "Carro para aplicativo",
    desc: "Aluguel semanal para motoristas de Uber, 99 e InDriver. Manutenção, seguro e suporte inclusos.",
    cta: "Ver carros disponíveis",
    highlight: true,
  },
  {
    to: "/frota" as const,
    icon: Briefcase,
    title: "Frota para empresas",
    desc: "Veículos leves e utilitários para sua operação. Monte uma proposta sob medida com um consultor.",
    cta: "Solicitar proposta",
  },
  {
    to: "/assinatura" as const,
    icon: CalendarCheck,
    title: "Carro por assinatura",
    desc: "Plano estendido de 12 a 36 meses para pessoa física. Não disponível para motoristas de aplicativo.",
    cta: "Conhecer planos",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero limpo */}
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Locação de veículos
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-brand-dark md:text-6xl">
                A solução certa para cada jeito de rodar
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                Aplicativo, frota empresarial ou assinatura: escolha o caminho e fale com a Newloc.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-brand text-brand-foreground hover:bg-brand-dark">
                  <Link to="/aplicativo">Sou motorista de app <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/frota">Sou empresa</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 segmentos */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Nossas soluções
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Escolha o que combina com você
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {solutions.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`group flex flex-col rounded-2xl border bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                    s.highlight ? "border-brand/40 ring-1 ring-brand/10" : "border-border"
                  }`}
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-brand">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                  <span className="mt-6 inline-flex items-center text-sm font-semibold text-brand">
                    {s.cta}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios curtos */}
        <section className="border-t border-border bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Wrench, title: "Manutenção inclusa", desc: "Revisões, óleo e pneus por nossa conta." },
                { icon: ShieldCheck, title: "Seguro completo", desc: "Cobertura para você focar no que importa." },
                { icon: Headphones, title: "Suporte 24h", desc: "Atendimento dedicado todos os dias." },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{b.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
