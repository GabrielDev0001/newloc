import { AlertTriangle } from "lucide-react";

/**
 * Aviso de uso particular: o veículo não pode rodar em app de transporte
 * de passageiros. Vale para assinatura, diária e mensal.
 */
export function UsoParticularAlert({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 ${className}`}>
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <p>
        <strong>Atenção:</strong> este plano é para uso particular.
        Não é permitido utilizar o veículo para transporte de passageiros por aplicativo
        (Uber, 99, InDriver). Para esse uso, conheça nossos <a href="/aplicativo" className="underline">planos de aplicativo</a>.
      </p>
    </div>
  );
}
