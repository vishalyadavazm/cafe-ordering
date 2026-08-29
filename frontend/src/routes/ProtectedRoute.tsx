import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/store/auth";

// Guards staff routes. Customer routes are public.
export function ProtectedRoute() {
  const token = useAuth((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/staff/login" replace />;
}
