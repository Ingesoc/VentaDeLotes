import { NavLink, Outlet, useNavigate } from "react-router-dom";
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

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Barra lateral */}
      <aside className="w-64 bg-deep-forest text-warm-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display-lg text-xl text-soft-gold">
            Verdant Admin
          </h2>
          <p className="text-caption text-warm-white/60 mt-1">
            {user?.email}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-body-md font-body-md transition-all ${
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
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-warm-white/70 hover:bg-white/5 hover:text-warm-white transition-all text-body-md font-body-md"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 px-8 py-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-caption font-caption uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            Panel de Administración
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
