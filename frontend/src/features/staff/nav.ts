import {
  LayoutDashboard, ClipboardList, LayoutGrid, UtensilsCrossed, Tag, CreditCard,
  History, QrCode, Bell, Users, BarChart3, Settings, type LucideIcon,
} from "lucide-react";

export interface StaffNavItem {
  key: string;
  path: string;
  label: string;
  icon: LucideIcon;
}

export const STAFF_NAV: StaffNavItem[] = [
  { key: "dashboard", path: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { key: "live", path: "/staff/orders", label: "Live Orders", icon: ClipboardList },
  { key: "tables", path: "/staff/tables", label: "Tables", icon: LayoutGrid },
  { key: "menu", path: "/staff/menu", label: "Menu", icon: UtensilsCrossed },
  { key: "categories", path: "/staff/categories", label: "Categories", icon: Tag },
  { key: "payments", path: "/staff/payments", label: "Payments", icon: CreditCard },
  { key: "history", path: "/staff/history", label: "Order History", icon: History },
  { key: "qr", path: "/staff/qr", label: "QR Codes", icon: QrCode },
  { key: "notifications", path: "/staff/notifications", label: "Notifications", icon: Bell },
  { key: "team", path: "/staff/team", label: "Staff", icon: Users },
  { key: "reports", path: "/staff/reports", label: "Reports", icon: BarChart3 },
  { key: "settings", path: "/staff/settings", label: "Settings", icon: Settings },
];
