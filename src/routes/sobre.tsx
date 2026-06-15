import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Heart, Users, TrendingUp } from "lucide-react";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Newloc — Aluguel de carros para motoristas de app" },
      { name: "description", content: "Conheça a Newloc: a empresa que cuida de motoristas de aplicativo com frota nova, manutenção inclusa e atendimento próximo." },
      { property: "og:title", content: "Sobre a Newloc" },
      { property: "og:description", content: "Quem somos e por que motoristas escolhem a Newloc." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto max-w-3xl px-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">Sobre nós</p>
            <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
              Feita por quem entende de motorista
            </h1>
            <p className="mt-6 text-lg text-white/80">
              A {BRAND.name} nasceu para resolver a vida de quem roda em aplicativos: carros novos,
              manutenção inclusa e atendimento próximo. Nada de burocracia escondida — só o
              essencial pra você sair dirigindo.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { icon: Heart, t: "Cuidamos do motorista", d: "Você é o centro do negócio. Nosso time conhece o dia a dia e oferece soluções reais." },
                { icon: Award, t: "Frota selecionada", d: "Carros econômicos, novos e revisados, prontos pra alta quilometragem." },
                { icon: Users, t: "Atendimento humano", d: "Suporte por WhatsApp com gente de verdade, 7 dias por semana." },
                { icon: TrendingUp, t: "Cresça com a gente", d: "Aluguel flexível: troque de grupo conforme sua demanda aumenta." },
              ].map((b) => (
                <Card key={b.t} className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-brand-foreground">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{b.t}</h3>
                  <p className="mt-2 text-muted-foreground">{b.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-secondary/40 py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Pronto pra começar?</h2>
            <p className="mt-3 text-muted-foreground">Escolha o carro ideal e fale com a gente.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild size="lg" className="bg-brand-gradient text-brand-foreground"><Link to="/" hash="carros">Ver frota</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/como-funciona">Como funciona</Link></Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
