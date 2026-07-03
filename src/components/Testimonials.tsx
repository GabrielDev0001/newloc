import { Star, Quote } from "lucide-react";
import arturAv from "@/assets/avatars/artur.png.asset.json";
import jacksonAv from "@/assets/avatars/jackson.png.asset.json";
import joseAv from "@/assets/avatars/jose.png.asset.json";
import recuperaAv from "@/assets/avatars/recupera.png.asset.json";
import diogoAv from "@/assets/avatars/diogo.png.asset.json";
import giovanaAv from "@/assets/avatars/giovana.png.asset.json";

type Review = {
  name: string;
  when: string;
  text: string;
  avatar: string;
};

const reviews: Review[] = [
  {
    name: "Artur L.",
    when: "5 meses atrás",
    text: "Aluguei um carro recentemente, gostei muito da experiência. Me atenderam super bem e o carro estava em ótimas condições, muito top!",
    avatar: arturAv.url,
  },
  {
    name: "Jackson H.",
    when: "5 meses atrás",
    text: "Já estou a mais de 1 ano alugando carro, zero problemas, pessoal super educados e atenciosos, melhor custo benefício.",
    avatar: jacksonAv.url,
  },
  {
    name: "José F.",
    when: "3 meses atrás",
    text: "Nunca tive qualquer tipo de problema. Equipe preparada, veículos novos, limpos e conservados. Indiquei para os meus amigos, que estão satisfeitos.",
    avatar: joseAv.url,
  },
  {
    name: "Recupera C.",
    when: "4 meses atrás",
    text: "Locadora espetacular, altíssima qualidade, desde o atendimento inicial à entrega do veículo. Veículos extremamente higienizados, empresa super organizada com veículos de alto padrão. Recomendo a todos.",
    avatar: recuperaAv.url,
  },
  {
    name: "Diogo S.",
    when: "5 meses atrás",
    text: "Experiência excelente! Carros muito bem cuidados, atendimento ágil e equipe super atenciosa. Com certeza voltarei a alugar.",
    avatar: diogoAv.url,
  },
  {
    name: "Giovana S.",
    when: "7 meses atrás",
    text: "Tive a experiência de locar um veículo por diária e não tenho do que reclamar! Do atendimento inicial à locação fui super bem atendida. Sempre minha primeira opção em Belo Horizonte!",
    avatar: giovanaAv.url,
  },
];

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            O que dizem sobre a Newloc
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Comentários reais de clientes publicados no Google.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-brand/15 to-brand/0 blur-2xl" />
              <div className="flex items-start justify-between">
                <Quote className="h-6 w-6 text-brand/40" />
                <GoogleG className="h-4 w-4 opacity-80" />
              </div>

              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="relative mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                “{r.text}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    <span className="select-none blur-[3px]">{r.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{r.when} • via Google</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
