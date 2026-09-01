import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Car as CarType } from "@/components/CarCard";
import { Pencil, Trash2, Plus, ArrowLeft, Loader2, Upload, Building2, Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel — Newloc" }] }),
  component: AdminPage,
});

type City = { id: string; name: string; state: string };
type FormState = Partial<CarType> & { segment?: string };

const empty: FormState = {
  name: "", group_code: "", category: "Hatch", description: "", image_url: "",
  price_weekly: 0, price_original: null, price_daily: null, km_included: 750, city: "São Paulo",
  city_id: null, available: true, segment: "aplicativo",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FormState>(empty);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Acesso restrito a administradores");
      navigate({ to: "/" });
    }
  }, [isAdmin, loading, navigate]);

  const { data: cars, isLoading } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as CarType[];
    },
    enabled: isAdmin,
  });

  const { data: cities } = useQuery({
    queryKey: ["admin-cities-min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("id,name,state").order("name");
      if (error) throw error;
      return data as City[];
    },
    enabled: isAdmin,
  });

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("car-images").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data, error: urlErr } = await supabase.storage.from("car-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (urlErr) throw urlErr;
      setEditing((e) => ({ ...e, image_url: data.signedUrl }));
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const selectedCity = cities?.find((c) => c.id === editing.city_id);
    const payload = {
      name: editing.name!,
      group_code: editing.group_code ?? "",
      category: editing.category!,
      description: editing.description ?? null,
      image_url: editing.image_url || null,
      price_weekly: Number(editing.price_weekly),
      price_original: editing.price_original ? Number(editing.price_original) : null,
      price_daily: editing.price_daily ? Number(editing.price_daily) : null,
      km_included: Number(editing.km_included),
      city: selectedCity?.name ?? editing.city ?? "São Paulo",
      city_id: editing.city_id ?? null,
      available: editing.available ?? true,
      segment: editing.segment ?? "aplicativo",
    };
    const { error } = editing.id
      ? await supabase.from("cars").update(payload).eq("id", editing.id)
      : await supabase.from("cars").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Carro atualizado" : "Carro adicionado");
    setOpen(false);
    setEditing(empty);
    qc.invalidateQueries({ queryKey: ["admin-cars"] });
    qc.invalidateQueries({ queryKey: ["public-cars"] });
  }

  async function remove(id: string) {
    if (!confirm("Remover este carro?")) return;
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Carro removido");
    qc.invalidateQueries({ queryKey: ["admin-cars"] });
    qc.invalidateQueries({ queryKey: ["public-cars"] });
  }

  if (loading || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao site</Link></Button>
            <h1 className="font-display text-xl font-bold">Painel — Carros</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/admin/propostas"><Inbox className="mr-2 h-4 w-4" />Propostas</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/admin/cidades"><Building2 className="mr-2 h-4 w-4" />Cidades</Link></Button>
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditing(empty)} className="bg-brand-gradient text-brand-foreground">
                  <Plus className="mr-2 h-4 w-4" />Novo carro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader><DialogTitle>{editing.id ? "Editar carro" : "Novo carro"}</DialogTitle></DialogHeader>
                <form onSubmit={save} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Nome *</Label><Input required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Volkswagen Polo" /></div>
                    <div><Label>Preço diária (R$)</Label><Input type="number" step="0.01" value={editing.price_daily ?? ""} onChange={(e) => setEditing({ ...editing, price_daily: e.target.value ? Number(e.target.value) : null })} placeholder="99.00" /></div>
                    <div><Label>Categoria *</Label>
                      <Select value={editing.category ?? "Hatch"} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Hatch", "Sedan", "SUV", "Picape", "Utilitário"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Cidade *</Label>
                      <Select value={editing.city_id ?? ""} onValueChange={(v) => setEditing({ ...editing, city_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {cities?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.state}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Segmento *</Label>
                      <Select value={editing.segment ?? "aplicativo"} onValueChange={(v) => setEditing({ ...editing, segment: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aplicativo">Aplicativo</SelectItem>
                          <SelectItem value="assinatura">Assinatura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Preço semanal (R$) *</Label><Input type="number" step="0.01" required value={editing.price_weekly ?? 0} onChange={(e) => setEditing({ ...editing, price_weekly: Number(e.target.value) })} /></div>
                    <div><Label>Preço original (R$)</Label><Input type="number" step="0.01" value={editing.price_original ?? ""} onChange={(e) => setEditing({ ...editing, price_original: e.target.value ? Number(e.target.value) : null })} /></div>
                    <div><Label>Km incluso/mês</Label><Input type="number" value={editing.km_included ?? 750} onChange={(e) => setEditing({ ...editing, km_included: Number(e.target.value) })} /></div>
                    <div className="flex items-center gap-3 pt-6"><Switch checked={editing.available ?? true} onCheckedChange={(c) => setEditing({ ...editing, available: c })} /><Label>Disponível</Label></div>
                  </div>

                  <div>
                    <Label>Imagem do carro</Label>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {uploading ? "Enviando..." : "Enviar imagem"}
                      </Button>
                      {editing.image_url && (
                        <img src={editing.image_url} alt="" className="h-16 w-24 rounded object-cover" />
                      )}
                    </div>
                    <Input
                      className="mt-2"
                      placeholder="ou cole uma URL"
                      value={editing.image_url ?? ""}
                      onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    />
                  </div>

                  <div><Label>Descrição</Label><Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button type="submit" className="bg-brand-gradient text-brand-foreground">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-brand" /></div>
          ) : !cars?.length ? (
            <div className="p-12 text-center text-muted-foreground">Nenhum carro cadastrado. Clique em "Novo carro" para começar.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Foto</TableHead>
                  <TableHead>Carro</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Preço/sem</TableHead>
                  <TableHead>Diária</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="h-12 w-20 rounded object-cover" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setEditing(c); setOpen(true); }}
                          className="flex h-12 w-20 items-center justify-center rounded border border-dashed border-border text-muted-foreground hover:border-brand hover:text-brand"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{c.name}<div className="text-xs text-muted-foreground">{c.category}</div></TableCell>
                    <TableCell><Badge variant={c.segment === "assinatura" ? "secondary" : "default"}>{c.segment ?? "aplicativo"}</Badge></TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell className="font-mono">R$ {Number(c.price_weekly).toFixed(2)}</TableCell>
                    <TableCell className="font-mono">{c.price_daily ? `R$ ${Number(c.price_daily).toFixed(2)}` : "—"}</TableCell>
                    <TableCell>{c.available ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disponível</Badge> : <Badge variant="secondary">Indisponível</Badge>}</TableCell>
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
