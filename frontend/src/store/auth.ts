import { create } from "zustand";
import type { Staff } from "@/features/auth/api";

interface AuthState {
  token: string | null;
  staff: Staff | null;
  setAuth: (token: string, staff: Staff, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("access_token"),
  staff: null,
  setAuth: (token, staff, refreshToken) => {
    localStorage.setItem("access_token", token);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    set({ token, staff });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ token: null, staff: null });
  },
}));
