import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/constants";
import { Car, LogOut, Shield, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-brand-foreground shadow-glow">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            {BRAND.name}
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" hash="carros" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Carros</Link>
          <Link to="/como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Como funciona</Link>
          <Link to="/sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sobre</Link>
          <Link to="/" hash="faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dúvidas</Link>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link>
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />Sair
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link to="/auth"><UserIcon className="mr-2 h-4 w-4" />Entrar</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
