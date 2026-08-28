import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5531981199021";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Newloc e gostaria de mais informações.";

export function WhatsAppFloat() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}