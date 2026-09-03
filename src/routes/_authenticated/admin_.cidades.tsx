import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin_/cidades")({
  head: () => ({ meta: [{ title: "Cidades — Newloc Admin" }] }),
  component: CidadesPage,
});

type City = {
  id: string; name: string; state: string;
  address: string | null; phone: string | null; hours: string | null;
  active: boolean;
};

const empty: Partial<City> = { name: "", state: "SP", address: "", phone: "", hours: "", active: true };

function CidadesPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<City>>(empty);

  useEffect(() => {
    if (!loading && !isAdmin) { toast.error("Acesso restrito"); navigate({ to: "/" }); }
  }, [isAdmin, loading, navigate]);

  const { data: cities, isLoading } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").order("name");
      if (error) throw error;
      return data as City[];
    },
    enabled: isAdmin,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: editing.name!,
      state: editing.state || "SP",
      address: editing.address || null,
      phone: editing.phone || null,
      hours: editing.hours || null,
      active: editing.active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("cities").update(payload).eq("id", editing.id)
      : await supabase.from("cities").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Cidade atualizada" : "Cidade adicionada");
    setOpen(false); setEditing(empty);
    qc.invalidateQueries({ queryKey: ["admin-cities"] });
    qc.invalidateQueries({ queryKey: ["admin-cities-min"] });
    qc.invalidateQueries({ queryKey: ["public-cities"] });
  }

  async function remove(id: string) {
    if (!confirm("Remover esta cidade? Carros vinculados ficarão sem cidade.")) return;
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cidade removida");
    qc.invalidateQueries({ queryKey: ["admin-cities"] });
    qc.invalidateQueries({ queryKey: ["public-cities"] });
  }

  if (loading || !isAdmin) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
            <h1 className="font-display text-xl font-bold">Cidades / Lojas</h1>
          </div>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(empty)} className="bg-brand-gradient text-brand-foreground">
                <Plus className="mr-2 h-4 w-4" />Nova cidade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>{editing.id ? "Editar cidade" : "Nova cidade"}</DialogTitle></DialogHeader>
              <form onSubmit={save} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                  <div><Label>Cidade *</Label><Input required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                  <div><Label>UF *</Label><Input required maxLength={2} value={editing.state ?? ""} onChange={(e) => setEditing({ ...editing, state: e.target.value.toUpperCase() })} /></div>
                </div>
                <div><Label>Endereço</Label><Input value={editing.address ?? ""} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Telefone</Label><Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
                  <div><Label>Horário</Label><Input value={editing.hours ?? ""} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} placeholder="Seg-Sex 8h-18h" /></div>
                </div>
                <div className="flex items-center gap-3"><Switch checked={editing.active ?? true} onCheckedChange={(c) => setEditing({ ...editing, active: c })} /><Label>Ativa (visível no site)</Label></div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-brand-gradient text-brand-foreground">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-brand" /></div>
          ) : !cities?.length ? (
            <div className="p-12 text-center text-muted-foreground">Nenhuma cidade cadastrada.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name} <span className="text-muted-foreground">— {c.state}</span></TableCell>
                    <TableCell className="text-muted-foreground">{c.address ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone ?? "—"}</TableCell>
                    <TableCell>{c.active ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativa</Badge> : <Badge variant="secondary">Inativa</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}
