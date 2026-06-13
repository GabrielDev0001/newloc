import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, MapPin, Car as CarIcon } from "lucide-react";
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
  km_included: number;
  city: string;
  available: boolean;
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export function CarCard({ car }: { car: Car }) {
  const hasDiscount = car.price_original && Number(car.price_original) > Number(car.price_weekly);
  const link = buildWhatsappLink(
    `Olá! Quero alugar o ${car.name} (Grupo ${car.group_code}) por R$ ${car.price_weekly}/semana.`
  );

  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-accent">
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
          Grupo {car.group_code}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {car.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-foreground">{car.name}</h3>
        </div>

        {car.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{car.km_included} km/sem</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{car.city}</span>
        </div>

        <div className="mt-auto rounded-lg bg-secondary p-4">
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">de {brl(Number(car.price_original))}</p>
          )}
          <p className="text-xs text-muted-foreground">por</p>
          <p className="font-display text-3xl font-bold text-brand">
            {brl(Number(car.price_weekly))}
            <span className="text-sm font-normal text-muted-foreground"> / semana</span>
          </p>
        </div>

        <Button asChild className="bg-brand-gradient text-brand-foreground hover:opacity-95">
          <a href={link} target="_blank" rel="noopener noreferrer">Reservar pelo WhatsApp</a>
        </Button>
      </div>
    </Card>
  );
}
