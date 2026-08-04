import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuthContext";
import {
  LayoutDashboard,
  Home,
  LogOut,
  Eye,
  Warehouse,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/lots", label: "Lotes", icon: Warehouse },
  { to: "/", label: "Ver sitio", icon: Home, exact: true },
];

export function Component() {
  return <AdminLayout />;
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col md:flex-row">
      {/* Barra lateral: cabecera apilada en móvil, sidebar fija en desktop */}
      <aside className="w-full md:w-64 shrink-0 bg-deep-forest text-warm-white flex flex-col md:h-dvh">
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between gap-4 md:block">
          <h2 className="font-display-lg text-xl text-soft-gold shrink-0">
            Verdant Admin
          </h2>
          <p className="text-caption text-warm-white/60 mt-0 md:mt-1 truncate min-w-0">
            {user?.email}
          </p>
        </div>

        <nav className="flex-1 p-3 md:p-4 flex flex-wrap md:flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-body-md whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-heritage-gold/20 text-soft-gold font-semibold"
                    : "text-warm-white/70 hover:bg-white/5 hover:text-warm-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-warm-white/70 hover:bg-white/5 hover:text-warm-white transition-colors text-body-md font-body-md"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0 md:overflow-auto">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-8 py-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-caption font-caption uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            Panel de Administración
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
