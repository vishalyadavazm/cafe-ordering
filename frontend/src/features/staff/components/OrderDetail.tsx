import { MapPin, X } from "lucide-react";
import { KCOLS, rupee, type OrderMock, type OrderStatus } from "@/lib/mockData";

export function OrderDetail({ order, onClose, advance }: { order: OrderMock; onClose: () => void; advance: (id: number, next: OrderStatus | null) => void }) {
  const col = KCOLS.find((c) => c.key === order.status);
  const tl: { t: string; e: string }[] = [
    { t: order.time, e: "Order placed" },
    ...(["accepted", "preparing", "ready", "served"].includes(order.status) ? [{ t: order.time, e: "Accepted" }] : []),
    ...(["preparing", "ready", "served"].includes(order.status) ? [{ t: order.time, e: "Preparation started" }] : []),
    ...(["ready", "served"].includes(order.status) ? [{ t: order.time, e: "Ready" }] : []),
    ...(order.status === "served" ? [{ t: order.time, e: "Served" }] : []),
  ];
  return (
    <div className="sheet-wrap" style={{ position: "fixed", zIndex: 120, alignItems: "center", justifyContent: "center" }}>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="panel" style={{ position: "relative", width: 440, maxWidth: "92vw", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700 }}>#{order.id}</div>
            <div className="dk-table" style={{ marginTop: 6 }}><MapPin size={12} /> Table {order.table}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="divider" />
        <div className="eyebrow">Order</div>
        {order.items.map((it, i) => (
          <div className="dk-item" key={i} style={{ fontSize: 13.5, padding: "5px 0" }}><span>{it.qty} × {it.name}</span><span className="mono">{rupee(it.price * it.qty)}</span></div>
        ))}
        {order.instructions && (
          <>
            <div className="eyebrow" style={{ marginTop: 14 }}>Special instructions</div>
            <div style={{ background: "var(--accent-soft)", color: "#8a5c1f", padding: "9px 12px", borderRadius: 10, fontSize: 13, marginTop: 6 }}>"{order.instructions}"</div>
          </>
        )}
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontFamily: "var(--display)", fontSize: 18 }}>{rupee(order.total)}</span>
          <span className={"chip " + (order.payment === "Paid" ? "c-green" : "c-amber")}>{order.payment}</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 16 }}>Timeline</div>
        <div style={{ marginTop: 8 }}>
          {tl.map((s, i) => (<div key={i} className="dk-item" style={{ fontSize: 12.5, color: "var(--ink2)" }}><span>{s.e}</span><span className="mono" style={{ color: "var(--muted)" }}>{s.t}</span></div>))}
        </div>
        {col && col.act && (
          <button className={"dk-act a-" + order.status} style={{ marginTop: 18, padding: 12 }} onClick={() => { advance(order.id, col.next); onClose(); }}>{col.act}</button>
        )}
      </div>
    </div>
  );
}
