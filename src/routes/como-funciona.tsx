import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona o aluguel — Newloc" },
      { name: "description", content: "Passo a passo para alugar seu carro com a Newloc: escolha, documentação, retirada e suporte." },
      { property: "og:title", content: "Como funciona — Newloc" },
      { property: "og:description", content: "Aluguel sem mistério: escolha, documente, retire e rode." },
    ],
  }),
  component: ComoFuncionaPage,
});

function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto max-w-3xl px-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">Como funciona</p>
            <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">Simples, sem mistério</h1>
            <p className="mt-6 text-lg text-white/80">Em poucos passos você está com a chave na mão.</p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { n: "01", t: "Escolha seu carro", d: "Navegue pela frota, filtre por cidade e categoria e selecione o grupo." },
                { n: "02", t: "Envie sua documentação", d: "CNH com EAR, comprovante de residência e CPF regular. A análise é rápida." },
                { n: "03", t: "Retire na loja", d: "Após aprovação, retire o carro na cidade selecionada com tudo pronto." },
                { n: "04", t: "Rode tranquilo", d: "Manutenção, gestão de multas e suporte 24h estão inclusos. Foque em rodar." },
              ].map((s) => (
                <Card key={s.n} className="p-6">
                  <span className="font-display text-4xl font-bold text-brand/70">{s.n}</span>
                  <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-muted-foreground">{s.d}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-display text-3xl font-bold">Documentação necessária</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "CNH definitiva categoria B com EAR",
                  "Comprovante de residência (últimos 90 dias)",
                  "CPF regular na Receita Federal",
                  "Cadastro ativo em app de transporte",
                ].map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-brand" />{d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 rounded-2xl bg-secondary/40 p-8 text-center">
              <h2 className="font-display text-2xl font-bold">Perguntas frequentes</h2>
              <Accordion type="single" collapsible className="mt-6 text-left">
                {[
                  { q: "Quanto tempo leva a análise?", a: "De 1 a 2 dias úteis após o envio completo dos documentos." },
                  { q: "Posso trocar de carro?", a: "Para aplicativo, sim, a qualquer momento, mediante disponibilidade de veículo em pátio (consulte condições e taxas com a nossa central de atendimento). Para frota e assinatura, a troca pode ser solicitada após o término do prazo mínimo do contrato." },
                  { q: "Tem caução?", a: "Sim, valor reembolsável definido por grupo. Informado antes da retirada." },
                  { q: "E se eu tiver um sinistro?", a: "Acione o suporte 24h. Cuidamos do reboque e do carro reserva quando aplicável." },
                ].map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`}>
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-10 text-center">
              <Button asChild size="lg" className="bg-brand-gradient text-brand-foreground">
                <Link to="/" hash="carros">Ver frota disponível</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
