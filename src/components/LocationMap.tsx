import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAPS_URL =
  "https://maps.app.goo.gl/No1CcVz7887Jwzhf7";
const EMBED_URL =
  "https://maps.google.com/maps?q=Newloc%20Loca%C3%A7%C3%A3o%20de%20Ve%C3%ADculos%2C%20Belo%20Horizonte&z=16&output=embed";

export function LocationMap() {
  return (
    <section className="border-t border-border bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Nossa sede
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Venha nos visitar em Belo Horizonte
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Atendimento presencial, test-drive e retirada de veículos no mesmo lugar.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-[1fr_1.4fr]">
          {/* Info */}
          <div className="relative flex flex-col justify-between bg-brand-gradient p-8 text-brand-foreground md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold leading-tight">
                Newloc — Belo Horizonte / MG
              </h3>
              <p className="mt-2 text-sm text-white/85">
                Nossa unidade única, pronta para receber você com atendimento consultivo.
              </p>
            </div>

            <div className="relative mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
                <div>
                  <p className="font-semibold">Horário de atendimento</p>
                  <p className="text-white/80">Segunda a sexta • 8h às 18h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 opacity-90" />
                <div>
                  <p className="font-semibold">Fale com a gente</p>
                  <p className="text-white/80">Suporte 24h para clientes ativos</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8">
              <Button
                asChild
                size="lg"
                className="w-full bg-white text-brand-dark hover:bg-white/90"
              >
                <a href={MAPS_URL} target="_blank" rel="noreferrer">
                  <Navigation className="mr-2 h-4 w-4" />
                  Como chegar
                </a>
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="relative min-h-[340px] lg:min-h-[440px]">
            <iframe
              title="Mapa da sede Newloc em Belo Horizonte"
              src={EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
