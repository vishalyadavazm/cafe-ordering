import { api } from "@/lib/api";

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  upi_vpa: string | null;
  gst_rate: string;
  currency: string;
  is_active: boolean;
}

export async function getMyCafe() {
  const { data } = await api.get<Cafe>("/cafes/me/");
  return data;
}
