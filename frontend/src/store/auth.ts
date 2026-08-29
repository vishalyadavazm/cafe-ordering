import { create } from "zustand";

interface AuthState {
  token: string | null;
  staff: { id: string; full_name: string; role: string } | null;
  setAuth: (token: string, staff: AuthState["staff"]) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("access_token"),
  staff: null,
  setAuth: (token, staff) => { localStorage.setItem("access_token", token); set({ token, staff }); },
  logout: () => { localStorage.removeItem("access_token"); set({ token: null, staff: null }); },
}));
