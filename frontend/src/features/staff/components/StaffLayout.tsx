import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, Coffee, Menu as MenuIcon, X } from "lucide-react";
import { STAFF_NAV } from "@/features/staff/nav";
import { useAuth } from "@/store/auth";
import { useMockOrders } from "@/store/mockOrders";
import { CAFE } from "@/lib/mockData";

export function StaffLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const staff = useAuth((s) => s.staff);
  const logout = useAuth((s) => s.logout);
  const orders = useMockOrders((s) => s.orders);
  const toasts = useMockOrders((s) => s.toasts);
  const advance = useMockOrders((s) => s.advance);
  const reject = useMockOrders((s) => s.reject);
  const dropToast = useMockOrders((s) => s.dropToast);

  const newCount = orders.filter((o) => o.status === "new").length;

  function handleLogout() {
    logout();
    navigate("/staff/login", { replace: true });
  }

  function go(path: string) {
    navigate(path);
    setSideOpen(false);
  }

  return (
    <div className="dash">
      {sideOpen && <div className="scrim-side" onClick={() => setSideOpen(false)} />}
      <aside className={"sidebar " + (sideOpen ? "open" : "")}>
        <div className="side-brand">
          <div className="brand-badge" style={{ width: 34, height: 34, borderRadius: 10 }}><Coffee size={18} /></div>
          <div><div className="bn">{CAFE.name}</div><div className="bs">Staff console</div></div>
        </div>
        {STAFF_NAV.map((n) => {
          const I = n.icon;
          const on = location.pathname === n.path;
          const badge = n.key === "live" ? newCount : null;
          return (
            <button key={n.key} className={"nav-item " + (on ? "on" : "")} onClick={() => go(n.path)}>
              <I size={17} /> {n.label}{badge != null && badge > 0 && <span className="badge">{badge}</span>}
            </button>
          );
        })}
        <div className="nav-logout">
          {staff && <div style={{ padding: "0 8px 8px", fontSize: 12, color: "#a99f8d" }}>{staff.full_name} · {staff.role}</div>}
          <button className="nav-item" onClick={handleLogout}><X size={17} /> Log out</button>
        </div>
      </aside>

      <main className="main">
        <div className="staff-topbar" style={{ alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button className="icon-btn hamb" onClick={() => setSideOpen(true)}><MenuIcon size={18} /></button>
        </div>
        <Outlet />
      </main>

      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={"toast " + (t.type === "new" ? "new-order" : "")}>
            <div className="ti">{t.type === "new" ? <Bell size={18} /> : <CheckCircle2 size={18} />}</div>
            <div className="tt">
              <b>{t.type === "new" ? "🔔 " + t.title : t.title}</b>
              <small>{t.sub}</small>
              {t.type === "new" && t.sticky && (
                <div className="acts">
                  <button className="t-accept" onClick={() => { advance(t.orderId!, "accepted"); dropToast(t.id); navigate("/staff/orders"); }}>Accept</button>
                  <button className="t-reject" onClick={() => { reject(t.orderId!); dropToast(t.id); }}>Reject</button>
                </div>
              )}
            </div>
            <button onClick={() => dropToast(t.id)} style={{ opacity: 0.6 }}><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
