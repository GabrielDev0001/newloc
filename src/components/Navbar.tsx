import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/constants";
import { LogOut, Shield, User as UserIcon, Menu, X } from "lucide-react";
import logoAsset from "@/assets/newloc-logo-white.png.asset.json";

const navItems: { to: string; label: string }[] = [
  { to: "/aplicativo", label: "Aplicativo" },
  { to: "/frota", label: "Frota" },
  { to: "/assinatura", label: "Assinatura" },
  { to: "/sobre", label: "Sobre" },
  { to: "/como-funciona", label: "Atendimento" },
];

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-hero text-white backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center" aria-label={BRAND.name}>
          <img src={logoAsset.url} alt={`${BRAND.name} - Locação de Veículos`} className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-white/75 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link>
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()} className="hidden sm:inline-flex">
              <LogOut className="mr-2 h-4 w-4" />Sair
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth"><UserIcon className="mr-2 h-4 w-4" />Entrar</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-hero md:hidden">
          <div className="container mx-auto flex flex-col px-4 py-3">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-white/85"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              {isAdmin && (
                <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
                  <Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link>
                </Button>
              )}
              {user ? (
                <Button variant="ghost" size="sm" onClick={() => { setOpen(false); supabase.auth.signOut(); }}>
                  <LogOut className="mr-2 h-4 w-4" />Sair
                </Button>
              ) : (
                <Button asChild size="sm" variant="ghost" onClick={() => setOpen(false)}>
                  <Link to="/auth"><UserIcon className="mr-2 h-4 w-4" />Entrar</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
