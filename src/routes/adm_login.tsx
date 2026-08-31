import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/adm_login")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Newloc Locação" },
      { name: "description", content: "Área restrita da Newloc Locação para gestão da frota e propostas." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso administrativo — Newloc Locação" },
      { property: "og:description", content: "Área restrita da Newloc Locação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdmLoginPage,
});

function AdmLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error("E-mail ou senha inválidos.");
    toast.success("Bem-vindo!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <Card className="w-full max-w-md p-8 shadow-card">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-brand-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">Área administrativa</span>
        </Link>

        <h1 className="mb-1 text-lg font-semibold">Acesso restrito</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Esta área é exclusiva para a equipe Newloc.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="login-password">Senha</Label>
            <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-brand-gradient text-brand-foreground">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
