export interface NavLink {
  label: string;
  to: string;
}

export interface BottomNavItem {
  label: string;
  to: string;
  /** Nombre del icono Lucide */
  icon: "Compass" | "TrendingUp" | "Heart" | "MessageCircle";
}

export const bottomNavItems: BottomNavItem[] = [
  { label: "Explorar", to: "/projects", icon: "Compass" },
  { label: "Invertir", to: "/investment", icon: "TrendingUp" },
  { label: "Guardados", to: "/saved", icon: "Heart" },
  { label: "Chat", to: "/contact", icon: "MessageCircle" },
];
