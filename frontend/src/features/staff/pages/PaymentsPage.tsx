import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { rupee } from "@/lib/mockData";
import { useMockOrders } from "@/store/mockOrders";

const METHODS = [{ name: "UPI", v: 58, c: "#1E5C48" }, { name: "Card", v: 27, c: "#C88A3C" }, { name: "Cash", v: 15, c: "#3B6FB5" }];
const SUMMARY: [string, string, string][] = [["Collected", "₹42,850", "var(--brand)"], ["Online", "₹36,420", "var(--accent)"], ["Cash", "₹6,430", "var(--info)"], ["Refunded", "₹340", "var(--danger)"]];

export function PaymentsPage() {
  const orders = useMockOrders((s) => s.orders);
  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Finance</div><h2>Payments</h2><p>Transactions & revenue for today.</p></div></div>
      <div className="stat-grid" style={{ marginBottom: 18 }}>
        {SUMMARY.map((s, i) => (
          <div className="stat" key={i}><div className="lab">{s[0]}</div><div className="val" style={{ color: s[2] }}>{s[1]}</div></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Recent transactions</h3></div>
          <table className="dtable">
            <thead><tr><th>Order</th><th>Table</th><th>Amount</th><th>Method</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {orders.slice().sort((a, b) => b.id - a.id).map((o) => (
                <tr key={o.id}>
                  <td className="mono" style={{ fontWeight: 700 }}>#{o.id}</td><td className="mono">#{o.table}</td>
                  <td className="mono">{rupee(o.total)}</td>
                  <td>{o.payment === "Cash" ? "Cash" : "UPI"}</td>
                  <td><span className={"chip " + (o.payment === "Paid" ? "c-green" : "c-amber")}>{o.payment === "Paid" ? "Paid" : "Pending"}</span></td>
                  <td className="mono" style={{ color: "var(--muted)" }}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>By method</h3></div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={METHODS} dataKey="v" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {METHODS.map((m, i) => <Cell key={i} fill={m.c} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v + "%"} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            {METHODS.map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: m.c }} /><span style={{ flex: 1 }}>{m.name}</span><b className="mono">{m.v}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
