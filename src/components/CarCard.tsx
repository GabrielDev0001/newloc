import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Gauge, Car as CarIcon, ArrowRight } from "lucide-react";
import { buildWhatsappLink } from "@/lib/constants";

export type Car = {
  id: string;
  name: string;
  group_code: string;
  category: string;
  description: string | null;
  image_url: string | null;
  price_weekly: number;
  price_original: number | null;
  price_daily?: number | null;
  km_included: number;
  city: string;
  city_id: string | null;
  available: boolean;
  segment?: string;
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export function CarCard({ car, period = "semana" }: { car: Car; period?: "semana" | "mês" }) {
  const hasDiscount = car.price_original && Number(car.price_original) > Number(car.price_weekly);
  const link = buildWhatsappLink(
    `Olá! Quero alugar o ${car.name} (ou similar) por R$ ${car.price_weekly}/${period}.`
  );


  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-card">
      <Link
        to="/carros/$id"
        params={{ id: car.id }}
        className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-accent"
      >
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={car.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <CarIcon className="h-16 w-16" />
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-brand-gradient text-brand-foreground border-0">
          {car.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {car.category}
          </p>
          <Link to="/carros/$id" params={{ id: car.id }}>
            <h3 className="mt-1 font-display text-xl font-bold text-foreground hover:text-brand transition-colors">
              {car.name} <span className="text-muted-foreground font-normal text-base">ou similares</span>
            </h3>
          </Link>
        </div>

        {car.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{car.km_included} km/mês</span>
        </div>


        <div className="mt-auto rounded-lg bg-secondary p-4">
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">de {brl(Number(car.price_original))}</p>
          )}
          <p className="text-xs text-muted-foreground">por</p>
          <p className="font-display text-3xl font-bold text-brand">
            {brl(Number(car.price_weekly))}
            <span className="text-sm font-normal text-muted-foreground"> / {period}</span>
          </p>
          {car.price_daily && period === "semana" ? (
            <p className="mt-1 text-xs text-muted-foreground">
              ou {brl(Number(car.price_daily))} / diária
            </p>
          ) : null}
        </div>


        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline">
            <Link to="/carros/$id" params={{ id: car.id }}>
              Detalhes <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="bg-brand-gradient text-brand-foreground hover:opacity-95">
            <a href={link} target="_blank" rel="noopener noreferrer">Reservar</a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
