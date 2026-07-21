import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";
import { supabase } from "@/lib/supabase";
import { checkAdminStatus } from "@/lib/checkAdmin";

export function Component() {
  return <AdminGuard />;
}

export function AdminGuard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminStatus(supabase, user?.email).then(setIsAdmin);
  }, [user?.email]);

  // Aún cargando
  if (isAdmin === null) {
    return (
      <div className="min-h-dvh bg-deep-forest flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
