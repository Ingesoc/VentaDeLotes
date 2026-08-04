import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { project } from "@/constants/project";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${project.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-coffee-green hover:bg-forest-green text-white p-3 rounded-full shadow-2xl transition-transform duration-300 flex items-center justify-center border border-white/20 tap-target hover:scale-110 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
