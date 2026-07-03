import { Star, Quote } from "lucide-react";

type Review = {
  name: string;
  when: string;
  text: string;
  tint: string;
};

const reviews: Review[] = [
  {
    name: "Artur L.",
    when: "5 meses atrás",
    text: "Aluguei um carro recentemente, gostei muito da experiência. Me atenderam super bem e o carro estava em ótimas condições, muito top!",
    tint: "from-amber-400/30 to-amber-600/10",
  },
  {
    name: "Jackson H.",
    when: "5 meses atrás",
    text: "Já estou a mais de 1 ano alugando carro, zero problemas, pessoal super educados e atenciosos, melhor custo benefício.",
    tint: "from-teal-400/30 to-teal-600/10",
  },
  {
    name: "José F.",
    when: "3 meses atrás",
    text: "Nunca tive qualquer tipo de problema. Equipe preparada, veículos novos, limpos e conservados. Indiquei para os meus amigos, que estão satisfeitos.",
    tint: "from-slate-400/30 to-slate-600/10",
  },
  {
    name: "Recupera C.",
    when: "4 meses atrás",
    text: "Locadora espetacular, altíssima qualidade, desde o atendimento inicial à entrega do veículo. Veículos extremamente higienizados, empresa super organizada com veículos de alto padrão. Recomendo a todos.",
    tint: "from-rose-400/30 to-rose-600/10",
  },
  {
    name: "Diogo S.",
    when: "5 meses atrás",
    text: "Experiência excelente! Carros muito bem cuidados, atendimento ágil e equipe super atenciosa. Com certeza voltarei a alugar.",
    tint: "from-violet-400/30 to-violet-600/10",
  },
  {
    name: "Giovana S.",
    when: "7 meses atrás",
    text: "Tive a experiência de locar um veículo por diária e não tenho do que reclamar! Do atendimento inicial à locação fui super bem atendida. Sempre minha primeira opção em Belo Horizonte!",
    tint: "from-sky-400/30 to-sky-600/10",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            5,0 no Google — dezenas de avaliações
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">
            O que dizem sobre a Newloc
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Avaliações reais de clientes. Preservamos a identidade dos autores por privacidade.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${r.tint} blur-2xl`}
              />
              <Quote className="h-6 w-6 text-brand/40" />

              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="relative mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                “{r.text}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand/80 to-brand-dark text-sm font-semibold text-brand-foreground">
                    <span className="blur-[3px] select-none">{initials(r.name)}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    <span className="blur-[2px] select-none">{r.name}</span>{" "}
                    <span className="text-muted-foreground">— cliente verificado</span>
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
