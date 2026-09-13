import { api } from "@/lib/api";

export interface PublicCafe {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  currency: string;
  gst_rate: string;
}

export interface PublicTable {
  id: string;
  number: number;
  label: string | null;
}

export interface PublicAddOn {
  id: string;
  name: string;
  price: string;
}

export interface PublicMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  is_veg: boolean;
  addons: PublicAddOn[];
}

export interface PublicCategory {
  id: string;
  name: string;
  sort_order: number;
  items: PublicMenuItem[];
}

export interface PublicMenuResponse {
  cafe: PublicCafe;
  table: PublicTable;
  categories: PublicCategory[];
}

export async function getPublicMenu(qrToken: string) {
  const { data } = await api.get<PublicMenuResponse>(`/public/${qrToken}/`);
  return data;
}

export interface CreateOrderItem {
  menu_item_id: string;
  quantity: number;
  addon_ids?: string[];
}

export interface CreateOrderResponse {
  id: string;
  order_number: number;
  customer_session: string;
  total: number;
}

export async function createPublicOrder(qrToken: string, items: CreateOrderItem[], specialInstructions?: string) {
  const { data } = await api.post<CreateOrderResponse>(`/public/${qrToken}/orders/`, {
    items,
    special_instructions: specialInstructions,
  });
  return data;
}

export type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";

export interface PublicOrderItem {
  id: string;
  name_snapshot: string;
  unit_price: string;
  quantity: number;
  line_total: string;
  addons: { name: string; price: string }[];
}

export interface PublicOrder {
  id: string;
  order_number: number;
  status: OrderStatus;
  table_number: number | null;
  cafe_name: string;
  items: PublicOrderItem[];
  subtotal: string;
  tax: string;
  total: string;
  payment_status: string;
  payment_method: string | null;
  special_instructions: string;
  created_at: string;
  accepted_at: string | null;
  ready_at: string | null;
  served_at: string | null;
}

export async function getPublicOrder(session: string) {
  const { data } = await api.get<PublicOrder>(`/public/orders/${session}/`);
  return data;
}
