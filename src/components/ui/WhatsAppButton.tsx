import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573000000000" // Reemplazar con número real
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-coffee-green hover:bg-forest-green text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-out text-sm font-label-bold whitespace-nowrap">
        Chat en Vivo
      </span>
    </a>
  );
}
