import heroImg from "@/assets/hero-car.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero text-white">
      <div className="absolute inset-0 opacity-40">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.07_260)] via-[oklch(0.18_0.07_260)/0.7] to-transparent" />
      </div>

      <div className="container relative mx-auto grid gap-12 px-4 py-24 md:py-32 lg:grid-cols-2 lg:py-40">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Aluguel semanal para motoristas de app
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Rode mais. <br />
            <span className="bg-gradient-to-r from-sky-300 to-blue-100 bg-clip-text text-transparent">
              Pague menos.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/80">
            Carros novos, manutenção inclusa e quilometragem generosa. Alugue por semana e
            ganhe mais nas corridas do seu app.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-white text-brand-dark hover:bg-white/90">
              <a href="#carros">Ver carros disponíveis<ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <a href="#como-funciona">Como funciona</a>
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
  );
}
