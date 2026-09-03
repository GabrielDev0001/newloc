import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard, carStatusTag, type Car } from "@/components/CarCard";
import { UsoParticularAlert } from "@/components/UsoParticularAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BRAND } from "@/lib/constants";
import { CalendarCheck, ShieldCheck, Wrench, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/assinatura")({
  head: () => ({
    meta: [
      { title: `Carro por assinatura — ${BRAND.name}` },
      { name: "description", content: "Carro por assinatura para pessoa física, de 12 a 36 meses. Não disponível para motoristas de aplicativo." },
      { property: "og:title", content: `Carro por assinatura — ${BRAND.name}` },
      { property: "og:description", content: "Plano estendido, manutenção e gestão de multas inclusos. PF, uso particular." },
    ],
  }),
  component: AssinaturaPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  car_id: z.string().uuid().optional().or(z.literal("")),
  term_months: z.coerce.number().int().min(1).max(120).optional(),
  message: z.string().max(1000).optional().or(z.literal("")),
  not_for_app_acknowledged: z.literal(true, { errorMap: () => ({ message: "É necessário aceitar o termo" }) }),
});

function AssinaturaPage() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", city: "", car_id: "",
    term_months: "", message: "",
  });
  const [accepted, setAccepted] = useState(false);

  function set<K extends string>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  const { data: cars, isLoading } = useQuery({
    queryKey: ["public-cars", "assinatura"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("segment", "assinatura")
        .order("available", { ascending: false })
        .order("price_weekly", { ascending: true });
      if (error) throw error;
      return data as Car[];
    },
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      term_months: form.term_months || undefined,
      not_for_app_acknowledged: accepted,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os dados");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("subscription_leads").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city || null,
      car_id: parsed.data.car_id || null,
      term_months: parsed.data.term_months ?? null,
      message: parsed.data.message || null,
      not_for_app_acknowledged: true,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    setDone(true);
    toast.success("Interesse registrado! Entraremos em contato.");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Pessoa física — uso particular
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-dark md:text-5xl">
                Carro por assinatura, sem dor de cabeça
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
                Planos de 12 a 36 meses com manutenção, gestão de multas e documentação inclusos.
                Você dirige, a Newloc cuida do resto.
              </p>
              <UsoParticularAlert className="mt-6" />
            </div>
          </div>
        </section>

        <section className="border-b border-border py-14">
          <div className="container mx-auto px-4">
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              {[
                { icon: CalendarCheck, t: "12, 24 ou 36 meses", d: "Você escolhe o prazo que cabe no seu planejamento." },
                { icon: Wrench, t: "Manutenção inclusa", d: "Revisões, óleo e pneus por nossa conta." },
                { icon: ShieldCheck, t: "Gestão de multas e documentação", d: "IPVA, licenciamento e gestão de multas inclusos na mensalidade." },
              ].map((b) => (
                <div key={b.t} className="flex items-start gap-4 rounded-2xl border border-border p-5">
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
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Modelos disponíveis</h2>
            <p className="mt-2 text-muted-foreground">Selecione um carro para incluir no formulário de interesse.</p>

            <div className="mt-8">
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />)}
                </div>
              ) : cars && cars.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cars.map((c) => <CarCard key={c.id} car={c} period="mês" />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-12 text-center text-muted-foreground">
                  Em breve, novos modelos disponíveis para assinatura.
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="interesse" className="border-t border-border bg-secondary/30 py-16">
          <div className="container mx-auto max-w-2xl px-4">
            <Card className="p-6 shadow-card md:p-8">
              {done ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <CheckCircle2 className="h-14 w-14 text-brand" />
                  <h3 className="mt-4 font-display text-2xl font-bold">Interesse registrado!</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Vamos entrar em contato em breve com as próximas etapas da assinatura.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold">Tenho interesse na assinatura</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha os dados e um consultor entrará em contato.
                  </p>
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="full_name">Nome completo *</Label>
                        <Input id="full_name" required maxLength={120} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" required maxLength={160} value={form.email} onChange={(e) => set("email", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" required maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                      </div>


                      <div>
                        <Label>Prazo desejado (meses)</Label>
                        <Select value={form.term_months || undefined} onValueChange={(v) => set("term_months", v)}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {["12", "24", "36"].map((m) => <SelectItem key={m} value={m}>{m} meses</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      {cars && cars.length > 0 && (
                        <div className="sm:col-span-2">
                          <Label>Carro de interesse</Label>
                          <Select value={form.car_id || undefined} onValueChange={(v) => set("car_id", v)}>
                            <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                            <SelectContent>
                              {cars.filter((c) => !carStatusTag(c)).map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — Grupo {c.group_code}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="message">Observações</Label>
                      <Textarea id="message" rows={3} maxLength={1000} value={form.message} onChange={(e) => set("message", e.target.value)} />
                    </div>

                    <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
                      <Checkbox checked={accepted} onCheckedChange={(c) => setAccepted(c === true)} className="mt-0.5" />
                      <span className="text-foreground">
                        Declaro que <strong>não utilizarei o veículo para transporte de passageiros
                        por aplicativo</strong> (Uber, 99, InDriver ou similares). *
                      </span>
                    </label>

                    <Button type="submit" disabled={submitting || !accepted} className="w-full bg-brand text-brand-foreground hover:bg-brand-dark">
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Enviar interesse
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
