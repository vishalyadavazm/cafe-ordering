// Shared types mirroring docs/API_CONTRACT.md. Keep in sync with backend schemas.
export type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
export type PaymentMethod = "UPI" | "CARD" | "CASH";

export interface MenuItem {
  id: string; name: string; description?: string; price: number;
  image_url?: string; is_veg: boolean; is_available: boolean; category_id?: string;
}
export interface Category { id: string; name: string; sort_order: number; }
// TODO: Order, OrderItem, Table, Cafe, Staff ...
