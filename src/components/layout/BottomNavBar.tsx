import { Link, useLocation } from "react-router";
import { Compass, TrendingUp, Heart, Phone } from "lucide-react";
import type { BottomNavItem } from "@/constants/navLinks";
import { bottomNavItems } from "@/constants/navLinks";

/** Mapa de icono a componente Lucide */
const iconMap = {
  Compass,
  TrendingUp,
  Heart,
  Phone,
} as const;

function BottomNavLink({ item }: { item: BottomNavItem }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.to;
  const Icon = iconMap[item.icon as keyof typeof iconMap];

  return (
    // Contraste: el dorado activo sobre fondo claro era ~2:1; verde bosque
    // mantiene la distinción del ítem activo con contraste suficiente.
    <Link
      to={item.to}
      className={`flex flex-col items-center justify-center active:scale-95 transition-transform min-w-[64px] min-h-[48px] px-2 tap-target-sm ${
        isActive ? "text-forest-green" : "text-on-surface-variant"
      }`}
    >
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isActive ? "fill-current" : ""}`} />
      <span
        className={`text-caption font-caption ${isActive ? "font-bold" : ""}`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-lg shadow-[0_-4px_20px_rgba(27,67,50,0.08)] rounded-t-xl flex justify-around items-center px-4 py-3">
      {bottomNavItems.map((item) => (
        <BottomNavLink key={item.to} item={item} />
      ))}
    </nav>
  );
}
