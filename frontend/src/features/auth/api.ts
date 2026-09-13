import { api } from "@/lib/api";

export interface Staff {
  id: string;
  email: string;
  full_name: string;
  role: "OWNER" | "MANAGER" | "CHEF" | "WAITER" | "CASHIER";
  cafe: string | null;
  is_active: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  staff: Staff;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login/", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get<Staff>("/auth/me/");
  return data;
}
