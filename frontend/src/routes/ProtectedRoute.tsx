import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth/api";
import { useAuth } from "@/store/auth";

// Guards staff routes. Customer routes are public.
export function ProtectedRoute() {
  const token = useAuth((s) => s.token);
  const staff = useAuth((s) => s.staff);
  const setStaff = useAuth((s) => s.setStaff);
  const logout = useAuth((s) => s.logout);

  // Only the token survives a page refresh (zustand isn't persisted); rehydrate
  // the staff profile from /auth/me so the header etc. have something to show.
  const { data, error } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token && !staff,
    retry: false,
  });

  useEffect(() => {
    if (data) setStaff(data);
  }, [data, setStaff]);

  useEffect(() => {
    if (error) logout();
  }, [error, logout]);

  if (!token) return <Navigate to="/staff/login" replace />;
  return <Outlet />;
}
