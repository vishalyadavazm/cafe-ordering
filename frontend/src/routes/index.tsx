import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Customer flow is reached via /t/:qrToken (from the QR). Staff lives under /staff.
import { WelcomePage } from "@/features/customer/pages/WelcomePage";
import { MenuPage } from "@/features/customer/pages/MenuPage";
import { CartPage } from "@/features/customer/pages/CartPage";
import { PaymentPage } from "@/features/customer/pages/PaymentPage";
import { TrackOrderPage } from "@/features/customer/pages/TrackOrderPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/staff/pages/DashboardPage";
import { LiveOrdersPage } from "@/features/staff/pages/LiveOrdersPage";

export const router = createBrowserRouter([
  { path: "/t/:qrToken", element: <WelcomePage /> },
  { path: "/t/:qrToken/menu", element: <MenuPage /> },
  { path: "/t/:qrToken/cart", element: <CartPage /> },
  { path: "/t/:qrToken/pay", element: <PaymentPage /> },
  { path: "/order/:session", element: <TrackOrderPage /> },

  { path: "/staff/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/staff", element: <DashboardPage /> },
      { path: "/staff/orders", element: <LiveOrdersPage /> },
      // TODO: kitchen, tables, menu-mgmt, reports, payments, history, settings
    ],
  },
]);
