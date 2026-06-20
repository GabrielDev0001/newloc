import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BRAND } from "@/lib/constants";
import { Building2, Truck, Wrench, TrendingDown, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/frota")({
  head: () => ({
    meta: [
      { title: `Frota para empresas — ${BRAND.name}` },
      { name: "description", content: "Locação de frota para empresas: utilitários e veículos leves com manutenção, seguro e gestão. Monte uma proposta sob medida." },
      { property: "og:title", content: `Frota para empresas — ${BRAND.name}` },
      { property: "og:description", content: "Solução B2B de locação. Solicite uma proposta consultiva para sua operação." },
    ],
  }),
  component: FrotaPage,
});

const schema = z.object({
  company_name: z.string().trim().min(2, "Informe o nome da empresa").max(120),
  cnpj: z.string().trim().max(20).optional().or(z.literal("")),
  contact_name: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().email("E-mail inválido").max(160),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  vehicle_count: z.coerce.number().int().min(1).max(9999),
  category: z.string().max(60).optional().or(z.literal("")),
  term_months: z.coerce.number().int().min(1).max(120).optional(),
  city: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

const empty = {
  company_name: "", cnpj: "", contact_name: "", email: "", phone: "",
  vehicle_count: "1", category: "", term_months: "", city: "", message: "",
};

function FrotaPage() {
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends string>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      vehicle_count: form.vehicle_count || "1",
      term_months: form.term_months || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os dados");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("fleet_proposals").insert({
      company_name: parsed.data.company_name,
      cnpj: parsed.data.cnpj || null,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      vehicle_count: parsed.data.vehicle_count,
      category: parsed.data.category || null,
      term_months: parsed.data.term_months ?? null,
      city: parsed.data.city || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    setDone(true);
    setForm(empty);
    toast.success("Proposta enviada! Entraremos em contato em breve.");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Solução para empresas
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-dark md:text-5xl">
                Frota sob medida para a sua operação
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
                Veículos leves e utilitários com manutenção, seguro e gestão integrada.
                Monte uma proposta consultiva com a Newloc.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Por que terceirizar a frota com a Newloc?
              </h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: TrendingDown, t: "Custo previsível", d: "Mensalidade fixa, sem surpresas com manutenção ou desvalorização." },
                  { icon: Wrench, t: "Manutenção gerenciada", d: "Cuidamos das revisões, pneus e sinistros. Sua equipe foca no core." },
                  { icon: Truck, t: "Veículos certos", d: "Hatch, sedan, SUV, picape e utilitário — escolha por demanda." },
                  { icon: Building2, t: "Atendimento consultivo", d: "Um consultor monta o plano ideal para sua operação." },
                ].map((b) => (
                  <div key={b.t} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{b.t}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card id="proposta" className="border-border p-6 shadow-card md:p-8">
              {done ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 className="h-14 w-14 text-brand" />
                  <h3 className="mt-4 font-display text-2xl font-bold">Proposta enviada!</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Nosso time entrará em contato em até 1 dia útil pelo telefone ou e-mail informado.
                  </p>
                  <Button className="mt-6" onClick={() => setDone(false)} variant="outline">
                    Enviar outra proposta
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold">Monte sua proposta</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha os dados e um consultor entra em contato.
                  </p>
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="company_name">Empresa *</Label>
                        <Input id="company_name" required maxLength={120} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" maxLength={20} value={form.cnpj} onChange={(e) => set("cnpj", e.target.value)} placeholder="opcional" />
                      </div>
                      <div>
                        <Label htmlFor="contact_name">Seu nome *</Label>
                        <Input id="contact_name" required maxLength={120} value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" required maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 99999-9999" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" required maxLength={160} value={form.email} onChange={(e) => set("email", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="vehicle_count">Qtd. de veículos *</Label>
                        <Input id="vehicle_count" type="number" min={1} max={9999} required value={form.vehicle_count} onChange={(e) => set("vehicle_count", e.target.value)} />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Select value={form.category || undefined} onValueChange={(v) => set("category", v)}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {["Hatch", "Sedan", "SUV", "Picape", "Utilitário", "Misto"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="term_months">Prazo (meses)</Label>
                        <Input id="term_months" type="number" min={1} max={120} value={form.term_months} onChange={(e) => set("term_months", e.target.value)} placeholder="12, 24, 36..." />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" maxLength={80} value={form.city} onChange={(e) => set("city", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message">Observações</Label>
                      <Textarea id="message" rows={3} maxLength={1000} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Conte sobre sua operação, tipo de uso, kilometragem prevista..." />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-brand text-brand-foreground hover:bg-brand-dark">
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Enviar proposta
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
