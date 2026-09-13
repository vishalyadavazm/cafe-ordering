import { Bell, Check, CheckCircle2, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useMockOrders } from "@/store/mockOrders";
import type { OrderMock } from "@/lib/mockData";

const MAP: Record<string, [string, LucideIcon, string]> = {
  new: ["New order received", Bell, "var(--new)"],
  accepted: ["Order accepted", Check, "var(--info)"],
  preparing: ["Preparation started", UtensilsCrossed, "var(--warn)"],
  ready: ["Order ready to serve", CheckCircle2, "var(--ready)"],
  served: ["Order served", Check, "var(--muted)"],
};

export function NotificationsPage() {
  const orders = useMockOrders((s) => s.orders);
  const feed = orders.slice().sort((a, b) => b.id - a.id).map((o: OrderMock) => {
    const [t, I, c] = MAP[o.status];
    return { o, t, I, c };
  });
  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Activity</div><h2>Notifications</h2><p>Everything happening across the floor.</p></div></div>
      <div className="panel">
        {feed.map(({ o, t, I, c }, i) => (
          <div key={i} className="pop-item">
            <div className="pop-thumb" style={{ background: "#f3ece0", color: c }}><I size={18} /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{t} — <span className="mono">#{o.id}</span></div><div style={{ fontSize: 12.5, color: "var(--muted)" }}>Table {o.table} · {o.time}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}
