import { Link, useLocation } from "react-router-dom";
import { Compass, TrendingUp, Heart, MessageCircle } from "lucide-react";
import type { BottomNavItem } from "@/constants/navLinks";
import { bottomNavItems } from "@/constants/navLinks";

/** Mapa de icono a componente Lucide */
const iconMap = {
  Compass,
  TrendingUp,
  Heart,
  MessageCircle,
} as const;

function BottomNavLink({ item }: { item: BottomNavItem }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.to;
  const Icon = iconMap[item.icon as keyof typeof iconMap];

  return (
    <Link
      to={item.to}
      className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${
        isActive ? "text-heritage-gold" : "text-on-surface-variant"
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${isActive ? "fill-current" : ""}`} />
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
