import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { buildWhatsappLink } from "@/lib/constants";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Newloc e gostaria de mais informações.";

export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsappLink(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}