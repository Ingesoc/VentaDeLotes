export interface NavLink {
  label: string;
  to: string;
}

export const desktopNavLinks: NavLink[] = [
  { label: "Proyectos", to: "/projects" },
  { label: "Inversión", to: "/investment" },
  { label: "Cómo Comprar", to: "/how-to-buy" },
  { label: "Contacto", to: "/contact" },
];

export interface BottomNavItem {
  label: string;
  to: string;
  /** Nombre del icono de Lucide — importado dinámicamente en el componente */
  icon: "Compass" | "TrendingUp" | "Heart" | "MessageCircle";
}

export const bottomNavItems: BottomNavItem[] = [
  { label: "Explorar", to: "/projects", icon: "Compass" },
  { label: "Invertir", to: "/investment", icon: "TrendingUp" },
  { label: "Guardados", to: "/saved", icon: "Heart" },
  { label: "Chat", to: "/contact", icon: "MessageCircle" },
];
