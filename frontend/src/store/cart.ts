import { create } from "zustand";

export interface CartAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  price: number;
  veg: boolean;
  imageUrl: string | null;
  qty: number;
  addons: CartAddon[];
}

interface AddableItem {
  id: string;
  name: string;
  price: number;
  veg: boolean;
  imageUrl: string | null;
}

function lineKey(itemId: string, addons: CartAddon[]) {
  return itemId + "|" + addons.map((a) => a.id).sort().join(",");
}

interface CartState {
  cart: CartLine[];
  addItem: (item: AddableItem, addons?: CartAddon[]) => void;
  decItem: (key: string) => void;
  removeLine: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  addItem: (item, addons = []) =>
    set((state) => {
      const key = lineKey(item.id, addons);
      const i = state.cart.findIndex((c) => c.key === key);
      if (i >= 0) {
        const next = [...state.cart];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return { cart: next };
      }
      return { cart: [...state.cart, { key, itemId: item.id, name: item.name, price: item.price, veg: item.veg, imageUrl: item.imageUrl, qty: 1, addons }] };
    }),
  decItem: (key) =>
    set((state) => {
      const i = state.cart.findIndex((c) => c.key === key);
      if (i < 0) return state;
      const next = [...state.cart];
      if (next[i].qty > 1) next[i] = { ...next[i], qty: next[i].qty - 1 };
      else next.splice(i, 1);
      return { cart: next };
    }),
  removeLine: (key) => set((state) => ({ cart: state.cart.filter((c) => c.key !== key) })),
  clear: () => set({ cart: [] }),
}));

export function qtyOfItem(cart: CartLine[], itemId: string) {
  return cart.filter((c) => c.itemId === itemId).reduce((s, c) => s + c.qty, 0);
}

export function lineTotal(c: CartLine) {
  return (c.price + c.addons.reduce((s, a) => s + a.price, 0)) * c.qty;
}
