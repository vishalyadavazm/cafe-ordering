import { create } from "zustand";
import { CAFE, now, rupee, seedOrders, type OrderItemMock, type OrderMock, type OrderStatus } from "@/lib/mockData";

// Demo-only order board shared by the customer flow and the staff console, so
// placing an order on a phone shows up live in the kitchen kanban — exactly
// like the original prototype, just split across real routes instead of one
// component's local state. Swapped for the real orders API page by page.

export interface Toast {
  id: string;
  type: "new" | "info";
  title: string;
  sub: string;
  orderId?: number;
  sticky?: boolean;
}

interface PlaceOrderInput {
  items: OrderItemMock[];
  subtotal: number;
  tax: number;
  total: number;
  payment: "Paid" | "Cash";
}

interface MockOrdersState {
  orders: OrderMock[];
  toasts: Toast[];
  nextId: number;
  placeOrder: (input: PlaceOrderInput) => number;
  advance: (id: number, next: OrderStatus | null) => void;
  reject: (id: number) => void;
  dropToast: (id: string) => void;
}

let audioCtx: AudioContext | null = null;
function ding() {
  try {
    const win = window as typeof window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = win.AudioContext ?? win.webkitAudioContext;
    if (!Ctx) return;
    const ctx = audioCtx ?? new Ctx();
    audioCtx = ctx;
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = "sine";
      o.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.13;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch {
    // audio is best-effort only
  }
}

function makeToast(toast: Omit<Toast, "id">): Toast {
  const id = Math.random().toString(36).slice(2);
  const full = { ...toast, id };
  if (!toast.sticky) {
    setTimeout(() => useMockOrders.getState().dropToast(id), 4200);
  }
  return full;
}

export const useMockOrders = create<MockOrdersState>((set, get) => ({
  orders: seedOrders,
  toasts: [],
  nextId: 1048,
  placeOrder: ({ items, subtotal, tax, total, payment }) => {
    const id = get().nextId;
    const order: OrderMock = { id, table: CAFE.table, items, subtotal, tax, total, payment, status: "new", time: now(), instructions: "" };
    const toast = makeToast({
      type: "new",
      title: `New order · #${id}`,
      sub: `Table ${CAFE.table} · ${items.reduce((s, i) => s + i.qty, 0)} items · ${rupee(total)}`,
      orderId: id,
      sticky: true,
    });
    set((s) => ({ orders: [...s.orders, order], nextId: id + 1, toasts: [...s.toasts, toast] }));
    ding();
    return id;
  },
  advance: (id, next) => {
    if (!next) return;
    const labels: Record<string, string> = { accepted: "accepted", preparing: "in the kitchen", ready: "ready to serve", served: "served" };
    const table = get().orders.find((o) => o.id === id)?.table ?? "";
    const toast = makeToast({ type: "info", title: `Order #${id} ${labels[next]}`, sub: `Table ${table}` });
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: next } : o)), toasts: [...s.toasts, toast] }));
  },
  reject: (id) => {
    const toast = makeToast({ type: "info", title: `Order #${id} rejected`, sub: "Removed from the queue" });
    set((s) => ({ orders: s.orders.filter((o) => o.id !== id), toasts: [...s.toasts.filter((t) => t.orderId !== id), toast] }));
  },
  dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
