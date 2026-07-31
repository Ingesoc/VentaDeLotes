export interface NavLink {
  label: string;
  to: string;
}

export interface BottomNavItem {
  label: string;
  to: string;
  /** Nombre del icono Lucide */
  icon: "Compass" | "TrendingUp" | "Heart" | "Phone";
}

export const bottomNavItems: BottomNavItem[] = [
  { label: "Explorar", to: "/projects", icon: "Compass" },
  { label: "Invertir", to: "/investment", icon: "TrendingUp" },
  { label: "Guardados", to: "/saved", icon: "Heart" },
  { label: "Contacto", to: "/contact", icon: "Phone" },
];
