// Prototype seed data & helpers, ported verbatim. This whole module is mock/demo
// data — swapped for real API calls page by page as the backend catches up
// (see docs/PROJECT_PLAN.md status checklist).

export interface MenuItemMock {
  id: number;
  name: string;
  cat: string;
  price: number;
  veg: boolean;
  e: string;
  d: string;
  avail: boolean;
  addons?: boolean;
}

export interface AddOnMock {
  name: string;
  price: number;
}

export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "served";

export interface OrderItemMock {
  name: string;
  qty: number;
  price: number;
}

export interface OrderMock {
  id: number;
  table: number;
  items: OrderItemMock[];
  subtotal: number;
  tax: number;
  total: number;
  payment: "Paid" | "Cash";
  status: OrderStatus;
  time: string;
  instructions: string;
}

export const CAFE = { name: "Brew Cafe", table: 12 };

export const CATS = ["All", "Breakfast", "Starters", "Main Course", "Pizza", "Burgers", "Snacks", "Desserts", "Beverages"];

export const TINT: Record<string, string> = {
  Breakfast: "#FBEFD6", Starters: "#F6E7D8", "Main Course": "#EFE3CE", Pizza: "#F9E4D6",
  Burgers: "#F3E7D2", Snacks: "#EFEAD6", Desserts: "#F5E6EC", Beverages: "#E4EFE9",
};

export const ADDONS: AddOnMock[] = [
  { name: "Extra Cheese", price: 40 }, { name: "Extra Paneer", price: 60 }, { name: "Extra Sauce", price: 20 },
];

export const MENU: MenuItemMock[] = [
  { id: 1, name: "Masala Omelette", cat: "Breakfast", price: 149, veg: false, e: "🍳", d: "Three-egg omelette with onion, chilli & fresh coriander", avail: true },
  { id: 2, name: "Aloo Paratha", cat: "Breakfast", price: 129, veg: true, e: "🫓", d: "Two stuffed parathas with butter & house curd", avail: true },
  { id: 3, name: "Avocado Toast", cat: "Breakfast", price: 219, veg: true, e: "🥑", d: "Sourdough, smashed avocado, chilli flakes & poached egg", avail: true },
  { id: 4, name: "Paneer Tikka", cat: "Starters", price: 220, veg: true, e: "🧆", d: "Grilled cottage cheese with Indian spices", avail: true, addons: true },
  { id: 5, name: "Peri Chicken Wings", cat: "Starters", price: 260, veg: false, e: "🍗", d: "Six smoky peri-peri glazed wings", avail: true },
  { id: 6, name: "Crispy Corn", cat: "Starters", price: 179, veg: true, e: "🌽", d: "Golden fried corn tossed with pepper & herbs", avail: false },
  { id: 7, name: "Butter Chicken", cat: "Main Course", price: 320, veg: false, e: "🍛", d: "Tandoori chicken in silky tomato-butter gravy", avail: true },
  { id: 8, name: "Dal Makhani", cat: "Main Course", price: 240, veg: true, e: "🍲", d: "Slow-cooked black lentils with cream & butter", avail: true },
  { id: 9, name: "Veg Biryani", cat: "Main Course", price: 250, veg: true, e: "🍚", d: "Fragrant basmati with vegetables & cool raita", avail: true },
  { id: 10, name: "Paneer Pizza", cat: "Pizza", price: 299, veg: true, e: "🍕", d: "Freshly baked pizza topped with paneer, capsicum & mozzarella", avail: true, addons: true },
  { id: 11, name: "Margherita Pizza", cat: "Pizza", price: 249, veg: true, e: "🍕", d: "Classic tomato, basil & buffalo mozzarella", avail: true, addons: true },
  { id: 12, name: "BBQ Chicken Pizza", cat: "Pizza", price: 349, veg: false, e: "🍕", d: "Smoky BBQ chicken, red onion & extra cheese", avail: true, addons: true },
  { id: 13, name: "Classic Veg Burger", cat: "Burgers", price: 169, veg: true, e: "🍔", d: "Crunchy patty, lettuce, tomato & house sauce", avail: true },
  { id: 14, name: "Chicken Cheese Burger", cat: "Burgers", price: 219, veg: false, e: "🍔", d: "Grilled chicken, cheddar & smoky mayo", avail: true },
  { id: 15, name: "Peri Peri Fries", cat: "Snacks", price: 120, veg: true, e: "🍟", d: "Crispy salted fries dusted with peri-peri", avail: true },
  { id: 16, name: "Nachos Grande", cat: "Snacks", price: 199, veg: true, e: "🧀", d: "Loaded nachos, cheese, salsa & jalapeño", avail: true },
  { id: 17, name: "Chocolate Brownie", cat: "Desserts", price: 149, veg: true, e: "🍫", d: "Warm fudgy brownie with a vanilla scoop", avail: true },
  { id: 18, name: "Berry Cheesecake", cat: "Desserts", price: 189, veg: true, e: "🍰", d: "New York style with fresh berry compote", avail: true },
  { id: 19, name: "Cold Coffee", cat: "Beverages", price: 120, veg: true, e: "🥤", d: "Blended iced coffee with a cream float", avail: true },
  { id: 20, name: "Cappuccino", cat: "Beverages", price: 110, veg: true, e: "☕", d: "Double-shot espresso with steamed milk foam", avail: true },
  { id: 21, name: "Fresh Lime Soda", cat: "Beverages", price: 90, veg: true, e: "🍋", d: "Sweet-salt lime cooler with soda", avail: true },
  { id: 22, name: "Masala Chai", cat: "Beverages", price: 60, veg: true, e: "🍵", d: "Slow-brewed spiced Indian tea", avail: true },
];

export const findFood = (id: number) => MENU.find((m) => m.id === id);

export const rupee = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

export const now = () => {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
};

export const seedOrders: OrderMock[] = [
  { id: 1044, table: 5, items: [{ name: "Butter Chicken", qty: 1, price: 320 }, { name: "Veg Biryani", qty: 1, price: 250 }, { name: "Masala Chai", qty: 2, price: 60 }], subtotal: 690, tax: 35, total: 735, payment: "Paid", status: "preparing", time: "4:02 PM", instructions: "Less spicy" },
  { id: 1045, table: 9, items: [{ name: "Margherita Pizza", qty: 2, price: 249 }, { name: "Cold Coffee", qty: 2, price: 120 }], subtotal: 738, tax: 38, total: 776, payment: "Paid", status: "accepted", time: "4:08 PM", instructions: "" },
  { id: 1046, table: 2, items: [{ name: "Chicken Cheese Burger", qty: 1, price: 219 }, { name: "Peri Peri Fries", qty: 1, price: 120 }], subtotal: 339, tax: 17, total: 356, payment: "Cash", status: "new", time: "4:12 PM", instructions: "Extra napkins" },
  { id: 1047, table: 14, items: [{ name: "Berry Cheesecake", qty: 1, price: 189 }, { name: "Cappuccino", qty: 1, price: 110 }], subtotal: 299, tax: 15, total: 314, payment: "Paid", status: "ready", time: "3:56 PM", instructions: "" },
  { id: 1043, table: 7, items: [{ name: "Paneer Tikka", qty: 1, price: 220 }, { name: "Dal Makhani", qty: 1, price: 240 }], subtotal: 460, tax: 23, total: 483, payment: "Paid", status: "served", time: "3:40 PM", instructions: "" },
];

export const KCOLS: { key: OrderStatus; label: string; color: string; next: OrderStatus | null; act: string | null }[] = [
  { key: "new", label: "New Orders", color: "var(--new)", next: "accepted", act: "Accept Order" },
  { key: "accepted", label: "Accepted", color: "var(--info)", next: "preparing", act: "Start Preparation" },
  { key: "preparing", label: "Preparing", color: "var(--warn)", next: "ready", act: "Mark as Ready" },
  { key: "ready", label: "Ready", color: "var(--ready)", next: "served", act: "Mark as Served" },
  { key: "served", label: "Served", color: "var(--muted)", next: null, act: null },
];

export const TABLE_STATES: { n: number; status: string; since: string }[] = (() => {
  const arr: { n: number; status: string; since: string }[] = [];
  const preset: Record<number, string> = {
    2: "ordering", 5: "preparing", 7: "occupied", 9: "preparing", 14: "ready", 12: "ordering",
    1: "occupied", 3: "occupied", 6: "occupied", 8: "occupied", 11: "occupied", 15: "occupied", 18: "occupied", 20: "occupied",
  };
  for (let i = 1; i <= 25; i++) arr.push({ n: i, status: preset[i] || "available", since: preset[i] ? `${Math.floor(Math.random() * 40) + 5}m` : "—" });
  return arr;
})();

export const REV_DATA = [
  { h: "11a", r: 2100 }, { h: "12p", r: 4200 }, { h: "1p", r: 6800 }, { h: "2p", r: 5400 }, { h: "3p", r: 3900 },
  { h: "4p", r: 5200 }, { h: "5p", r: 4600 }, { h: "6p", r: 6100 }, { h: "7p", r: 7300 },
];

export const POPULAR = [
  { name: "Butter Chicken", e: "🍛", n: 64 }, { name: "Cold Coffee", e: "🥤", n: 58 }, { name: "Paneer Pizza", e: "🍕", n: 49 },
  { name: "Peri Peri Fries", e: "🍟", n: 41 }, { name: "Masala Chai", e: "🍵", n: 37 },
];

export const WEEK = [
  { d: "Mon", r: 34000 }, { d: "Tue", r: 38200 }, { d: "Wed", r: 41000 }, { d: "Thu", r: 36800 },
  { d: "Fri", r: 52400 }, { d: "Sat", r: 61200 }, { d: "Sun", r: 57800 },
];
