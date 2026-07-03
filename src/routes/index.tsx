import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { LocationMap } from "@/components/LocationMap";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Car, Briefcase, CalendarCheck, ShieldCheck, Wrench, Headphones, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";
import heroImg from "@/assets/hero-car.jpg";


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
        {/* Hero com imagem */}
        <section className="relative overflow-hidden bg-hero text-white">
          <div className="absolute inset-0">
            <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.07_260)] via-[oklch(0.18_0.07_260)/0.85] to-[oklch(0.18_0.07_260)/0.3]" />
          </div>

          <div className="container relative mx-auto grid gap-10 px-4 py-24 md:py-32 lg:grid-cols-2 lg:py-40">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Locação de veículos em Belo Horizonte
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                A solução certa <br />
                <span className="bg-gradient-to-r from-sky-300 to-blue-100 bg-clip-text text-transparent">
                  para cada jeito de rodar
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/80">
                Aplicativo, frota empresarial ou assinatura. Manutenção inclusa, seguro completo
                e suporte 24h para você focar no volante.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-brand-dark hover:bg-white/90">
                  <Link to="/aplicativo">Sou motorista de app <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link to="/frota">Sou empresa</Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
                <div>
                  <p className="font-display text-3xl font-bold">+5 mil</p>
                  <p className="mt-1 text-xs text-white/70">Motoristas atendidos</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold">24/7</p>
                  <p className="mt-1 text-xs text-white/70">Suporte dedicado</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold">100%</p>
                  <p className="mt-1 text-xs text-white/70">Manutenção inclusa</p>
                </div>
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

        <Testimonials />

        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
