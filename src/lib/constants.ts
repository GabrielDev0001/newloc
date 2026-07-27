export const BRAND = {
  name: "Newloc",
  tagline: "Locação de veículos",
  whatsapp: "5511999999999", // Substitua pelo WhatsApp da Newloc (formato 55DDD9XXXXXXXX)
  email: "contato@newloc.com.br",
  phone: "(31) 98119-1890",
};

export const SEGMENTS = {
  aplicativo: {
    slug: "aplicativo",
    label: "Carro para aplicativo",
    short: "Aplicativo",
    description: "Aluguel semanal para motoristas de Uber, 99 e InDriver.",
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

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}
