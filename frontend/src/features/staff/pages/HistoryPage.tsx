import { useState } from "react";
import { Search } from "lucide-react";
import { rupee } from "@/lib/mockData";
import { useMockOrders } from "@/store/mockOrders";
import { StatusChip } from "@/components/common/StatusChip";

const FILTERS = ["all", "new", "preparing", "ready", "served"];

export function HistoryPage() {
  const orders = useMockOrders((s) => s.orders);
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const list = orders
    .filter((o) => (f === "all" || o.status === f) && (!q || String(o.id).includes(q) || String(o.table).includes(q)))
    .sort((a, b) => b.id - a.id);

  return (
    <>
      <div className="page-head"><div><div className="eyebrow">Records</div><h2>Order History</h2><p>Search and filter every order.</p></div></div>
      <div className="panel">
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div className="searchbar" style={{ flex: 1, minWidth: 180, marginTop: 0 }}>
            <Search size={15} color="var(--muted)" />
            <input placeholder="Search order # or table…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FILTERS.map((s) => (
              <button key={s} className={"tab " + (f === s ? "on" : "")} onClick={() => setF(s)} style={{ textTransform: "capitalize" }}>{s}</button>
            ))}
          </div>
        </div>
        <table className="dtable">
          <thead><tr><th>Order</th><th>Table</th><th>Items</th><th>Amount</th><th>Status</th><th>Payment</th><th>Time</th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td className="mono" style={{ fontWeight: 700 }}>#{o.id}</td><td className="mono">#{o.table}</td>
                <td>{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ").slice(0, 42)}…</td>
                <td className="mono">{rupee(o.total)}</td><td><StatusChip s={o.status} /></td>
                <td><span className={"chip " + (o.payment === "Paid" ? "c-green" : "c-amber")}>{o.payment}</span></td>
                <td className="mono" style={{ color: "var(--muted)" }}>{o.time}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>No matching orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
