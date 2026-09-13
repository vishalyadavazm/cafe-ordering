import { create } from "zustand";
import { findFood, type AddOnMock } from "@/lib/mockData";

export interface CartLine {
  id: number;
  qty: number;
  addons: AddOnMock[];
}

interface CartState {
  cart: CartLine[];
  addItem: (id: number, addons?: AddOnMock[]) => void;
  decItem: (id: number) => void;
  removeLine: (idx: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  addItem: (id, addons = []) =>
    set((state) => {
      const key = JSON.stringify(addons);
      const i = state.cart.findIndex((c) => c.id === id && JSON.stringify(c.addons || []) === key);
      if (i >= 0) {
        const next = [...state.cart];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return { cart: next };
      }
      return { cart: [...state.cart, { id, qty: 1, addons }] };
    }),
  decItem: (id) =>
    set((state) => {
      const i = state.cart.map((c) => c.id).lastIndexOf(id);
      if (i < 0) return state;
      const next = [...state.cart];
      if (next[i].qty > 1) next[i] = { ...next[i], qty: next[i].qty - 1 };
      else next.splice(i, 1);
      return { cart: next };
    }),
  removeLine: (idx) => set((state) => ({ cart: state.cart.filter((_, i) => i !== idx) })),
  clear: () => set({ cart: [] }),
}));

export function qtyOf(cart: CartLine[], id: number) {
  return cart.filter((c) => c.id === id).reduce((s, c) => s + c.qty, 0);
}

export function lineTotal(c: CartLine) {
  const f = findFood(c.id);
  const a = (c.addons || []).reduce((s, x) => s + x.price, 0);
  return ((f?.price ?? 0) + a) * c.qty;
}
