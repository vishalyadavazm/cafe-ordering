import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Bell, CheckCircle2, ClipboardList, LayoutGrid, TrendingUp, UtensilsCrossed } from "lucide-react";
import { CAFE, POPULAR, REV_DATA, TINT, rupee, type OrderMock } from "@/lib/mockData";
import { useMockOrders } from "@/store/mockOrders";
import { StatusChip } from "@/components/common/StatusChip";

export function DashboardPage() {
  const orders = useMockOrders((s) => s.orders);

  const counts = useMemo(() => {
    const c: Record<string, number> = { new: 0, accepted: 0, preparing: 0, ready: 0, served: 0 };
    orders.forEach((o) => { if (c[o.status] != null) c[o.status]++; });
    return c;
  }, [orders]);

  const stats = [
    { lab: "Today's Orders", val: "128", ic: ClipboardList, col: "var(--brand)", bg: "var(--brand-soft)", trend: "+12% vs yesterday" },
    { lab: "Pending", val: String(counts.new), ic: Bell, col: "var(--new)", bg: "#f1e9f8" },
    { lab: "Preparing", val: String(counts.preparing), ic: UtensilsCrossed, col: "var(--warn)", bg: "var(--accent-soft)" },
    { lab: "Ready", val: String(counts.ready), ic: CheckCircle2, col: "var(--ready)", bg: "#e4f2ea" },
    { lab: "Today's Revenue", val: "₹42,850", ic: TrendingUp, col: "var(--accent)", bg: "var(--accent-soft)", trend: "+8% vs yesterday" },
    { lab: "Active Tables", val: "18 / 25", ic: LayoutGrid, col: "var(--info)", bg: "#eaf0f8" },
  ] as const;

  const recent: OrderMock[] = orders.slice().sort((a, b) => b.id - a.id).slice(0, 5);
  const maxN = POPULAR[0].n;

  return (
    <>
      <div className="page-head">
        <div><div className="eyebrow">Overview · Today</div><h2>Good afternoon, team ☕</h2><p>Here's how {CAFE.name} is running right now.</p></div>
      </div>
      <div className="stat-grid">
        {stats.map((s, i) => {
          const I = s.ic;
          return (
            <div className="stat" key={i}>
              <div className="lab">{s.lab}</div><div className="val">{s.val}</div>
              {"trend" in s && s.trend && <div className="trend"><TrendingUp size={12} /> {s.trend}</div>}
              <div className="ic" style={{ background: s.bg, color: s.col }}><I size={17} /></div>
            </div>
          );
        })}
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Revenue today</h3><span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)" }}>₹42,850</span></div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REV_DATA} margin={{ top: 5, right: 6, left: -16, bottom: 0 }}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E5C48" stopOpacity={0.35} /><stop offset="100%" stopColor="#1E5C48" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="h" tick={{ fontSize: 11, fill: "#8A7B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8A7B6B" }} axisLine={false} tickLine={false} tickFormatter={(v) => "₹" + v / 1000 + "k"} />
                <Tooltip formatter={(v: number) => rupee(v)} contentStyle={{ borderRadius: 12, border: "1px solid #ECE1D0", fontSize: 12, fontFamily: "DM Sans" }} />
                <Area type="monotone" dataKey="r" stroke="#1E5C48" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Popular today</h3></div>
          {POPULAR.map((p, i) => (
            <div className="pop-item" key={i}>
              <div className="pop-thumb" style={{ background: TINT[Object.keys(TINT)[i]] || "#f0e7d6" }}>{p.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600 }}><span>{p.name}</span><span className="mono" style={{ color: "var(--muted)" }}>{p.n}</span></div>
                <div className="pop-bar"><i style={{ width: (p.n / maxN) * 100 + "%" }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel" style={{ marginTop: 18 }}>
        <div className="panel-head"><h3>Recent orders</h3></div>
        <table className="dtable">
          <thead><tr><th>Order</th><th>Table</th><th>Items</th><th>Amount</th><th>Status</th><th>Payment</th><th>Time</th></tr></thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td className="mono" style={{ fontWeight: 700 }}>#{o.id}</td>
                <td className="mono" style={{ fontWeight: 700 }}>#{o.table}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                <td className="mono">{rupee(o.total)}</td>
                <td><StatusChip s={o.status} /></td>
                <td><span className={"chip " + (o.payment === "Paid" ? "c-green" : "c-amber")}>{o.payment}</span></td>
                <td style={{ color: "var(--muted)" }} className="mono">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
