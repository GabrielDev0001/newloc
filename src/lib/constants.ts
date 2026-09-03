export const BRAND = {
  name: "Newloc",
  tagline: "Locação de veículos",
  whatsapp: "(31) 98119-9021", // Exibição. O link é montado só com os dígitos + DDI 55.
  email: "centraldeatendimento@newloclocacao.com.br",
  phone: "(31) 98119-9021",
};

export const SEGMENTS = {
  aplicativo: {
    slug: "aplicativo",
    label: "Carro para aplicativo",
    short: "Aplicativo",
    description: "Aluguel semanal para motoristas de Uber, 99 e InDrive.",
  },
  frota: {
    slug: "frota",
    label: "Frota para empresas",
    short: "Frota",
    description: "Veículos utilitários e leves para sua operação.",
  },
  assinatura: {
    slug: "assinatura",
    label: "Carro por assinatura",
    short: "Assinatura",
    description: "Plano estendido para pessoa física. Não disponível para motoristas de aplicativo.",
  },
} as const;

export type CarSegment = "aplicativo" | "assinatura" | "diaria" | "mensal";
export type CarPeriod = "semana" | "mês" | "diária";

/** Metadados de cada segmento de carro (rótulo, período de cobrança e rótulo do preço). */
export const CAR_SEGMENTS: Record<
  CarSegment,
  { label: string; period: CarPeriod; priceLabel: string }
> = {
  aplicativo: { label: "Aplicativo", period: "semana", priceLabel: "Preço semanal (R$)" },
  assinatura: { label: "Assinatura", period: "mês", priceLabel: "Preço mensal (R$)" },
  diaria: { label: "Diária", period: "diária", priceLabel: "Preço da diária (R$)" },
  mensal: { label: "Mensal", period: "mês", priceLabel: "Preço mensal (R$)" },
};

export function segmentOf(segment?: string | null): CarSegment {
  return segment && segment in CAR_SEGMENTS ? (segment as CarSegment) : "aplicativo";
}

/** Preço exibido: a diária cobra por dia, os demais segmentos usam price_weekly. */
export function segmentPrice(car: { price_weekly: number; price_daily?: number | null; segment?: string | null }) {
  const seg = segmentOf(car.segment);
  if (seg === "diaria") return Number(car.price_daily ?? car.price_weekly);
  return Number(car.price_weekly);
}

/** km_included = 0 significa quilometragem livre. */
export function kmLabel(kmIncluded: number | null | undefined) {
  return Number(kmIncluded) > 0 ? `${kmIncluded} km/mês` : "KM livre";
}

const WHATSAPP_DIGITS = (() => {
  const digits = BRAND.whatsapp.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
})();

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`;
}
