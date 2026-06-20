import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/constants";
import { Phone, Mail, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-brand-dark">{BRAND.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Soluções</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/aplicativo" className="hover:text-foreground">Carro para aplicativo</Link></li>
            <li><Link to="/frota" className="hover:text-foreground">Frota para empresas</Link></li>
            <li><Link to="/assinatura" className="hover:text-foreground">Carro por assinatura</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Empresa</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-foreground">Sobre a Newloc</Link></li>
            <li><Link to="/como-funciona" className="hover:text-foreground">Como funciona</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Contato</p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{BRAND.phone}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{BRAND.email}</p>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand" />Sem taxa de adesão</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-brand" />Suporte 24h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
