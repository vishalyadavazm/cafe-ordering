import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Customer flow is reached via /t/:qrToken (from the QR). Staff lives under /staff.
import { WelcomePage } from "@/features/customer/pages/WelcomePage";
import { MenuPage } from "@/features/customer/pages/MenuPage";
import { CartPage } from "@/features/customer/pages/CartPage";
import { PaymentPage } from "@/features/customer/pages/PaymentPage";
import { ConfirmedPage } from "@/features/customer/pages/ConfirmedPage";
import { TrackOrderPage } from "@/features/customer/pages/TrackOrderPage";

import { LoginPage } from "@/features/auth/pages/LoginPage";

import { StaffLayout } from "@/features/staff/components/StaffLayout";
import { DashboardPage } from "@/features/staff/pages/DashboardPage";
import { LiveOrdersPage } from "@/features/staff/pages/LiveOrdersPage";
import { TablesPage } from "@/features/staff/pages/TablesPage";
import { MenuManagementPage } from "@/features/staff/pages/MenuManagementPage";
import { PaymentsPage } from "@/features/staff/pages/PaymentsPage";
import { HistoryPage } from "@/features/staff/pages/HistoryPage";
import { QRCodesPage } from "@/features/staff/pages/QRCodesPage";
import { NotificationsPage } from "@/features/staff/pages/NotificationsPage";
import { StaffRosterPage } from "@/features/staff/pages/StaffRosterPage";
import { ReportsPage } from "@/features/staff/pages/ReportsPage";
import { SettingsPage } from "@/features/staff/pages/SettingsPage";

export const router = createBrowserRouter([
  { path: "/t/:qrToken", element: <WelcomePage /> },
  { path: "/t/:qrToken/menu", element: <MenuPage /> },
  { path: "/t/:qrToken/cart", element: <CartPage /> },
  { path: "/t/:qrToken/pay", element: <PaymentPage /> },
  { path: "/t/:qrToken/confirmed", element: <ConfirmedPage /> },
  { path: "/order/:session", element: <TrackOrderPage /> },

  { path: "/staff/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { path: "/staff", element: <DashboardPage /> },
          { path: "/staff/orders", element: <LiveOrdersPage /> },
          { path: "/staff/tables", element: <TablesPage /> },
          { path: "/staff/menu", element: <MenuManagementPage /> },
          { path: "/staff/categories", element: <MenuManagementPage /> },
          { path: "/staff/payments", element: <PaymentsPage /> },
          { path: "/staff/history", element: <HistoryPage /> },
          { path: "/staff/qr", element: <QRCodesPage /> },
          { path: "/staff/notifications", element: <NotificationsPage /> },
          { path: "/staff/team", element: <StaffRosterPage /> },
          { path: "/staff/reports", element: <ReportsPage /> },
          { path: "/staff/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
