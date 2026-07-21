import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573000000000" // Reemplazar con número real
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-coffee-green hover:bg-forest-green text-white p-4 rounded-full shadow-2xl transition-colors transition-transform duration-300 flex items-center justify-center border border-white/20 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="overflow-hidden whitespace-nowrap opacity-0 scale-x-[0.01] group-hover:opacity-100 group-hover:scale-x-100 group-hover:translate-x-2 transition-opacity transition-transform duration-500 ease-out origin-left text-sm font-label-bold">
        Chat en Vivo
      </span>
    </a>
  );
}
