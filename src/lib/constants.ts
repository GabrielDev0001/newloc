export const BRAND = {
  name: "Newloc",
  tagline: "Aluguel de carros para motoristas de aplicativo",
  whatsapp: "5511999999999", // Substitua pelo WhatsApp da Newloc (formato 55DDD9XXXXXXXX)
  email: "contato@newloc.com.br",
};

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}
