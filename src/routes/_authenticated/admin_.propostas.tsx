import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin_/propostas")({
  head: () => ({ meta: [{ title: "Propostas — Newloc" }] }),
  component: Page,
});

type FleetProposal = {
  id: string; company_name: string; cnpj: string | null; contact_name: string;
  email: string; phone: string; vehicle_count: number; category: string | null;
  term_months: number | null; city: string | null; message: string | null;
  status: string; created_at: string;
};

type SubscriptionLead = {
  id: string; full_name: string; email: string; phone: string;
  city: string | null; car_id: string | null; term_months: number | null;
  message: string | null; status: string; created_at: string;
};

const STATUSES = ["novo", "em_contato", "convertido", "perdido"] as const;

function Page() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState("frota");

  const { data: proposals, isLoading: lp } = useQuery({
    queryKey: ["fleet-proposals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fleet_proposals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as FleetProposal[];
    },
    enabled: isAdmin,
  });

  const { data: leads, isLoading: ll } = useQuery({
    queryKey: ["subscription-leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscription_leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as SubscriptionLead[];
    },
    enabled: isAdmin,
  });

  async function updateStatus(table: "fleet_proposals" | "subscription_leads", id: string, status: string) {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado");
    qc.invalidateQueries({ queryKey: [table === "fleet_proposals" ? "fleet-proposals" : "subscription-leads"] });
  }

  async function remove(table: "fleet_proposals" | "subscription_leads", id: string) {
    if (!confirm("Remover este registro?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removido");
    qc.invalidateQueries({ queryKey: [table === "fleet_proposals" ? "fleet-proposals" : "subscription-leads"] });
  }

  if (loading || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link>
            </Button>
            <h1 className="font-display text-xl font-bold">Propostas e leads</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="frota">Frota ({proposals?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="assinatura">Assinatura ({leads?.length ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="frota" className="mt-6 space-y-4">
            {lp ? <Loader2 className="mx-auto mt-12 h-6 w-6 animate-spin text-brand" /> :
              !proposals?.length ? <EmptyState text="Nenhuma proposta recebida ainda." /> :
              proposals.map((p) => (
                <Card key={p.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold">{p.company_name}</h3>
                        <Badge variant="outline">{p.vehicle_count} veículo(s)</Badge>
                        {p.category && <Badge variant="secondary">{p.category}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.contact_name}{p.cnpj ? ` • CNPJ ${p.cnpj}` : ""}{p.city ? ` • ${p.city}` : ""}
                        {p.term_months ? ` • ${p.term_months} meses` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <a className="inline-flex items-center gap-1.5 text-brand hover:underline" href={`mailto:${p.email}`}><Mail className="h-3.5 w-3.5" />{p.email}</a>
                        <a className="inline-flex items-center gap-1.5 text-brand hover:underline" href={`tel:${p.phone}`}><Phone className="h-3.5 w-3.5" />{p.phone}</a>
                      </div>
                      {p.message && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm">{p.message}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={p.status} onValueChange={(v) => updateStatus("fleet_proposals", p.id, v)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => remove("fleet_proposals", p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            }
          </TabsContent>

          <TabsContent value="assinatura" className="mt-6 space-y-4">
            {ll ? <Loader2 className="mx-auto mt-12 h-6 w-6 animate-spin text-brand" /> :
              !leads?.length ? <EmptyState text="Nenhum interesse de assinatura recebido ainda." /> :
              leads.map((l) => (
                <Card key={l.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold">{l.full_name}</h3>
                        {l.term_months && <Badge variant="outline">{l.term_months} meses</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{l.city ?? "Cidade não informada"}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <a className="inline-flex items-center gap-1.5 text-brand hover:underline" href={`mailto:${l.email}`}><Mail className="h-3.5 w-3.5" />{l.email}</a>
                        <a className="inline-flex items-center gap-1.5 text-brand hover:underline" href={`tel:${l.phone}`}><Phone className="h-3.5 w-3.5" />{l.phone}</a>
                      </div>
                      {l.message && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm">{l.message}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={l.status} onValueChange={(v) => updateStatus("subscription_leads", l.id, v)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" onClick={() => remove("subscription_leads", l.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            }
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <Card className="p-12 text-center text-muted-foreground">{text}</Card>;
}
