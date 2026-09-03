import { CarCard, type Car } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { buildWhatsappLink } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export function CarGrid({
  cars, isLoading, emptyText, whatsappMessage,
}: { cars: Car[]; isLoading: boolean; emptyText: string; whatsappMessage: string }) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-96 animate-pulse rounded-xl bg-muted" />)}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-12 text-center">
        <p className="text-muted-foreground">{emptyText}</p>
        <div className="mt-6">
          <Button asChild>
            <a href={buildWhatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />Falar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((c) => <CarCard key={c.id} car={c} />)}
    </div>
  );
}
